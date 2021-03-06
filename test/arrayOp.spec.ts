import { expect } from 'chai'
import { mapCurrent } from '../src/sheetSelector'
import {
  isSameSimpleArray,
  mapConcat,
  replaceFirst,
  replaceLast,
} from '../src/utils/arrayOp'

describe('arrayOP.ts', () => {
  describe('replaceFirst()', () => {
    it('should not be able to replace empty list', () => {
      expect(replaceFirst([] as string[], a => a === '1', '123')).to.be.empty
    })

    it('should replace first element', () => {
      expect(replaceFirst([1, 2, 3, 4], a => a === 3, 12)).to.deep.eq([
        1,
        2,
        12,
        4,
      ])
    })

    it('should only replace first element', () => {
      expect(replaceFirst([1, 2, 3, 3, 5], a => a === 3, 12)).to.deep.eq([
        1,
        2,
        12,
        3,
        5,
      ])
    })

    it('should replace nothing if pred can not meet', () => {
      expect(replaceFirst([1, 2, 3, 3, 5], a => a === 23, 12)).to.deep.eq([
        1,
        2,
        3,
        3,
        5,
      ])
    })
  })

  describe('replaceLast()', () => {
    it('should be able to replace last', () => {
      expect(replaceLast([1, 2, 3, 3, 5], a => a === 3, 12)).to.deep.eq([
        1,
        2,
        3,
        12,
        5,
      ])
    })
  })

  describe('isSameSimpleArray()', () => {
    it('should be able to find out if two is the same', () => {
      expect(isSameSimpleArray([1, 2, 3], [1, 2, 3])).to.be.true
    })

    it('should be able to find out if two is not the same', () => {
      expect(isSameSimpleArray([0, 0, 0, 0], [0, 0, 0, 1])).to.be.false
    })
  })

  describe('mapConcat()', () => {
    it('map concat empty to nothing', () => {
      expect(mapConcat([1, 2], [])).to.be.empty
    })

    it('map concat test', () => {
      expect(
        mapConcat([1, 2, 3] as Array<number | string>, ['a', 'b'])
      ).to.deep.eq([
        [1, 2, 3, 'a'],
        [1, 2, 3, 'b'],
      ])
    })
  })

  describe('mapCurrent()', () => {
    it('should work', () => {
      expect(mapCurrent([1, 2, 3, [1, 2]])).to.deep.eq([
        [1, 2, 3, 1],
        [1, 2, 3, 2],
      ])
    })
  })
})
