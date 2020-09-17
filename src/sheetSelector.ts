import { Type } from 'typescript'
import { CourseCurriculumUnit, SheetCurriculum } from './curriculum'

export type Status = {
  raw: Array<SheetCurriculum>
  current: [number, number, number, number]
  selected: Array<CourseCurriculumUnit>
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

const getAvailableIndex = () => {}

const operationHandler = (raw: Status, action: OperationTypes): Status => {
  throw new Error('fuck')

  // TODO:
  switch (action.type) {
    case 'down':
      break
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
        error: error as string,
      },
    }
  }
}
