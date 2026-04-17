import { performance } from 'node:perf_hooks'
import { randomBytes } from 'node:crypto'
import {
  concat,
  equals,
  fromBase58BtcString,
  fromBase58String,
  fromBase64String,
  fromBase64UrlString,
  fromBigInt,
  fromCompressed,
  fromHex,
  fromJSON,
  fromString,
  fromZ85String,
  toArrayBuffer,
  toBase58BtcString,
  toBase58String,
  toBase64String,
  toBase64UrlString,
  toBigInt,
  toBufferSource,
  toCompressed,
  toHex,
  toJSON,
  toString,
  toUint8Array,
  toZ85String,
} from '../dist/index.js'

const OPERATIONS = 5_000
const NAME_HEADER = 'benchmark'
const COLUMN_SEPARATOR = ' | '

function measure(iterations, fn) {
  const start = performance.now()
  for (let i = 0; i < iterations; i++) fn()
  const durationMs = performance.now() - start
  return toStats(iterations, durationMs)
}

async function measureAsync(iterations, fn) {
  const start = performance.now()
  for (let i = 0; i < iterations; i++) await fn()
  const durationMs = performance.now() - start
  return toStats(iterations, durationMs)
}

function toStats(iterations, durationMs) {
  return {
    ops: iterations,
    ms: durationMs,
    msPerOp: durationMs / iterations,
    opsPerSec: (iterations / durationMs) * 1000,
  }
}

function formatInt(value) {
  return Math.round(value).toLocaleString('en-US')
}

function formatMs(value) {
  return value.toFixed(3)
}

function formatMsPerOp(value) {
  return value.toFixed(6)
}

function formatResults(results) {
  const nameWidth = Math.max(
    NAME_HEADER.length,
    ...results.map((result) => result.name.length)
  )
  const opsWidth = Math.max(
    'ops'.length,
    ...results.map((result) => formatInt(result.ops).length)
  )
  const msWidth = Math.max(
    'ms'.length,
    ...results.map((result) => formatMs(result.ms).length)
  )
  const msPerOpWidth = Math.max(
    'ms/op'.length,
    ...results.map((result) => formatMsPerOp(result.msPerOp).length)
  )
  const opsPerSecWidth = Math.max(
    'ops/sec'.length,
    ...results.map((result) => formatInt(result.opsPerSec).length)
  )

  const header = [
    NAME_HEADER.padEnd(nameWidth),
    'ops'.padStart(opsWidth),
    'ms'.padStart(msWidth),
    'ms/op'.padStart(msPerOpWidth),
    'ops/sec'.padStart(opsPerSecWidth),
  ].join(COLUMN_SEPARATOR)

  const divider = [
    '-'.repeat(nameWidth),
    '-'.repeat(opsWidth),
    '-'.repeat(msWidth),
    '-'.repeat(msPerOpWidth),
    '-'.repeat(opsPerSecWidth),
  ].join(COLUMN_SEPARATOR)

  const rows = results.map((result) =>
    [
      result.name.padEnd(nameWidth),
      formatInt(result.ops).padStart(opsWidth),
      formatMs(result.ms).padStart(msWidth),
      formatMsPerOp(result.msPerOp).padStart(msPerOpWidth),
      formatInt(result.opsPerSec).padStart(opsPerSecWidth),
    ].join(COLUMN_SEPARATOR)
  )

  return [header, divider, ...rows].join('\n')
}

console.log('Benchmarking @sovereignbase/bytecodec...')
console.log(`Operations per benchmark: ${formatInt(OPERATIONS)}`)

const sampleBytes = randomBytes(64)
const sampleBytesDiff = Uint8Array.from(sampleBytes, (value, idx) =>
  idx === sampleBytes.length - 1 ? value ^ 1 : value
)
const sampleView = new DataView(sampleBytes.buffer, 0, sampleBytes.byteLength)
const sampleText = 'caffeinated rockets at dawn'
const sampleTextBytes = fromString(sampleText)
const sampleBigInt = 0x1234567890abcdef1234567890abcdefn
const sampleBigIntBytes = fromBigInt(sampleBigInt)
const sampleJson = { ok: true, count: 42, note: '@sovereignbase/bytecodec' }
const sampleJsonBytes = fromJSON(sampleJson)
const base58 = toBase58String(sampleBytes)
const base58Btc = toBase58BtcString(sampleBytes)
const base64 = toBase64String(sampleBytes)
const base64Url = toBase64UrlString(sampleBytes)
const hex = toHex(sampleBytes)
const z85 = toZ85String(sampleBytes)
const compressed = await toCompressed(sampleBytes)
const results = []

results.push({
  name: 'base58 encode',
  ...measure(OPERATIONS, () => toBase58String(sampleBytes)),
})
results.push({
  name: 'base58 decode',
  ...measure(OPERATIONS, () => fromBase58String(base58)),
})
results.push({
  name: 'base58btc encode',
  ...measure(OPERATIONS, () => toBase58BtcString(sampleBytes)),
})
results.push({
  name: 'base58btc decode',
  ...measure(OPERATIONS, () => fromBase58BtcString(base58Btc)),
})
results.push({
  name: 'base64 encode',
  ...measure(OPERATIONS, () => toBase64String(sampleBytes)),
})
results.push({
  name: 'base64 decode',
  ...measure(OPERATIONS, () => fromBase64String(base64)),
})
results.push({
  name: 'base64url encode',
  ...measure(OPERATIONS, () => toBase64UrlString(sampleBytes)),
})
results.push({
  name: 'base64url decode',
  ...measure(OPERATIONS, () => fromBase64UrlString(base64Url)),
})
results.push({
  name: 'hex encode',
  ...measure(OPERATIONS, () => toHex(sampleBytes)),
})
results.push({
  name: 'hex decode',
  ...measure(OPERATIONS, () => fromHex(hex)),
})
results.push({
  name: 'z85 encode',
  ...measure(OPERATIONS, () => toZ85String(sampleBytes)),
})
results.push({
  name: 'z85 decode',
  ...measure(OPERATIONS, () => fromZ85String(z85)),
})
results.push({
  name: 'utf8 encode',
  ...measure(OPERATIONS, () => fromString(sampleText)),
})
results.push({
  name: 'utf8 decode',
  ...measure(OPERATIONS, () => toString(sampleTextBytes)),
})
results.push({
  name: 'bigint encode',
  ...measure(OPERATIONS, () => fromBigInt(sampleBigInt)),
})
results.push({
  name: 'bigint decode',
  ...measure(OPERATIONS, () => toBigInt(sampleBigIntBytes)),
})
results.push({
  name: 'json encode',
  ...measure(OPERATIONS, () => fromJSON(sampleJson)),
})
results.push({
  name: 'json decode',
  ...measure(OPERATIONS, () => toJSON(sampleJsonBytes)),
})
results.push({
  name: 'concat 3 buffers',
  ...measure(OPERATIONS, () => concat([sampleBytes, sampleBytes, sampleBytes])),
})
results.push({
  name: 'toUint8Array',
  ...measure(OPERATIONS, () => toUint8Array(sampleView)),
})
results.push({
  name: 'toArrayBuffer',
  ...measure(OPERATIONS, () => toArrayBuffer(sampleView)),
})
results.push({
  name: 'toBufferSource',
  ...measure(OPERATIONS, () => toBufferSource(sampleView)),
})
results.push({
  name: 'equals same',
  ...measure(OPERATIONS, () => equals(sampleBytes, sampleBytes)),
})
results.push({
  name: 'equals diff',
  ...measure(OPERATIONS, () => equals(sampleBytes, sampleBytesDiff)),
})
results.push({
  name: 'gzip compress',
  ...(await measureAsync(OPERATIONS, async () => {
    await toCompressed(sampleBytes)
  })),
})
results.push({
  name: 'gzip decompress',
  ...(await measureAsync(OPERATIONS, async () => {
    await fromCompressed(compressed)
  })),
})

console.log(formatResults(results))

console.log('Benchmark complete.')
