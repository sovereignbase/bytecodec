import { hkdfSync } from 'node:crypto'
import { expect, it } from 'vitest'
import { deriveBytes, generateBytes } from '../../src/util/index.js'
import { byteSources, expectedBytes } from '../shared/byte-sources.js'

it.each(byteSources())(
  'derives from the exact range of %s',
  async (_name, source) => {
    const expected = new Uint8Array(
      hkdfSync(
        'sha256',
        new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
        expectedBytes,
        expectedBytes,
        32
      )
    )
    const output = await deriveBytes(source, source, 32)
    expect(output).toEqual(expected)
    expect(output.buffer).toBeInstanceOf(ArrayBuffer)
  }
)

it('returns ordinary buffers for random output and respects the Web Crypto quota', () => {
  for (const size of [0, 32, 65536]) {
    const output = generateBytes(size)
    expect(output).toHaveLength(size)
    expect(output.buffer).toBeInstanceOf(ArrayBuffer)
  }
  expect(() => generateBytes(65537)).toThrowError(
    expect.objectContaining({ code: 'UNKNOWN_ERROR' })
  )
})
