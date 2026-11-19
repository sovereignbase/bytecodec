import { describe, expect, it } from 'vitest'
import {
  bytesFromBase45String,
  bytesToBase45String,
} from '../../src/base45/index.js'

describe('Base45 codec', () => {
  it.each([
    ['AB', 'BB8'],
    ['ABC', 'BB8M1'],
    ['Hello!!', '%69 VD92EX0'],
    ['base-45', 'UJCLQE7W581'],
  ])('round-trips the RFC 9285 vector %s', (text, encoded) => {
    const bytes = new TextEncoder().encode(text)

    expect(bytesToBase45String(bytes)).toBe(encoded)
    expect(bytesFromBase45String(encoded)).toEqual(bytes)
  })

  it('supports empty and generic byte sources', () => {
    expect(bytesToBase45String([])).toBe('')
    expect(bytesFromBase45String('')).toEqual(new Uint8Array())
    expect(bytesToBase45String([1, 2, 3])).toBe('X5030')
    expect(bytesFromBase45String('FGW')).toEqual(new Uint8Array([0xff, 0xff]))
  })

  it('rejects malformed input with stable codes', () => {
    const cases: Array<[unknown, string]> = [
      [123, 'BASE45_INPUT_EXPECTED'],
      ['A', 'BASE45_INVALID_LENGTH'],
      ['bb8', 'BASE45_INVALID_CHARACTER'],
      ['åB8', 'BASE45_INVALID_CHARACTER'],
      ['::', 'BASE45_INVALID_CHUNK'],
      [':::', 'BASE45_INVALID_CHUNK'],
    ]

    for (const [value, code] of cases) {
      expect(() => bytesFromBase45String(value as string)).toThrowError(
        expect.objectContaining({ code, name: 'BytecodecError' })
      )
    }
  })
})
