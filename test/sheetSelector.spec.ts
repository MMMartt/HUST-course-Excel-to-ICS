import { expect } from 'chai'
import { SheetCurriculum } from '../src/curriculum'
import {
  applyAction,
  applyActionList,
  initCurrentStatus,
  OperationTypes,
  Status,
} from '../src/sheetSelector'
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

    it('should be able to go up', () => {
      const status = applyActionList(currentStatus, [
        {
          type: 'down',
          index: 0,
        },
        {
          type: 'down',
          index: 0,
        },
        {
          type: 'up',
        },
      ])
      expect(status.current).to.deep.eq([0, -1, -1, -1])
    })

    it('should be able to select', () => {
      let status = applyActionList(
        currentStatus,
        Array.from(new Array(4)).map(() => ({ type: 'down', index: 0 }))
      )
      status = applyAction(status, { type: 'select' })
      expect(status.result.type).to.equal('success')
      expect(status.current).to.deep.equal([-1, -1, -1, -1])
      expect(status.selected).to.have.lengthOf(1)
    })

    it('should be able to select multi', () => {
      const status = applyActionList(
        currentStatus,
        Array.from(new Array(4))
          .map(() => ({ type: 'down', index: 0 } as OperationTypes))
          .concat({
            type: 'select',
          })
          .concat(
            Array.from(new Array(3)).map(() => ({ type: 'down', index: 0 }))
          )
          .concat({ type: 'down', index: 1 })
          .concat({ type: 'select' })
      )
      expect(status.result.type).to.equal('success')
      expect(status.current).to.deep.equal([-1, -1, -1, -1])
      expect(status.selected).to.have.lengthOf(2)
    })

    it('should not be able to select repeated', () => {
      const status = applyActionList(
        currentStatus,
        Array.from(new Array(4))
          .map(() => ({ type: 'down', index: 0 } as OperationTypes))
          .concat({
            type: 'select',
          })
          .concat(
            Array.from(new Array(4)).map(() => ({ type: 'down', index: 0 }))
          )
          .concat({ type: 'select' })
      )
      expect(status.result.type).to.equal('fail')
      expect(status.current).to.deep.equal([0, 0, 0, 0])
      expect(status.selected).to.have.lengthOf(1)
    })

    it('should be able to remove', () => {
      let status = applyActionList(
        currentStatus,
        Array.from(new Array(4))
          .map(() => ({ type: 'down', index: 0 } as OperationTypes))
          .concat({
            type: 'select',
          })
          .concat(
            Array.from(new Array(3)).map(() => ({ type: 'down', index: 0 }))
          )
          .concat({ type: 'down', index: 1 })
          .concat({ type: 'select' })
      )
      status = applyAction(status, { type: 'remove', index: 0 })
      expect(status.result.type).to.eq('success')
      expect(status.selected).to.deep.equal([[0, 0, 0, 1]])
    })

    it('should not be able to select while not settled', () => {
      const status = applyActionList(
        currentStatus,
        Array.from(new Array(4))
          .map(() => ({ type: 'down', index: 0 } as OperationTypes))
          .concat({
            type: 'select',
          })
          .concat(
            Array.from(new Array(3)).map(() => ({ type: 'down', index: 0 }))
          )
          .concat({ type: 'select' })
      )
      expect(status.result.type).to.eq('fail')
      expect(status.current).to.deep.equal([0, 0, 0, -1])
      expect(status.selected).to.deep.equal([[0, 0, 0, 0]])
    })
  })

  describe('applyActionList()', () => {
    it('should be able to construct multiply actions', () => {
      raw = [curriculumGenerator()]
      let status = initCurrentStatus(raw)
      status = applyActionList(
        status,
        Array.from(new Array(4))
          .map(
            () =>
              ({
                type: 'down',
                index: 0,
              } as OperationTypes)
          )
          .concat([{ type: 'up' }])
      )
      expect(status.result.type).to.equal('success')
      expect(status.current).to.deep.eq([0, 0, 0, -1])
    })
  })
})
