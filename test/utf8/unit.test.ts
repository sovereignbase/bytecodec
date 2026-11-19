import { afterEach, describe, expect, it, vi } from 'vitest'
import { bytesFromUTF8String, bytesToUTF8String } from '../../src/utf8/index.js'

afterEach(() => vi.unstubAllGlobals())

describe('UTF-8 codec', () => {
  it('round-trips Unicode with cached web codecs', () => {
    const text = 'héllo ✓ rocket 🚀'
    const first = bytesFromUTF8String(text)
    const second = bytesFromUTF8String(text)

    expect(bytesToUTF8String(first)).toBe(text)
    expect(bytesToUTF8String(second)).toBe(text)
  })

  it('falls back to Buffer', () => {
    vi.stubGlobal('TextEncoder', undefined)
    vi.stubGlobal('TextDecoder', undefined)

    const bytes = bytesFromUTF8String('buffer ✓')
    expect(bytesToUTF8String(bytes)).toBe('buffer ✓')
  })

  it('validates input and reports unavailable codecs', () => {
    expect(() => bytesFromUTF8String(1 as unknown as string)).toThrowError(
      expect.objectContaining({ code: 'STRING_INPUT_EXPECTED' })
    )

    vi.stubGlobal('TextEncoder', undefined)
    vi.stubGlobal('TextDecoder', undefined)
    vi.stubGlobal('Buffer', undefined)
    expect(() => bytesFromUTF8String('text')).toThrowError(
      expect.objectContaining({ code: 'UTF8_ENCODER_UNAVAILABLE' })
    )
    expect(() => bytesToUTF8String([1])).toThrowError(
      expect.objectContaining({ code: 'UTF8_DECODER_UNAVAILABLE' })
    )
  })
})
