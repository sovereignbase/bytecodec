import { expect, it } from 'vitest'
import {
  bytesToBase64String,
  bytesFromBase64String,
} from '../../src/base64/index.js'
import { byteSources, expectedBytes } from '../shared/byte-sources.js'

it.each(byteSources())(
  'uses only the exact byte range of %s',
  (_name, source) => {
    const encoded = bytesToBase64String(source)
    expect(encoded).toBe(bytesToBase64String(expectedBytes))
    const decoded = bytesFromBase64String(encoded)
    expect(decoded).toEqual(expectedBytes)
    expect(decoded.buffer).toBeInstanceOf(ArrayBuffer)
    expect(Buffer.isBuffer(decoded)).toBe(false)
  }
)
