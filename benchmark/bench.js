import { performance } from 'node:perf_hooks'
import { randomBytes } from 'node:crypto'
import {
  concat,
  equals,
  fromBase64String,
  fromBase64UrlString,
  fromCompressed,
  fromJSON,
  fromString,
  toArrayBuffer,
  toBase64String,
  toBase64UrlString,
  toBufferSource,
  toCompressed,
  toJSON,
  toString,
  toUint8Array,
} from '../dist/index.js'

function formatOps(iterations, durationMs) {
  const opsPerSec = Math.round((iterations / durationMs) * 1000)
  const ms = durationMs.toFixed(1)
  return `${opsPerSec.toLocaleString()} ops/s (${ms} ms)`
}

function bench(name, iterations, fn) {
  const start = performance.now()
  for (let i = 0; i < iterations; i++) fn()
  const duration = performance.now() - start
  console.log(`${name.padEnd(18)} ${formatOps(iterations, duration)}`)
}

async function benchAsync(name, iterations, fn) {
  const start = performance.now()
  for (let i = 0; i < iterations; i++) await fn()
  const duration = performance.now() - start
  console.log(`${name.padEnd(18)} ${formatOps(iterations, duration)}`)
}

console.log('Benchmarking @sovereignbase/bytecodec...')

const sampleBytes = randomBytes(64)
const sampleBytesDiff = Uint8Array.from(sampleBytes, (value, idx) =>
  idx === sampleBytes.length - 1 ? value ^ 1 : value
)
const sampleView = new DataView(sampleBytes.buffer, 0, sampleBytes.byteLength)
const sampleText = 'caffeinated rockets at dawn'
const sampleTextBytes = fromString(sampleText)
const sampleJson = { ok: true, count: 42, note: '@sovereignbase/bytecodec' }
const sampleJsonBytes = fromJSON(sampleJson)
const base64 = toBase64String(sampleBytes)
const base64Url = toBase64UrlString(sampleBytes)
const compressed = await toCompressed(sampleBytes)

bench('base64 encode', 50000, () => toBase64String(sampleBytes))
bench('base64 decode', 50000, () => fromBase64String(base64))
bench('base64url encode', 50000, () => toBase64UrlString(sampleBytes))
bench('base64url decode', 50000, () => fromBase64UrlString(base64Url))
bench('utf8 encode', 50000, () => fromString(sampleText))
bench('utf8 decode', 50000, () => toString(sampleTextBytes))
bench('json encode', 20000, () => fromJSON(sampleJson))
bench('json decode', 20000, () => toJSON(sampleJsonBytes))
bench('concat 3 buffers', 50000, () =>
  concat([sampleBytes, sampleBytes, sampleBytes])
)
bench('toUint8Array', 200000, () => toUint8Array(sampleView))
bench('toArrayBuffer', 200000, () => toArrayBuffer(sampleView))
bench('toBufferSource', 200000, () => toBufferSource(sampleView))
bench('equals same', 200000, () => equals(sampleBytes, sampleBytes))
bench('equals diff', 200000, () => equals(sampleBytes, sampleBytesDiff))

await benchAsync('gzip compress', 400, async () => {
  await toCompressed(sampleBytes)
})
await benchAsync('gzip decompress', 400, async () => {
  await fromCompressed(compressed)
})

console.log('Benchmark complete.')
