import { expect } from 'chai'
import { _MOCHA_TEST_EXPORTS_ } from '../src/icalWriter'

const genWeekListFromWeekPairs = _MOCHA_TEST_EXPORTS_.genWeekListFromWeekPairs

describe('icalWriter.ts', () => {
  describe('genWeekListFromWeekPairs()', () => {
    it('should work for [[0, 0]]', () => {
      expect(genWeekListFromWeekPairs([[0, 0]])).to.deep.eq([-1])
    })

    it('should work for [[1, 3], [5, 5]]', () => {
      expect(
        genWeekListFromWeekPairs([
          [1, 3],
          [5, 5],
        ])
      ).to.deep.eq([0, 1, 2, 4])
    })

    it('should work for [[1, 3], [5, 8], [10, 10]]', () => {
      expect(
        genWeekListFromWeekPairs([
          [1, 3],
          [5, 8],
          [10, 10],
        ])
      ).to.deep.eq([0, 1, 2, 4, 5, 6, 7, 9])
    })
  })
})
