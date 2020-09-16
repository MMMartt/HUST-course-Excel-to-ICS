type ClassInfo = {
  name: string
  studentNum: number
}

type CourseInfo = {
  name: string
  teacher: string
  credit: number
  classHour: string
}

type Schedule = {
  location: string
  info: string
  weekStart: number
  weekEnd: number
  day: 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'
}

type CourseSchedule = {
  teacher: string
  schedules: Array<Schedule>
}

type CurriculumUnit = {
  classes: string[]
  courses: Array<CourseSchedule>
}

type GradeInfo = {
  rawTitle: string
  department: string
  grade: string
}

export type GradeCurriculum = {
  gradeInfo: GradeInfo
  courseInfo: Array<CourseInfo>
  classInfo: Array<ClassInfo>
  curriculums: Array<CurriculumUnit>
}

type SheetInfo = {
  rawTitle: string
  collage: string
  startYear: number
  semester: 1 | 2
  firstWeekStartAt: Date
}

export type SheetCurriculum = {
  sheetInfo: SheetInfo
  gradeCurriculums: Array<GradeCurriculum>
}

export type CourseCurriculumUnit = {
  sheetInfo: SheetInfo
  gradeInfo: GradeInfo
  courseInfo: CourseInfo
  classInfo: ClassInfo
  schedules: Array<CourseSchedule>
}

export type Status = {
  raw: Array<SheetCurriculum>
  current: {
    sheetIndex: number
    gradeIndex: number
    curriculumsIndex: number
  }
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
    current: {
      sheetIndex: -1,
      gradeIndex: -1,
      curriculumsIndex: -1,
    },
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

export const applyAction: typeof operationHandler = (raw, action) => {
  try {
    return operationHandler(raw, action)
  } catch (error) {
    return {
      ...raw,
      result: {
        type: 'fail',
        error: error as string,
      },
    }
  }
}
