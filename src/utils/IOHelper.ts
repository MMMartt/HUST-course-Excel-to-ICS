import { blue, bold, grey, white } from 'chalk'
/* eslint-disable no-console */
import { createInterface, Interface } from 'readline'

export const readStdInput = async (
  question: string,
  validator: (ans: string) => boolean = () => true,
  rl: Interface | null = null
): Promise<string> => {
  const _rl: Interface =
    rl || createInterface({ input: process.stdin, output: process.stdout })

  return new Promise(res => {
    return _rl.question(question, async ans => {
      if (validator(ans)) res(ans)
      else res(await readStdInput(question, validator, _rl))

      if (!rl) {
        // in this case，_rl is created in function
        _rl.close()
      }
    })
  })
}

export const transformOptionString = (options: string[]): string => {
  return options
    .map((option, i) => bold(white(`[${i}] `)) + blue(option))
    .join('\n')
}

type ReadInputToSelectionOptions = {
  describe?: string
  rl?: Interface
  multi?: boolean
}

export async function readInputToSelect(
  selections: string[],
  options: ReadInputToSelectionOptions = {}
): Promise<string[]> {
  const _options: ReadInputToSelectionOptions = {
    ...{
      // TODO: make this work
      multi: true,
    },
    ...options,
  }

  if (selections.length < 2) return selections
  if (_options.describe) console.log(white(_options.describe))

  console.log(transformOptionString(selections))

  const parseAnsToNums = (ans: string): number[] =>
    ans
      .split(' ')
      .filter(a => a !== '')
      .map(a => parseInt(a))

  const selectedOptions = parseAnsToNums(
    await readStdInput(
      white('select') + grey("(eg: '0 2')") + white(':'),
      ans => !parseAnsToNums(ans).find(a => a >= selections.length),
      _options.rl
    )
  ).reduce(
    (acc, i) => ({ ...acc, [i]: selections[i] }),
    {} as { [k: number]: string }
  )
  return Object.values(selectedOptions)
}
