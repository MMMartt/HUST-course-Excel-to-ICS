import { expect } from 'chai'
import parseDate from '../src/utils/parseDate'

describe('Date parser should work', () => {
  it('should parse YYYY-MM-DD', () => {
    expect(parseDate('2011-03-02')).to.eq(1299024000000)
  })
  it('should recognize invalid date', () => {
    expect(parseDate('2011-03-51')).to.be.NaN
  })
})
