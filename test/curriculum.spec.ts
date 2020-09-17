import { expect } from 'chai'
import {
  genCourseCurriculumUnit,
  isCourseOf,
  querySchedule,
  SheetCurriculum,
} from '../src/curriculum'
import { curriculumGenerator } from './curriculumExample'

describe('curriculum module', () => {
  const raw: SheetCurriculum[] = []
  before(() => {
    raw.push(curriculumGenerator())
  })

  describe('isCourseOf()', () => {
    it('should check single string equivalence', () => {
      expect(
        isCourseOf(
          raw[0].gradeCurriculums[0].classCurriculums[0].curriculums[0],
          raw[0].gradeCurriculums[0].courseInfo[0]
        )
      ).to.be.true
    })
  })

  describe('querySchedule()', () => {
    it('should be able to query expected course schedule', () => {
      expect(
        querySchedule(
          raw[0].gradeCurriculums[0].classCurriculums[0].curriculums,
          raw[0].gradeCurriculums[0].courseInfo[0]
        )
      )
    })
    it('should have result of [] while nothing exist', () => {
      expect(
        querySchedule([], {
          classHour: '12',
          credit: 12,
          name: '123',
          teacher: 'll',
        })
      ).to.be.empty
    })
  })

  describe('genCourseCurriculumUnit()', () => {
    it('should generate expected result with example data', () => {
      // console.log(JSON.stringify(genCourseCurriculumUnit(raw, [0, 0, 0, 0]), null, 2))
      expect(genCourseCurriculumUnit(raw, [0, 0, 0, 0]))
        .to.have.property('schedules')
        .with.lengthOf(3)
    })
  })
})
