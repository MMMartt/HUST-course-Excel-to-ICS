import { expect } from 'chai'
import { SheetCurriculum } from '../src/curriculum'
import { applyAction, initCurrentStatus, Status } from '../src/sheetSelector'
import { curriculumGenerator } from './curriculumExample'

describe('sheet selector', () => {
  let raw: SheetCurriculum[] = []

  describe('initCurrentStatus()', () => {
    before(() => {
      raw = [curriculumGenerator()]
    })

    it('should be able to init', () => {
      expect(initCurrentStatus(raw).result.type).to.eq('success')
    })

    it('init current location should be empty', () => {
      expect(initCurrentStatus(raw).current).to.deep.eq([-1, -1, -1, -1])
    })

    it('init selection should be empty', () => {
      expect(initCurrentStatus(raw).selected).to.be.empty
    })
  })

  describe('applyAction()', () => {
    let currentStatus: Status
    before(() => {
      const raw = [curriculumGenerator()]
      currentStatus = initCurrentStatus(raw)
    })

    it('should handle unexpected action', () => {
      expect(
        applyAction(currentStatus, {
          type: 'up',
        }).result.type
      ).to.eq('fail')

      expect(
        applyAction(currentStatus, {
          type: 'down',
          index: 1,
        }).result.type
      ).to.eq('fail')
    })

    it('should go down correctly', () => {
      let status = applyAction(currentStatus, {
        type: 'down',
        index: 0,
      })
      expect(status.result.type).to.eq('success')
      expect(status.current).to.deep.eq([0, -1, -1, -1])
      status = applyAction(status, {
        type: 'down',
        index: 0,
      })
      expect(status.result.type).to.eq('success')
      expect(status.current).to.deep.eq([0, 0, -1, -1])
      status = applyAction(status, {
        type: 'down',
        index: 1,
      })
      expect(status.result.type).to.eq('success')
      expect(status.current).to.deep.eq([0, 0, 1, -1])
    })
  })
})
