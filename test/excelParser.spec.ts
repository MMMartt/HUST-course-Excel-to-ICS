import { expect } from 'chai'
import { _MOCHA_TEST_EXPORTS_ } from '../src/excelParser'

const parseWeekStr = _MOCHA_TEST_EXPORTS_.parseWeekStr
const parseSingleScheduleStr = _MOCHA_TEST_EXPORTS_.parseSingleScheduleStr

describe('excel parser should work', () => {
  describe('parseWeekStr()', () => {
    it('should throw error with illegal str feed', () => {
      const fn = () => parseWeekStr('asdf, asdf,1212asd')
      expect(fn).to.throw(Error, /unexpected token/)
    })

    it('should parse 12-13,15', () => {
      expect(parseWeekStr('12-13,15')).to.deep.eq([
        [12, 13],
        [15, 15],
      ])
    })

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
      expect(parseWeekStr('1 - 3, 4, 5-3 周')).to.deep.eq([
        [1, 3],
        [4, 4],
        [5, 3],
      ])
    })

    it('should parse "3, 4, 5周"', () => {
      expect(parseWeekStr('3, 4, 5周')).to.deep.eq([
        [3, 3],
        [4, 4],
        [5, 5],
      ])
    })

    it('should parse "3, 4 - 7, 9周"', () => {
      expect(parseWeekStr('3, 4 - 7周, 9周')).to.deep.eq([
        [3, 3],
        [4, 7],
        [9, 9],
      ])
    })
  })

  describe('parseSingleScheduleStr()', () => {
    it('should leave result untouched while feed with empty str', () => {
      expect(parseSingleScheduleStr(1, '')).to.deep.eq([1, [], [1, 2]])
    })

    it('should change day with day feed', () => {
      expect(parseSingleScheduleStr(1, '星期三')).to.deep.eq([3, [], [1, 2]])
    })

    it('should parse single schedule with right day of the week', () => {
      const result = parseSingleScheduleStr(
        3,
        '微机原理与接口技术  3-11周    东十二楼207'
      )
      expect(result[0]).to.eq(3)
      expect(result[1]).to.have.lengthOf(1)
      expect(result[1][0].day).to.eq(3)
      expect(result[1][0].weeks).to.deep.eq([[3, 11]])
    })

    it('should parse multiline schedule with right day of the week', () => {
      const result = parseSingleScheduleStr(
        3,
        '微机原理与接口技术  3-11周    东十二楼207\n课程上机：编译技术课程设计 12-13,15   A123 B12  软件学院五楼机房'
      )
      expect(result[0]).to.eq(3)
      expect(result[1]).to.have.lengthOf(2)
      expect(result[1][0].day).to.eq(3)
      expect(result[1][0].timeArrange).to.deep.eq({ start: 1, end: 2 })
      expect(result[1][1].day).to.eq(3)
      expect(result[1][1].info).to.eq('A123-B12')
      expect(result[1][1].location).to.eq('软件学院五楼机房')
      expect(result[1][0].weeks).to.deep.eq([[3, 11]])
      expect(result[1][1].weeks).to.deep.eq([
        [12, 13],
        [15, 15],
      ])
    })

    it('should parse weird course schedule', () => {
      const str =
        '形势与政策 10-12周 \n软件1801班与财政1801、会计1801-02、法学1801-03班合上 东九楼C201\n软件1802-1803班 与软件1804-1806班合上 东九楼C102'
      const result = parseSingleScheduleStr(3, str)
      expect(result[0]).to.eq(3)
      expect(result[1]).to.have.lengthOf(1)
      expect(result[1][0].info).to.have.length.gt(20)
    })
  })
})
