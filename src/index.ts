import { gray, green, grey, red, white } from 'chalk'
import { promises as promisedFs } from 'fs'
import path from 'path'
import readline from 'readline'
import { genCourseCurriculumUnit } from './curriculum'
import { parseExcelToCurriculum } from './excelParser'
import { parseSchedulesToIcal } from './icalWriter'
import {
  applyAction,
  getAvailableNextLevel,
  getNamedSelection,
  initCurrentStatus,
  mapCurrent,
  OperationTypes,
  Status,
} from './sheetSelector'
import {
  readInputToSelect,
  readStdInput,
  transformOptionString,
} from './utils/IOHelper'

const inputDir = path.join(__dirname, '../input')
const outputDir = path.join(__dirname, '../output')

const parseCmd = (raw: string): string[] => {
  return raw
    .split(' ')
    .map(a => a.trim())
    .filter(a => a !== '')
}

const generateLastCmdHint = (result: Status['result']): string => {
  switch (result.type) {
    case 'init':
      return green('初始化成功')
    case 'success':
      return green('上条命令成功')
    case 'fail':
      // eslint-disable-next-line no-console
      console.warn(red(result.error))
      return red('上条命令失败:' + result.cmd + result.error)
    case 'finished':
      return green('已完成')
  }
}

/**
 * 应当输出一个这样的：
 * current position: [xlsx name] - [grade] - [class] - [course]
 * available next level:
 * - [0]: xxx
 * - [1]: xxx
 * ? for help
 * > (waiting for input)
 */
const generateQuestionString = (cmd: string[], status: Status): string => {
  if (cmd[0] === '?' || cmd[0] === 'help')
    return `up ${grey('- 去上一层（将清除最后一层选项）')}
down \${index} ${grey('- 去下一层（选课时可多选，通过空格分隔）')}
remove \${index} ${grey('- 去除已选课程，可多选，通过空格分隔')}
select \${index} ${grey('- 将本轮的课程添加')}
show \${index} ${grey('- 显示已选课程')}
help \${index} ${grey('- 显示此消息')}
finish ${grey('- 将已选课程导出')}
> `
  if (cmd[0] === 'show')
    return `${transformOptionString(
      status.selected.map(a => getNamedSelection(status.raw, a).join(' - '))
    )}
> `
  return `目前位置: \n${mapCurrent(status.current)
    .map(s => getNamedSelection(status.raw, s).join(' - '))
    .join('\n')}
已选课程数: ${status.selected.length}
下一层:
${transformOptionString(getAvailableNextLevel(status))}
${generateLastCmdHint(status.result)}
? for help
> `
}

const readAction = async (
  status: Status,
  rl: readline.Interface
): Promise<OperationTypes> => {
  const operationTypes = ['up', 'down', 'finish', 'remove', 'select']
  // const allOp = [...operationTypes, 'help', 'show', '?']
  let cmd: string[] = []

  const getAns = async (): Promise<void> => {
    if (operationTypes.includes(cmd[0])) return
    const question = white(generateQuestionString(cmd, status))

    let defaultProm = 'select'
    if (status.current[3].length === 0) defaultProm = 'down '
    const answer = await readStdInput(question, () => true, rl, defaultProm)
    cmd = parseCmd(answer)
    return await getAns()
  }

  await getAns()

  // 简陋地搞一下
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const op: any = {
    type: cmd[0],
  }
  if (['down', 'remove'].includes(cmd[0])) {
    op['indexes'] = cmd.slice(1).map(a => parseInt(a))
  }
  return op
}

async function start(rl: readline.Interface) {
  // eslint-disable-next-line no-console
  console.log(gray('reading files from "./input" ...\n'))

  const filenames = (await promisedFs.readdir(inputDir)).filter(
    a => a !== 'readme.md'
  )
  if (filenames.length === 0) {
    return red('no excel files found in "./input"')
  }
  const filesToUse = await readInputToSelect(filenames, {
    describe: '选择解析的 excel 表',
    rl,
  })

  // eslint-disable-next-line no-console
  console.log(filesToUse)

  const curriculums = parseExcelToCurriculum(
    filesToUse.map(a => path.join(inputDir, a))
  )

  // await promisedFs.writeFile(
  //   path.join(outputDir, 'testParsed.json'),
  //   JSON.stringify(curriculums, null, 2),
  //   {
  //     flag: 'w',
  //     encoding: 'utf-8',
  //   }
  // )

  let status = initCurrentStatus(curriculums)
  const getAns = async (): Promise<void> => {
    if (status.result.type === 'finished') return

    const action = await readAction(status, rl)
    status = applyAction(status, action)
    return await getAns()
  }

  await getAns()

  const finalSchedules = status.selected.map(s =>
    genCourseCurriculumUnit(curriculums, s)
  )

  // await promisedFs.writeFile(
  //   path.join(outputDir, 'testFinalSchedules.json'),
  //   JSON.stringify(finalSchedules, null, 2),
  //   {
  //     flag: 'w',
  //     encoding: 'utf-8',
  //   }
  // )

  const icalStr = parseSchedulesToIcal(finalSchedules)

  const outputFilename =
    (await readStdInput('export ical to(build.ics):', () => true, rl)).trim() ||
    'build.ics'

  await promisedFs.writeFile(path.join(outputDir, outputFilename), icalStr, {
    flag: 'w',
    encoding: 'utf-8',
  })

  return 'finished'
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

start(rl)
  // eslint-disable-next-line no-console
  .then(r => console.log(r))
  .catch(e => {
    throw e
  })
  .finally(() => {
    rl.close()
  })
