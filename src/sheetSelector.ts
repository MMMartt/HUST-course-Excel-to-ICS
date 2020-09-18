import { grey, white } from 'chalk'
import { SheetCurriculum } from './curriculum'
import { isSameSimpleArray, replaceFirst, replaceLast } from './utils/arrayOp'

export type Status = {
  raw: Array<SheetCurriculum>
  current: [number, number, number, number]
  selected: Array<[number, number, number, number]>
  result: {
    type: 'success' | 'fail' | 'finished'
    error?: string
  }
}

export type OperationTypes =
  | {
      type: 'up'
    }
  | {
      type: 'down'
      index: number
    }
  | {
      type: 'select'
    }
  | {
      type: 'remove'
      index: number
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
    current: [-1, -1, -1, -1],
    selected: [],
    result: {
      type: 'success',
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
  if (status.current[3] === -1)
    return status.raw[status.current[0]].gradeCurriculums[
      status.current[1]
    ].courseInfo.map(a => a.name)
  return []
}

const getAvailableNextLevelIndex = (status: Status): number[] => {
  return getAvailableNextLevel(status).map((_, i) => i)
}

/**
 * 因为外层会捉错误，故当只需变更为错误时，就直接抛错了
 */
const operationHandler = (status: Status, action: OperationTypes): Status => {
  if (status.result.type === 'finished') throw 'finished already'
  switch (action.type) {
    case 'down': {
      const index = action.index
      const feasibility = getAvailableNextLevelIndex(status).includes(index)
      if (!feasibility) {
        throw 'index out of range'
      }
      return {
        ...status,
        result: { type: 'success' },
        current: replaceFirst(
          status.current,
          a => a === -1,
          index
        ) as typeof status.current,
      }
    }
    case 'up': {
      if (status.current[0] === -1) throw 'it is already top level now'
      return {
        ...status,
        result: { type: 'success' },
        current: replaceLast(
          status.current,
          a => a !== -1,
          -1
        ) as typeof status.current,
      }
    }
    case 'select': {
      // TODO: support multi lessons
      if (status.current.includes(-1)) throw 'be not able to be selected'
      const toBeSelected = status.current
      if (status.selected.find(a => isSameSimpleArray(a, toBeSelected)))
        throw 'this item has been selected'
      return {
        ...status,
        result: { type: 'success' },
        current: [-1, -1, -1, -1],
        // 应当不存在引用问题
        selected: status.selected.concat([toBeSelected]),
      }
    }
    case 'remove': {
      const index = action.index
      if (status.selected.length <= index) {
        throw 'index out of range'
      }
      return {
        ...status,
        result: { type: 'success' },
        selected: [
          ...status.selected.slice(0, index),
          ...status.selected.slice(index + 1),
        ],
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
        error: action.type + ': ' + (error as string),
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
      () => raw[r[0]].gradeCurriculums[r[1]].courseInfo[vi],
    ][i]()
    return white(text)
  }) as never
}
