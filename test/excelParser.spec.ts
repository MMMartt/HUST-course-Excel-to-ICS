import { expect } from 'chai'
import { parseWeekStr } from '../src/excelParser'

describe('excel parser should work', () => {
  describe('parseWeekStr()', () => {
    it('should parse "1 - 1233, 34 周"', () => {
      expect(parseWeekStr('1 - 1233, 34 周')).to.deep.eq([
        [1, 1233],
        [34, 34],
      ])
    })

    it('should parse "1 - 3, 5 周"', () => {
      expect(parseWeekStr('1 - 3, 5 周')).to.deep.eq([
        [1, 3],
        [5, 5],
      ])
    })

    it('should parse "1 - 3, 4, 5-3 周"', () => {
      expect(parseWeekStr('1 - 3, 4, 5 周')).to.deep.eq([
        [1, 3],
        [4, 4],
        [5, 5],
      ])
    })

    it('should parse "3, 4, 5周"', () => {
      expect(parseWeekStr('3, 4, 5周')).to.deep.eq([
        [3, 3],
        [4, 4],
        [5, 5],
      ])
    })

    it('should parse "3周 , 4-5周, 8周"', () => {
      expect(parseWeekStr('3, 4, 5周')).to.deep.eq([
        [3, 3],
        [4, 4],
        [5, 5],
      ])
    })
  })
})
