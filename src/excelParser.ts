import XLSX from 'xlsx'
import {
  ClassCurriculumUnit,
  ClassInfo,
  CourseInfo,
  GradeCurriculum,
  GradeInfo,
  SheetCurriculum,
  SheetInfo,
} from './curriculum'
import path from 'path'
import { fbIfFalse } from './utils/logic'
import { extractObjectValueToList as o2l } from './utils/arrayOp'
import { findAllMatches } from './utils/regex'
import { curriculumGenerator } from '../test/curriculumExample'

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

const getFirstWeek = (): string => {
  return '2020-08-31'
}

const parseGradeInfo = (name: string): GradeInfo => {
  const result = /(\d+)级(*)/.exec(name)
  return {
    department: (result || [])[2],
    grade: (result || [])[1],
    rawTitle: name,
  }
}

const parseExistedCourses = (str: string): CourseInfo[] => {
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

const parseClassInfo = (raw: XlsxSheetContentType): ClassInfo => {
  return null as never
}

const parseClassCurriculums = (
  raw: XlsxSheetContentType[]
): ClassCurriculumUnit[] => {
  const classInfo = parseClassInfo(raw[0])
  return []
}

const parseSingleSheet = (
  raw: XlsxJsonType['sheets'][number]
): GradeCurriculum => {
  const gradeInfo = parseGradeInfo(raw.name)
  const i = raw.content.findIndex(curr => {
    o2l(curr).findIndex(str => /专业班\s*星期\s*节次/.exec(str)) > -1
  })

  return {
    gradeInfo,
    courseInfo: parseCourseInfo(raw.content.slice(0, i)),
    classCurriculums: parseClassCurriculums(raw.content.slice(i)),
  }
}

export const parseWeekStr = (str: string): [number, number][] => {
  const meaningless = [' ', ',', '，', '周']
  const connecter = ['-']
  const numbers = Array.from('0123456789')
  const parsed = Array.from(str + '|').reduce(
    ([curr, r]: [string, string[]], c): [string, string[]] => {
      if (meaningless.includes(c)) return curr ? ['', [...r, curr]] : ['', r]
      if (connecter.includes(c))
        return curr ? ['', [...r, curr, '-']] : ['', [...r, '-']]
      if (numbers.includes(c)) return [curr + c, r]
      if (c === '|') return ['', r.concat([curr])]

      throw 'unexpected token while parsing: ' + c
    },
    ['', []] as [string, string[]]
  )
  const tokens = parsed[1].map(a => (a === '-' ? a : parseInt(a)))

  return tokens.reduce(
    (
      [[pre, inConnection], acc],
      curr
    ): [[number | null, boolean], [number, number][]] => {
      if (curr === '-') return [[pre, true], acc]
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
    startYear: parseInt(fbIfFalse(/\d\~/.exec(name) as string[], ['2020'])[0]),
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
