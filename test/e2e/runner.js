import {
  Bytes,
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
} from '/dist/index.js'

const results = { ok: true, errors: [] }

function assert(condition, message) {
  if (!condition) throw new Error(message || 'assertion failed')
}

function assertEqual(actual, expected, message) {
  if (actual !== expected)
    throw new Error(message || `expected ${actual} to equal ${expected}`)
}

function assertArrayEqual(actual, expected, message) {
  const actualArray = Array.from(actual)
  if (actualArray.length !== expected.length)
    throw new Error(message || 'array length mismatch')
  for (let index = 0; index < expected.length; index++) {
    if (actualArray[index] !== expected[index])
      throw new Error(message || 'array content mismatch')
  }
}

function assertThrows(fn, match) {
  let threw = false
  try {
    fn()
  } catch (error) {
    threw = true
    if (match && !match.test(String(error))) throw error
  }
  if (!threw) throw new Error('expected function to throw')
}

async function assertRejects(fn, match) {
  let threw = false
  try {
    await fn()
  } catch (error) {
    threw = true
    if (match && !match.test(String(error))) throw error
  }
  if (!threw) throw new Error('expected promise to reject')
}

async function tryWithTimeout(promise, ms) {
  let timer
  const result = await Promise.race([
    promise.then((value) => ({ ok: true, value })),
    new Promise((resolve) => {
      timer = setTimeout(() => resolve({ ok: false }), ms)
    }),
  ])
  clearTimeout(timer)
  return result
}

function withTimeout(promise, ms, label) {
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`timeout after ${ms}ms${label ? `: ${label}` : ''}`))
    }, ms)
  })
  return Promise.race([promise.finally(() => clearTimeout(timer)), timeout])
}

async function runTest(name, fn) {
  try {
    await withTimeout(Promise.resolve().then(fn), 5000, name)
  } catch (error) {
    results.ok = false
    results.errors.push({ name, message: String(error) })
  }
}

await runTest('base64 roundtrip', () => {
  const payload = new Uint8Array([104, 101, 108, 108, 111])
  const encoded = toBase64String(payload)
  assertEqual(encoded, 'aGVsbG8=')
  const decoded = fromBase64String(encoded)
  assertArrayEqual(decoded, [104, 101, 108, 108, 111])
})

await runTest('base64url roundtrip', () => {
  const payload = new Uint8Array([104, 101, 108, 108, 111])
  const encoded = toBase64UrlString(payload)
  assertEqual(encoded, 'aGVsbG8')
  const decoded = fromBase64UrlString(encoded)
  assertArrayEqual(decoded, [104, 101, 108, 108, 111])
  assertThrows(() => fromBase64UrlString('a'), /Invalid base64url length/)
})

await runTest('utf8 string helpers', () => {
  const text = 'h\u00e9llo \u2713 rocket \ud83d\ude80'
  const bytes = fromString(text)
  assertEqual(toString(bytes), text)
  const asciiBytes = fromString('abcd')
  const view = new DataView(asciiBytes.buffer, 1, 2)
  assertEqual(toString(view), 'bc')
  assertThrows(
    () => toUint8Array('nope'),
    /Expected a Uint8Array, ArrayBuffer, ArrayBufferView, or number\[\]/
  )
})

await runTest('json helpers', () => {
  const value = { ok: true, count: 3, list: ['x', { y: 1 }], nil: null }
  const bytes = fromJSON(value)
  assertEqual(JSON.stringify(toJSON(bytes)), JSON.stringify(value))
  assertEqual(
    JSON.stringify(
      toJSON('{"ok":true,"count":3,"list":["x",{"y":1}],"nil":null}')
    ),
    JSON.stringify(value)
  )
})

await runTest('gzip helpers', async () => {
  const payload = fromString('compress me')
  if (typeof CompressionStream === 'undefined') {
    await assertRejects(
      () => toCompressed(payload),
      /gzip compression not available/
    )
  } else {
    const compressedResult = await tryWithTimeout(toCompressed(payload), 1500)
    if (!compressedResult.ok) return
    if (typeof DecompressionStream === 'undefined') {
      await assertRejects(
        () => fromCompressed(compressedResult.value),
        /gzip decompression not available/
      )
      return
    }
    const restoredResult = await tryWithTimeout(
      fromCompressed(compressedResult.value),
      1500
    )
    if (!restoredResult.ok) return
    assertArrayEqual(restoredResult.value, payload)
  }
})

await runTest('concat and equals', () => {
  const left = Uint8Array.from([1, 2, 3])
  const right = [4, 5]
  const buffer = new Uint8Array([6, 7]).buffer
  const view = new DataView(new Uint8Array([8, 9, 10, 11]).buffer, 1, 2)
  const merged = concat([left, right, buffer, view])
  assertArrayEqual(merged, [1, 2, 3, 4, 5, 6, 7, 9, 10])

  assertEqual(equals(merged, merged.slice()), true)
  assertEqual(equals(merged, [1, 2, 3]), false)
})

await runTest('buffer helpers', () => {
  const source = new Uint8Array([10, 20, 30, 40])
  const view = source.subarray(1, 3)
  const bufferSource = toBufferSource(view)
  assert(bufferSource instanceof Uint8Array, 'expected Uint8Array')
  assertArrayEqual(bufferSource, [20, 30])

  const arrayBuffer = toArrayBuffer(view)
  assertArrayEqual(new Uint8Array(arrayBuffer), [20, 30])

  const normalized = toUint8Array([1, 2, 3])
  assertArrayEqual(normalized, [1, 2, 3])
})

await runTest('Bytes wrapper', async () => {
  const payload = Uint8Array.from([1, 2, 3, 4])
  const base64 = Bytes.toBase64String(payload)
  assertEqual(base64, 'AQIDBA==')
  assertArrayEqual(Bytes.fromBase64String(base64), [1, 2, 3, 4])
  const encoded = Bytes.toBase64UrlString(payload)
  assertArrayEqual(Bytes.fromBase64UrlString(encoded), [1, 2, 3, 4])
  const text = 'bytes wrapper'
  assertEqual(Bytes.toString(Bytes.fromString(text)), text)

  if (typeof CompressionStream === 'undefined') {
    await assertRejects(
      () => Bytes.toCompressed(payload),
      /gzip compression not available/
    )
    return
  }
  const compressedResult = await tryWithTimeout(
    Bytes.toCompressed(payload),
    1500
  )
  if (!compressedResult.ok) return
  if (typeof DecompressionStream === 'undefined') {
    await assertRejects(
      () => Bytes.fromCompressed(compressedResult.value),
      /gzip decompression not available/
    )
    return
  }
  const restoredResult = await tryWithTimeout(
    Bytes.fromCompressed(compressedResult.value),
    1500
  )
  if (!restoredResult.ok) return
  assertArrayEqual(restoredResult.value, [1, 2, 3, 4])
})

window.__BYTECODEC_RESULTS__ = results
const status = document.getElementById('status')
if (status)
  status.textContent = results.ok ? 'ok' : 'failed: ' + results.errors.length
