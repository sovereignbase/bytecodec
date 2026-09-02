import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  bytesFromBase64String,
  bytesFromBase64UrlString,
  bytesToBase64String,
  bytesToBase64UrlString,
} from '../../src/base64/index.js'

afterEach(() => vi.unstubAllGlobals())

describe('Base64 codecs', () => {
  it('round-trips base64 and unpadded base64url through Buffer', () => {
    const bytes = new Uint8Array([104, 101, 108, 108, 111])

    expect(bytesToBase64String(bytes)).toBe('aGVsbG8=')
    expect(bytesFromBase64String('aGVsbG8=')).toEqual(bytes)
    expect(bytesToBase64UrlString(bytes)).toBe('aGVsbG8')
    expect(bytesFromBase64UrlString('aGVsbG8')).toEqual(bytes)
    expect(bytesFromBase64UrlString('YWJj')).toEqual(
      new Uint8Array([97, 98, 99])
    )
  })

  it('uses web base64 functions without Buffer, including chunked input', () => {
    vi.stubGlobal('Buffer', undefined)
    const bytes = new Uint8Array(0x8001).fill(97)
    const encoded = bytesToBase64String(bytes)

    expect(bytesFromBase64String(encoded)).toEqual(bytes)
    expect(bytesFromBase64UrlString('YQ')).toEqual(new Uint8Array([97]))
    expect(bytesFromBase64UrlString('YWI')).toEqual(new Uint8Array([97, 98]))
  })

  it('reports unavailable web fallbacks and invalid base64url length', () => {
    vi.stubGlobal('Buffer', undefined)
    vi.stubGlobal('btoa', undefined)
    expect(() => bytesToBase64String([1])).toThrowError(
      expect.objectContaining({ code: 'BASE64_ENCODER_UNAVAILABLE' })
    )

    vi.stubGlobal('atob', undefined)
    expect(() => bytesFromBase64String('AQ==')).toThrowError(
      expect.objectContaining({ code: 'BASE64_DECODER_UNAVAILABLE' })
    )
    expect(() => bytesFromBase64UrlString('a')).toThrowError(
      expect.objectContaining({ code: 'BASE64URL_INVALID_LENGTH' })
    )
  })
})
