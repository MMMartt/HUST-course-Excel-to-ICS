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
  return raw.split(' ').map(a => a.trim())
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
    return `up ${grey('- go upper level')}
down \${index} ${grey('- go next level')}
remove \${index} ${grey('- remove from selections')}
select \${index} ${grey('- select current course')}
show \${index} ${grey('- show selected courses detail')}
help \${index} ${grey('- show this message')}
finish
> `
  if (cmd[0] === 'show')
    return `${transformOptionString(
      status.selected.map(a => getNamedSelection(status.raw, a).join(' - '))
    )}
> `
  return `
current position: ${getNamedSelection(status.raw, status.current).join(' - ')}
selected courses: ${status.selected.length}
available next level:
${transformOptionString(getAvailableNextLevel(status))}
${
  status.result.type === 'success'
    ? green('last cmd success')
    : red(`last cmd fail: ${status.result.error}`)
}
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
    const answer = await readStdInput(question, () => true, rl)
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
    op['index'] = cmd[2]
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
    describe: 'select files to parse',
    rl,
  })

  // eslint-disable-next-line no-console
  console.log(filesToUse)

  const curriculums = parseExcelToCurriculum(filesToUse)

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

  const icalStr = parseSchedulesToIcal(finalSchedules)

  const outputFilename =
    (await readStdInput('export ical to(build.ics):', () => true, rl)).trim() ||
    'build.ics'

  await promisedFs.writeFile(
    path.join(outputDir, outputFilename),
    icalStr,
    'utf-8'
  )

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
