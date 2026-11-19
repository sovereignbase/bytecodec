import type { ByteSource } from '../../src/index.js'

export const expectedBytes = new Uint8Array([65, 66, 67, 68, 69, 70, 71, 72])

/** Guard bytes on both sides expose accidental whole-buffer reads. */
export function byteSources(): Array<[string, ByteSource]> {
  const sources: Array<[string, ByteSource]> = [
    ['number[]', [...expectedBytes]],
    ['ArrayBuffer', expectedBytes.slice().buffer],
    ['Uint8Array', expectedBytes.slice()],
    ['Buffer slice', Buffer.from([255, ...expectedBytes, 255]).subarray(1, 9)],
  ]
  for (const shared of [false, true]) {
    const buffer = shared ? new SharedArrayBuffer(24) : new ArrayBuffer(24)
    new Uint8Array(buffer).fill(255)
    new Uint8Array(buffer, 8, 8).set(expectedBytes)
    const prefix = shared ? 'shared ' : ''
    sources.push(
      [prefix + 'DataView', new DataView(buffer, 8, 8)],
      [prefix + 'Uint8Array slice', new Uint8Array(buffer, 8, 8)],
      [prefix + 'Int8Array', new Int8Array(buffer, 8, 8)],
      [prefix + 'Uint8ClampedArray', new Uint8ClampedArray(buffer, 8, 8)],
      [prefix + 'Int16Array', new Int16Array(buffer, 8, 4)],
      [prefix + 'Uint16Array', new Uint16Array(buffer, 8, 4)],
      [prefix + 'Int32Array', new Int32Array(buffer, 8, 2)],
      [prefix + 'Uint32Array', new Uint32Array(buffer, 8, 2)],
      [prefix + 'Float32Array', new Float32Array(buffer, 8, 2)],
      [prefix + 'Float64Array', new Float64Array(buffer, 8, 1)],
      [prefix + 'BigInt64Array', new BigInt64Array(buffer, 8, 1)],
      [prefix + 'BigUint64Array', new BigUint64Array(buffer, 8, 1)]
    )
  }
  const shared = new SharedArrayBuffer(8)
  new Uint8Array(shared).set(expectedBytes)
  sources.push(['SharedArrayBuffer', shared])
  return sources
}
