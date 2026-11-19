import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { bytesFromGzipBytes, bytesToGzipBytes } from '../../src/gzip/index.js'
import { byteSources, expectedBytes } from '../shared/byte-sources.js'

const runtime = vi.hoisted(() => ({ isNode: true }))

vi.mock('../../src/.helpers/index.js', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../src/.helpers/index.js')>()),
  isNodeRuntime: () => runtime.isNode,
}))

beforeEach(() => {
  runtime.isNode = true
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function emulateWebRuntime(): void {
  runtime.isNode = false
}

describe('gzip codec', () => {
  it.each([true, false])(
    'preserves exact source ranges with Node backend = %s',
    async (isNode) => {
      runtime.isNode = isNode
      for (const [_name, source] of byteSources()) {
        const compressed = await bytesToGzipBytes(source)
        expect(compressed.buffer).toBeInstanceOf(ArrayBuffer)
        expect(Buffer.isBuffer(compressed)).toBe(false)
        const padded = new SharedArrayBuffer(compressed.length + 8)
        new Uint8Array(padded, 4, compressed.length).set(compressed)
        const restored = await bytesFromGzipBytes(
          new DataView(padded, 4, compressed.length)
        )
        expect(restored).toEqual(expectedBytes)
        expect(restored.buffer).toBeInstanceOf(ArrayBuffer)
      }
    }
  )
  it('round-trips bytes through Node built-ins', async () => {
    const bytes = new TextEncoder().encode('compress with node')
    const compressed = await bytesToGzipBytes(bytes)

    expect(compressed.length).toBeGreaterThan(0)
    await expect(bytesFromGzipBytes(compressed)).resolves.toEqual(bytes)
  })

  it('round-trips bytes through web compression streams', async () => {
    emulateWebRuntime()
    const bytes = new TextEncoder().encode('compress with streams')
    const compressed = await bytesToGzipBytes(bytes)

    await expect(bytesFromGzipBytes(compressed)).resolves.toEqual(bytes)
  })

  it('reports unavailable web compression APIs', async () => {
    emulateWebRuntime()
    vi.stubGlobal('CompressionStream', undefined)
    await expect(bytesToGzipBytes([1, 2, 3])).rejects.toMatchObject({
      code: 'GZIP_COMPRESSION_UNAVAILABLE',
    })

    vi.stubGlobal('DecompressionStream', undefined)
    await expect(bytesFromGzipBytes([1, 2, 3])).rejects.toMatchObject({
      code: 'GZIP_DECOMPRESSION_UNAVAILABLE',
    })
  })
})
