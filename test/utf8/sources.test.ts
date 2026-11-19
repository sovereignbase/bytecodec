import { expect, it } from 'vitest'
import { bytesToUTF8String, bytesFromUTF8String } from '../../src/utf8/index.js'
import { byteSources, expectedBytes } from '../shared/byte-sources.js'

it.each(byteSources())(
  'uses only the exact byte range of %s',
  (_name, source) => {
    const encoded = bytesToUTF8String(source)
    expect(encoded).toBe(bytesToUTF8String(expectedBytes))
    const decoded = bytesFromUTF8String(encoded)
    expect(decoded).toEqual(expectedBytes)
    expect(decoded.buffer).toBeInstanceOf(ArrayBuffer)
    expect(Buffer.isBuffer(decoded)).toBe(false)
  }
)
