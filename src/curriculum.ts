export type ClassInfo = {
  name: string
  studentNum: number
}

export type CourseInfo = {
  name: string
  teacher: string
  credit: number
  classHour: string
}

type Schedule = {
  title: string
  location: string
  info: string
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6 // 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'
  timeArrange: {
    start: number
    end: number
  }
  weeks: {
    start: number
    end: number
  }
}

export type ClassCurriculumUnit = {
  classInfo: ClassInfo
  curriculums: Array<Schedule>
}

export type GradeInfo = {
  rawTitle: string
  department: string
  grade: string
}

export type GradeCurriculum = {
  gradeInfo: GradeInfo
  courseInfo: Array<CourseInfo>
  classCurriculums: Array<ClassCurriculumUnit>
}

export type SheetInfo = {
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
  schedules: Array<Schedule>
}

export const isCourseOf = (
  schedule: Schedule,
  courseInfo: CourseInfo
): boolean => {
  // TODO: should contain some advanced check technical
  return schedule.title === courseInfo.name
}

export const querySchedule = (
  schedules: Schedule[],
  courseInfo: CourseInfo
): Array<Schedule> => {
  return schedules.filter(schedule => {
    return isCourseOf(schedule, courseInfo)
  })
}

export const genCourseCurriculumUnit = (
  raw: SheetCurriculum[],
  selectedIndexes: [number, number, number, number]
): CourseCurriculumUnit => {
  const sheet = raw[selectedIndexes[0]]
  const grade = sheet.gradeCurriculums[selectedIndexes[1]]
  const _class = grade.classCurriculums[selectedIndexes[2]]
  const course = grade.courseInfo[selectedIndexes[3]]
  return {
    sheetInfo: sheet.sheetInfo,
    gradeInfo: grade.gradeInfo,
    classInfo: _class.classInfo,
    courseInfo: course,
    schedules: querySchedule(_class.curriculums, course),
  }
}
