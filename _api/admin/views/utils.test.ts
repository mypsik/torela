import {d, e, today} from './utils'

it('today', () => {
  expect(today()).toMatch(/^20\d\d-\d\d-\d\d$/)
})

it('formats date', () => {
  expect(d(new Date('2019-10-21'))).toBe('2019-10-21')
  expect(d('2019-10-21T10:25')).toBe('2019-10-21')
  expect(d(123)).toBe('1970-01-01')
})

it('escapes html', () => {
  expect(e(undefined)).toBe('')
  expect(e('<a>')).toBe('&lt;a>')
  expect(e('\'hello"')).toBe('&apos;hello&quot;')
})
