import { CourseCurriculumUnit } from './curriculum'
import jsIcal from 'ical.js'

const TIME_ARRANGE = [
  [8, 0, 8, 45],
  [8, 55, 9, 40],
  [10, 10, 10, 55],
  [11, 5, 11, 50],
  [14, 0, 14, 45],
  [14, 50, 15, 35],
  [15, 55, 16, 40],
  [16, 45, 17, 30],
  [18, 30, 19, 15],
  [19, 20, 20, 5],
  [20, 15, 21, 0],
  [21, 5, 21, 50],
]
/**
 * TODO: 夏季冬季作息，可配置
 * @returns [H, M, H, M]
 */
const generateLessonTimePeriodByDay = (
  date: Date,
  lessonStartEnd: [number, number]
): [number, number, number, number] => {
  return [
    TIME_ARRANGE[lessonStartEnd[0]][0],
    TIME_ARRANGE[lessonStartEnd[0]][1],
    TIME_ARRANGE[lessonStartEnd[1]][0],
    TIME_ARRANGE[lessonStartEnd[1]][1],
  ]
}

const addScheduleToComp = (s: CourseCurriculumUnit, comp: jsIcal.Component) => {
  s.schedules.forEach(schedule => {
    const desc = `${s.gradeInfo.department} ${s.classInfo.name} ${s.classInfo.studentNum}人; ${s.courseInfo.credit}学分 ${s.courseInfo.classHour}学时 ${s.courseInfo.teacher}; ${schedule.info}`
    const startDay = s.sheetInfo.firstWeekStartAt
    Array.from(
      new Array(schedule.weeks.end - schedule.weeks.start + 1)
    ).forEach((_, i) => {
      const vevent = new jsIcal.Component('vevent')
      const date = new Date(startDay.getTime())
      date.setDate(
        date.getDate() +
          7 * (schedule.weeks.start - 1 + i) +
          schedule.day -
          date.getDay()
      )
      const event = new jsIcal.Event(vevent)
      const timePeriod = generateLessonTimePeriodByDay(date, [
        schedule.timeArrange.start,
        schedule.timeArrange.end,
      ])
      date.setHours(timePeriod[0], timePeriod[1])
      event.startDate = jsIcal.Time.fromJSDate(date, true)
      date.setHours(timePeriod[2], timePeriod[3])
      event.endDate = jsIcal.Time.fromJSDate(date, true)

      event.summary = s.courseInfo.name
      event.description = desc
      event.location = schedule.location

      comp.addSubcomponent(vevent)
    })
  })
}

export const parseSchedulesToIcal = (
  schedules: CourseCurriculumUnit[]
): string => {
  const comp = new jsIcal.Component(['vcalendar', [], []])

  comp.updatePropertyWithValue('prodid', '-//github/MMMartt')

  schedules.forEach(s => {
    addScheduleToComp(s, comp)
  })
  return comp.toString()
}
