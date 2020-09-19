import { grey, white } from 'chalk'
import { SheetCurriculum } from './curriculum'
import {
  findFirstSameArray,
  mapConcat,
  replaceFirst,
  replaceLast,
} from './utils/arrayOp'

export type Status = {
  raw: Array<SheetCurriculum>
  current: [number, number, number, number[]]
  selected: Array<[number, number, number, number]>
  result: {
    type: 'success' | 'fail' | 'finished' | 'init'
    error?: Error
    cmd?: OperationTypes
  }
}

export type OperationTypes =
  | {
      type: 'up'
    }
  | {
      type: 'down'
      indexes: number[]
    }
  | {
      type: 'select'
    }
  | {
      type: 'remove'
      indexes: number[]
    }
  | {
      type: 'edit'
      // TODO: DO THIS
    }
  | {
      type: 'finish'
    }

export function initCurrentStatus(raw: SheetCurriculum[]): Status {
  return {
    raw,
    current: [-1, -1, -1, []],
    selected: [],
    result: {
      type: 'init',
    },
  }
}

export const getAvailableNextLevel = (status: Status): string[] => {
  if (status.current[0] === -1) return status.raw.map(a => a.sheetInfo.collage)
  if (status.current[1] === -1)
    return status.raw[status.current[0]].gradeCurriculums.map(
      a => a.gradeInfo.rawTitle
    )
  if (status.current[2] === -1)
    return status.raw[status.current[0]].gradeCurriculums[
      status.current[1]
    ].classCurriculums.map(a => a.classInfo.name)
  // if (status.current[3] === -1)
  return status.raw[status.current[0]].gradeCurriculums[
    status.current[1]
  ].courseInfo.map(a => a.name)
  // return []
}

const getAvailableNextLevelIndex = (status: Status): number[] => {
  return getAvailableNextLevel(status).map((_, i) => i)
}

export const mapCurrent = (a: Status['current']): Status['selected'] => {
  return mapConcat(a.slice(0, -1), a[3].length === 0 ? [-1] : a[3]) as never
}

/**
 * 因为外层会捉错误，故当只需变更为错误时，就直接抛错了
 */
const operationHandler = (status: Status, action: OperationTypes): Status => {
  if (status.result.type === 'finished') throw new TypeError('finished already')
  switch (action.type) {
    case 'down': {
      const indexes = action.indexes
      if (indexes.length > 1 && status.current[2] === -1)
        throw new RangeError('最后一层以外一次只能选择一个选项')
      const available = getAvailableNextLevelIndex(status)
      // console.log(available, indexes)
      const repeatedIndex = available.findIndex(i => indexes.includes(i))
      if (repeatedIndex === -1)
        throw new Error(indexes[repeatedIndex] + 'index out of range')
      return {
        ...status,
        result: { type: 'success' },
        current:
          status.current[2] === -1
            ? (replaceFirst(status.current, a => a === -1, indexes[0]) as never)
            : [
                ...(status.current.slice(0, -1) as [number, number, number]),
                indexes,
              ],
      }
    }

    case 'up': {
      if (status.current[0] === -1)
        throw new RangeError('it is already top level now')
      return {
        ...status,
        result: { type: 'success' },
        current:
          status.current[3].length === 0
            ? (replaceLast(
                status.current.slice(0, 3),
                a => a !== -1,
                -1
              ).concat([[]]) as never)
            : ([...status.current.slice(0, -1), []] as never),
      }
    }

    case 'select': {
      // TODO: support multi lessons
      const emptyError = new Error('be not able to be selected')
      if (status.current.includes(-1)) throw emptyError
      const toBeSelected = mapCurrent(status.current)
      const existedArray = findFirstSameArray(status.selected, toBeSelected)
      if (existedArray) throw new Error('this item has been selected')
      if (toBeSelected.length === 0) throw emptyError
      return {
        ...status,
        result: { type: 'success' },
        current: [-1, -1, -1, []],
        // 应当不存在引用问题
        selected: status.selected.concat(toBeSelected),
      }
    }

    case 'remove': {
      const indexes = action.indexes
      if (indexes.findIndex(i => i >= status.selected.length) > -1)
        throw new Error('max index out of range')

      return {
        ...status,
        result: { type: 'success' },
        selected: status.selected.filter((_, i) => !indexes.includes(i)),
      }
    }

    case 'finish': {
      return {
        ...status,
        result: { type: 'finished' },
      }
    }

    default:
      throw new Error('unexpected operation.')
  }
}

export const applyAction: typeof operationHandler = (status, action) => {
  try {
    return operationHandler(status, action)
  } catch (error) {
    return {
      ...status,
      result: {
        type: 'fail',
        cmd: action,
        error,
      },
    }
  }
}

export const applyActionList = (
  status: Status,
  [action, ...restActions]: OperationTypes[]
): Status => {
  if (!action)
    return {
      ...status,
      result: {
        type: 'success',
      },
    }
  const resultStatus = applyAction(status, action)
  if (resultStatus.result.type === 'fail') {
    return {
      ...status,
      result: resultStatus.result,
    }
  }
  return applyActionList(resultStatus, restActions)
}

export const getNamedSelection = (
  raw: SheetCurriculum[],
  selection: [number, number, number, number]
): [string, string, string, string] => {
  return selection.map((vi, i, r) => {
    if (vi === -1) return grey('空')
    const text = [
      () => raw[vi].sheetInfo.collage,
      () => raw[r[0]].gradeCurriculums[vi].gradeInfo.rawTitle,
      () =>
        raw[r[0]].gradeCurriculums[r[1]].classCurriculums[vi].classInfo.name,
      () => raw[r[0]].gradeCurriculums[r[1]].courseInfo[vi].name,
    ][i]()
    return white(text)
  }) as never
}
