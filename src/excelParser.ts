import path from 'path'
import XLSX from 'xlsx'
import {
  ClassCurriculumUnit,
  ClassInfo,
  CourseInfo,
  GradeCurriculum,
  GradeInfo,
  Schedule,
  SheetCurriculum,
  SheetInfo,
} from './curriculum'
import { extractObjectValueToList as o2l } from './utils/arrayOp'
import { fbIfFalse } from './utils/logic'
import { findAllMatches } from './utils/regex'

type XlsxSheetContentType = {
  [key: string]: string
}

type XlsxJsonType = {
  sheets: Array<{
    name: string
    content: Array<XlsxSheetContentType>
  }>
  name: string
}

const SPLIT_CHS = ['-', '—']

const getFirstWeek = (): string => {
  return '2020-08-31'
}

const parseGradeInfo = (name: string): GradeInfo => {
  const result = /(\d+)级(.*)/.exec(name)
  return {
    department: (result || [])[2],
    grade: (result || [])[1],
    rawTitle: name,
  }
}

const parseExistedCourses = (str: string): CourseInfo[] => {
  str += ' ' // 正则的缘故
  const reg = /\s*(((?![0-9+W]+\/[0-9\.]*)\S)+)\s*(([0-9+W]+)\/([0-9\.]+))\s*(((?!\S*\s*[0-9+W]+\/[0-9\.]*).)*\S)\s/gm
  const result = findAllMatches(str, reg).map(a => [a[1], a[4], a[5], a[6]])
  return result.map(([name, classHour, credit, teacher]) => ({
    name,
    classHour,
    credit: parseFloat(credit),
    teacher,
  }))
}

const parseCourseInfo = (raw: XlsxSheetContentType[]): CourseInfo[] => {
  const result: CourseInfo[] = raw.reduce((acc, curr) => {
    const strList = o2l(curr)
    return [...acc, ...strList.flatMap(s => parseExistedCourses(s))]
  }, [] as CourseInfo[])
  return result
}

const parseClassInfoList = (raw: XlsxSheetContentType): ClassInfo[] => {
  return o2l(raw)
    .slice(1)
    .map(
      (str): ClassInfo => {
        return ((result: string[]): ClassInfo => ({
          studentNum: parseInt(result[2]),
          name: result[1],
        }))(fbIfFalse(/^(.*)\s*合计：(\d*)人\s*$/.exec(str) as string[], []))
      }
    )
}

const weekdayMatcher = (str: string): number => {
  return [
    '星期天',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
  ].indexOf(str)
}

/**
 * parse '星期三' | "微机原理与接口技术  3-11周    东十二楼207\n课程上机：编译技术课程设计 12-13     软件学院五楼机房"
 */
const parseSingleScheduleStr = (
  day: number,
  str: string,
  [start, end]: [number, number] = [1, 2]
): [number, Schedule[], [number, number]] => {
  const newDay = weekdayMatcher(str)
  if (newDay > -1) return [newDay, [], [start, end]]
  // 迷之 BUG
  const regexResult = /(\d*)—(\d*)/.exec(str)
  if (!!regexResult)
    return [day, [], [parseInt(regexResult[1]), parseInt(regexResult[2])]]
  // 哎呀先简单搞一下算了
  // 让我们假设时间段的属性内不包含空格，且每一行仅包含一个
  // 这里会存在一个问题，如果有一个以上可被parse对象，会被搞两次，不过不影响吧，应该

  const schedules = str
    .split('\n')
    .filter(a => a !== '')
    .map(l =>
      l
        .split(' ')
        .map(s => s.trim())
        .filter(a => a !== '')
        .map(a => {
          try {
            return parseWeekStr(a)
          } catch (_) {
            return a
          }
        })
    )
    .reduce((schedules, line): Schedule[] => {
      if (line.length === 0) return schedules
      const week = line.findIndex(a => typeof a === 'object')
      if (week < 0) {
        if (schedules.length === 0) return schedules
        const lastSchedule = schedules[schedules.length - 1]
        return [
          ...schedules.slice(0, schedules.length - 1),
          {
            ...lastSchedule,
            location: '',
            timeArrange: { start, end },
            info:
              lastSchedule.info +
              '|' +
              lastSchedule.location +
              line.filter(c => typeof c === 'string').join('|'),
          },
        ]
      }
      return [
        ...schedules,
        {
          day: day as never,
          location:
            (line.slice(week + 1)[line.length - week - 2] as string) || '',
          timeArrange: { start, end },
          title: line[0] as string,
          weeks: line[week] as [number, number][],
          info: line.slice(week + 1, line.length - 1).join('-'),
        },
      ]
    }, [] as Schedule[])
  return [day, schedules, [start, end]]
}

/**
 * parse SingleScheduleStr List
 * 这个写法不是很舒服
 * 因为出了一些和想象不太一样的问题改成这样了
 * TODO:改得优雅点
 * @returns new Day in the Week and CourseLength of CourseScheduleList
 */
const parseScheduleStr = (
  day: number,
  rawJsonValueList: XlsxSheetContentType,
  keyMap: string[],
  targetPos: Schedule[][]
): number => {
  let start = 1,
    end = 2,
    newDay: number,
    schedules: Schedule[]
  const objKeyMap = Object.keys(rawJsonValueList)
  return o2l(rawJsonValueList).reduce((oldDay, str, i): number => {
    ;[newDay, schedules, [start, end]] = parseSingleScheduleStr(
      oldDay,
      str,
      [start, end] // should be overwritten
    )
    if (schedules.length > 0)
      targetPos[keyMap.indexOf(objKeyMap[i])].push(...schedules)
    return newDay
  }, day)
}

const parseClassCurriculums = (
  raw: XlsxSheetContentType[]
): ClassCurriculumUnit[] => {
  const classInfoList = parseClassInfoList(raw[0])
  const classMap = Object.keys(raw[0]).slice(1)
  const curriculums = classInfoList.map(() => [])
  let day = 1
  raw.forEach(line => {
    day = parseScheduleStr(day, line, classMap, curriculums)
  })

  return curriculums.map((c, i) => ({
    classInfo: classInfoList[i],
    curriculums: c,
  }))
}

const parseSingleSheet = (
  raw: XlsxJsonType['sheets'][number]
): GradeCurriculum => {
  const gradeInfo = parseGradeInfo(raw.name)
  const i = raw.content.findIndex(
    curr => o2l(curr).findIndex(str => !!/专业班\s*星期\s*节次/.exec(str)) > -1
  )

  return {
    gradeInfo,
    courseInfo: parseCourseInfo(raw.content.slice(0, i)),
    classCurriculums: parseClassCurriculums(raw.content.slice(i)),
  }
}

const parseWeekStr = (str: string): [number, number][] => {
  const meaningless = [' ', ',', '，', '周', '、']
  const connecter = SPLIT_CHS
  const numbers = Array.from('0123456789')
  const parsed = Array.from(str + '|').reduce(
    ([curr, r]: [string, string[]], c): [string, string[]] => {
      if (meaningless.includes(c)) return curr ? ['', [...r, curr]] : ['', r]
      if (connecter.includes(c)) {
        return curr ? ['', [...r, curr, '-']] : ['', [...r, '-']]
      }
      if (numbers.includes(c)) return [curr + c, r]
      if (c === '|') {
        return ['', r.concat(curr ? [curr] : [])]
      }

      throw new Error('unexpected token while parsing: ' + c)
    },
    ['', []] as [string, string[]]
  )
  const tokens: Array<'-' | '|' | number> = parsed[1].map(a =>
    a === '-' ? a : parseInt(a)
  )

  return tokens.concat(['|']).reduce(
    (
      [[pre, inConnection], acc],
      curr
    ): [[number | null, boolean], [number, number][]] => {
      if (curr === '-') return [[pre, true], acc]
      if (curr === '|')
        if (!pre) return [[null, false], acc]
        else
          return [
            [null, false],
            // '|' is the last one, pre must be number
            [...acc, [pre, pre] as [number, number]],
          ]
      if (!pre) return [[curr, false], acc]
      if (inConnection)
        return [
          [null, false],
          [...acc, [pre, curr]],
        ]
      return [
        [curr, false],
        [...acc, [pre, pre]],
      ]
    },
    [[null, false], []] as [[number | null, boolean], [number, number][]]
  )[1]
}

const parseSheetInfo = (raw: XlsxJsonType): SheetInfo => {
  // 本来应该只传文件名
  const name = path.parse(raw.name).name
  return {
    collage: fbIfFalse(/\d([^\s\d]+)\d/.exec(name) as Array<string>, [''])[1],
    firstWeekStartAt: new Date(Date.parse(getFirstWeek())),
    rawTitle: name,
    semester:
      fbIfFalse(/第(.*)学期/.exec(name) as string[], [])[1] === '一' ? 1 : 2,
    startYear: parseInt(fbIfFalse(/\d\-/.exec(name) as string[], ['2020'])[0]),
  }
}

const parseGradeCurriculum = (raw: XlsxJsonType): GradeCurriculum[] => {
  return raw['sheets'].map(a => parseSingleSheet(a))
}

export const parseExcelToCurriculum = (
  filePaths: string[]
): Array<SheetCurriculum> => {
  const xlsxList: XlsxJsonType[] = filePaths.map(p => {
    const wb = XLSX.readFile(p)
    const sheets = wb.SheetNames.map(name => ({
      name,
      content: XLSX.utils.sheet_to_json(wb.Sheets[name]),
    }))
    return {
      sheets,
      name: p,
    }
  }) as never
  // return [curriculumGenerator()]
  return xlsxList.map(singleSheetJson => ({
    sheetInfo: parseSheetInfo(singleSheetJson),
    gradeCurriculums: parseGradeCurriculum(singleSheetJson),
  }))
}

export const _MOCHA_TEST_EXPORTS_ = {
  // parseScheduleStr,
  parseSingleScheduleStr,
  parseWeekStr,
}
