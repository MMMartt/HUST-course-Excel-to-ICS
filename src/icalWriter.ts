import { CourseCurriculumUnit } from './curriculum'
import jsIcal from 'ical.js'

const parseScheduleToVevent = (
  comp: jsIcal.Component,
  s: CourseCurriculumUnit
): jsIcal.Component => {
  const vevent = new jsIcal.Component('vevent')
  // const event = new jsIcal.Event(vevent)
  // TODO: fuck
  return vevent
}

export const parseSchedulesToIcal = (
  schedules: CourseCurriculumUnit[]
): string => {
  const comp = new jsIcal.Component(['vcalendar', [], []])

  comp.updatePropertyWithValue('prodid', '-//github/MMMartt')

  schedules.forEach(s => {
    const vevent = parseScheduleToVevent(comp, s)
    comp.addSubcomponent(vevent)
  })
  return comp.toString()
}
