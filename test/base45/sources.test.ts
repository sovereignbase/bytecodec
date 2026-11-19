import { expect, it } from 'vitest'
import {
  bytesToBase45String,
  bytesFromBase45String,
} from '../../src/base45/index.js'
import { byteSources, expectedBytes } from '../shared/byte-sources.js'

it.each(byteSources())(
  'uses only the exact byte range of %s',
  (_name, source) => {
    const encoded = bytesToBase45String(source)
    expect(encoded).toBe(bytesToBase45String(expectedBytes))
    const decoded = bytesFromBase45String(encoded)
    expect(decoded).toEqual(expectedBytes)
    expect(decoded.buffer).toBeInstanceOf(ArrayBuffer)
    expect(Buffer.isBuffer(decoded)).toBe(false)
  }
)
