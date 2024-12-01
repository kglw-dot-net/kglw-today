import {describe, expect, it} from 'vitest'
import {match} from './date'

describe('params matcher: date', () => {
  it('is a function', () => {
    expect(typeof match).toBe('function')
  })

  describe('with a `month-day` string', () => {
    it('returns true', () => {
      expect(match('jul-16')).toBe(true)
      expect(match('abc-12')).toBe(true) // we aren't fully validating in the matcher...
    })
  })

  describe('with an incorrect-looking string', () => {
    it('returns false', () => {
      expect(match('foobar')).toBe(false)
      expect(match('foo-bar')).toBe(false)
      expect(match('foo-123')).toBe(false)
      expect(match('a-0')).toBe(false)
    })
  })

  describe('with a non-string', () => {
    it('returns false', () => {
      expect(match({})).toBe(false)
    })
  })
})
