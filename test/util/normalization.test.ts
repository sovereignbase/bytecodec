import { describe, expect, it } from 'vitest'
import {
  concatBytes,
  equalBytes,
  normalizeBytes,
} from '../../src/util/index.js'
import { byteSources, expectedBytes } from '../shared/byte-sources.js'

describe('ArrayBuffer normalization contract', () => {
  it.each(byteSources())('copies the exact bytes of %s', (_name, source) => {
    const normalized = normalizeBytes(source)
    expect(normalized).toEqual(expectedBytes)
    expect(normalized.buffer).toBeInstanceOf(ArrayBuffer)
    expect(Buffer.isBuffer(normalized)).toBe(false)
    expect(normalized.byteOffset).toBe(0)
    expect(normalized.buffer.byteLength).toBe(expectedBytes.length)
    const sourceBuffer = ArrayBuffer.isView(source) ? source.buffer : source
    expect(normalized.buffer).not.toBe(sourceBuffer)
    normalized.fill(0)
    expect(normalizeBytes(source)).toEqual(expectedBytes)
    expect(concatBytes([[], source, []])).toEqual(expectedBytes)
    expect(equalBytes(source, expectedBytes)).toBe(true)
  })

  it('copies empty offset views and shared buffers into ordinary buffers', () => {
    for (const buffer of [new ArrayBuffer(8), new SharedArrayBuffer(8)]) {
      const output = normalizeBytes(new DataView(buffer, 8, 0))
      expect(output).toHaveLength(0)
      expect(output.buffer).toBeInstanceOf(ArrayBuffer)
      expect(output.buffer).not.toBe(buffer)
    }
  })

  it('does not retain either input when concatenating', () => {
    const a = new Uint8Array([1, 2])
    const b = new Uint8Array(new SharedArrayBuffer(2))
    b.set([3, 4])
    const output = concatBytes([a, b])
    a.fill(0)
    b.fill(0)
    expect(output).toEqual(new Uint8Array([1, 2, 3, 4]))
    expect(output.buffer).toBeInstanceOf(ArrayBuffer)
  })
})
