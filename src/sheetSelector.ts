import { SheetCurriculum } from './curriculum'
import { isSameSimpleArray, replaceFirst, replaceLast } from './utils/arrayOp'

export type Status = {
  raw: Array<SheetCurriculum>
  current: [number, number, number, number]
  selected: Array<[number, number, number, number]>
  result: {
    type: 'success' | 'fail'
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

const getAvailableDeepIndex = (status: Status): number[] => {
  if (status.current[0] === -1) return status.raw.map((_, i) => i)
  if (status.current[1] === -1)
    return status.raw[status.current[0]].gradeCurriculums.map((_, i) => i)
  if (status.current[2] === -1)
    return status.raw[status.current[0]].gradeCurriculums[
      status.current[1]
    ].classCurriculums.map((_, i) => i)
  if (status.current[3] === -1)
    return status.raw[status.current[0]].gradeCurriculums[
      status.current[1]
    ].courseInfo.map((_, i) => i)
  return []
}

/**
 * 因为外层会捉错误，故当只需变更为错误时，就直接抛错了
 */
const operationHandler = (status: Status, action: OperationTypes): Status => {
  switch (action.type) {
    case 'down': {
      const index = action.index
      const feasibility = getAvailableDeepIndex(status).includes(index)
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
