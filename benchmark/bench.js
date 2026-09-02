import { randomBytes } from 'node:crypto'
import { performance } from 'node:perf_hooks'
import {
  bytesFromBase45String,
  bytesToBase45String,
} from '../dist/base45/index.js'
import {
  bytesFromBase64String,
  bytesFromBase64UrlString,
  bytesToBase64String,
  bytesToBase64UrlString,
} from '../dist/base64/index.js'
import { bytesFromGzipBytes, bytesToGzipBytes } from '../dist/gzip/index.js'
import { bytesFromUTF8String, bytesToUTF8String } from '../dist/utf8/index.js'
import {
  concatBytes,
  deriveBytes,
  equalBytes,
  generateBytes,
  normalizeBytes,
} from '../dist/util/index.js'

const OPERATIONS = 5_000
const COLUMN_SEPARATOR = ' | '

function measure(iterations, callback) {
  const start = performance.now()
  for (let index = 0; index < iterations; index++) callback()
  return toStats(iterations, performance.now() - start)
}

async function measureAsync(iterations, callback) {
  const start = performance.now()
  for (let index = 0; index < iterations; index++) await callback()
  return toStats(iterations, performance.now() - start)
}

function toStats(iterations, milliseconds) {
  return {
    ops: iterations,
    ms: milliseconds,
    msPerOp: milliseconds / iterations,
    opsPerSec: (iterations / milliseconds) * 1_000,
  }
}

const formatInteger = (value) => Math.round(value).toLocaleString('en-US')
const formatMilliseconds = (value) => value.toFixed(3)
const formatMillisecondsPerOperation = (value) => value.toFixed(6)

function formatResults(results) {
  const columns = [
    ['benchmark', (result) => result.name],
    ['ops', (result) => formatInteger(result.ops)],
    ['ms', (result) => formatMilliseconds(result.ms)],
    ['ms/op', (result) => formatMillisecondsPerOperation(result.msPerOp)],
    ['ops/sec', (result) => formatInteger(result.opsPerSec)],
  ]
  const widths = columns.map(([heading, format]) =>
    Math.max(heading.length, ...results.map((result) => format(result).length))
  )
  const row = (values) =>
    values
      .map((value, index) =>
        index === 0
          ? value.padEnd(widths[index])
          : value.padStart(widths[index])
      )
      .join(COLUMN_SEPARATOR)

  return [
    row(columns.map(([heading]) => heading)),
    row(widths.map((width) => '-'.repeat(width))),
    ...results.map((result) =>
      row(columns.map(([, format]) => format(result)))
    ),
  ].join('\n')
}

console.log('Benchmarking @sovereignbase/bytecodec...')
console.log(`Operations per benchmark: ${formatInteger(OPERATIONS)}`)

const bytes = randomBytes(64)
const differentBytes = Uint8Array.from(bytes, (value, index) =>
  index === bytes.length - 1 ? value ^ 1 : value
)
const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
const text = 'caffeinated rockets at dawn ✓'
const textBytes = bytesFromUTF8String(text)
const base45 = bytesToBase45String(bytes)
const base64 = bytesToBase64String(bytes)
const base64url = bytesToBase64UrlString(bytes)
const compressed = await bytesToGzipBytes(bytes)
const results = []

for (const [name, callback] of [
  ['base45 encode', () => bytesToBase45String(bytes)],
  ['base45 decode', () => bytesFromBase45String(base45)],
  ['base64 encode', () => bytesToBase64String(bytes)],
  ['base64 decode', () => bytesFromBase64String(base64)],
  ['base64url encode', () => bytesToBase64UrlString(bytes)],
  ['base64url decode', () => bytesFromBase64UrlString(base64url)],
  ['utf8 encode', () => bytesFromUTF8String(text)],
  ['utf8 decode', () => bytesToUTF8String(textBytes)],
  ['normalize', () => normalizeBytes(view)],
  ['concat 3 buffers', () => concatBytes([bytes, bytes, bytes])],
  ['equals same', () => equalBytes(bytes, bytes)],
  ['equals different', () => equalBytes(bytes, differentBytes)],
  ['generate', () => generateBytes(64)],
]) {
  results.push({ name, ...measure(OPERATIONS, callback) })
}

for (const [name, callback] of [
  ['derive HKDF', () => deriveBytes(bytes, textBytes, 32)],
  ['gzip compress', () => bytesToGzipBytes(bytes)],
  ['gzip decompress', () => bytesFromGzipBytes(compressed)],
]) {
  results.push({ name, ...(await measureAsync(OPERATIONS, callback)) })
}

console.log(formatResults(results))
console.log('Benchmark complete.')
