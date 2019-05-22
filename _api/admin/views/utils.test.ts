import {e, today} from './utils'

it('today', () => {
  expect(today()).toMatch(/^20\d\d-\d\d-\d\d$/)
})

it('escapes html', () => {
  expect(e('<a>')).toBe('&lt;a>')
  expect(e('\'hello"')).toBe('&apos;hello&quot;')
})
