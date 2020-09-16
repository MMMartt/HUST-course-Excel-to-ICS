/* eslint-disable no-console */
import { gray, red } from 'chalk'
import path from 'path'
import readline from 'readline'
import { parseExcelToCurriculum } from './excelParser'
import { readdir, readInputToSelect } from './utils/IOHelper'

const inputDir = path.join(__dirname, '../input')

async function start(rl: readline.Interface) {
  console.log(gray('reading files from "./input" ...\n'))

  const filenames = (await readdir(inputDir)).filter(a => a !== 'readme.md')
  if (filenames.length === 0) {
    return red('no excel files found in "./input"')
  }
  const filesToUse = await readInputToSelect(filenames, {
    describe: 'select files to parse',
    rl,
  })

  console.log(filesToUse)

  const curriculums = parseExcelToCurriculum(filesToUse)

  // const

  return 'finished'
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

start(rl)
  .then(r => console.log(r))
  .catch(e => {
    throw e
  })
  .finally(() => {
    rl.close()
  })
