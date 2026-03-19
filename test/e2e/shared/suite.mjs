const TEST_TIMEOUT_MS = 5000
const COMPRESS_TIMEOUT_MS = 1500

export async function runBytecodecSuite(api, options = {}) {
  const { label = 'runtime' } = options
  const runtimeGlobals = options.runtimeGlobals ?? globalThis
  const results = { label, ok: true, errors: [], tests: [] }

  const {
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
  } = api

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

  function assertJsonEqual(actual, expected, message) {
    assertEqual(
      JSON.stringify(actual),
      JSON.stringify(expected),
      message || 'json mismatch'
    )
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

  async function withTimeout(promise, ms, name) {
    let timer
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => {
        reject(new Error(`timeout after ${ms}ms${name ? `: ${name}` : ''}`))
      }, ms)
    })
    return Promise.race([promise.finally(() => clearTimeout(timer)), timeout])
  }

  async function runTest(name, fn) {
    try {
      await withTimeout(Promise.resolve().then(fn), TEST_TIMEOUT_MS, name)
      results.tests.push({ name, ok: true })
    } catch (error) {
      results.ok = false
      results.tests.push({ name, ok: false })
      results.errors.push({ name, message: String(error) })
    }
  }

  function isNodeLikeRuntime() {
    return (
      typeof runtimeGlobals.process !== 'undefined' &&
      !!runtimeGlobals.process?.versions?.node
    )
  }

  const base64Payload = Uint8Array.from([104, 101, 108, 108, 111])
  const utf8Text = 'h\u00e9llo \u2713 rocket \ud83d\ude80'
  const jsonValue = { ok: true, count: 3, list: ['x', { y: 1 }], nil: null }
  const compressionPayload = fromString('compress me please')

  await runTest('exports shape', () => {
    assert(typeof Bytes === 'function', 'Bytes export missing')
    for (const fn of [
      fromBase64String,
      toBase64String,
      fromBase64UrlString,
      toBase64UrlString,
      fromString,
      toString,
      fromJSON,
      toJSON,
      toCompressed,
      fromCompressed,
      toBufferSource,
      toArrayBuffer,
      toUint8Array,
      concat,
      equals,
    ]) {
      assert(typeof fn === 'function', 'expected function export')
    }
  })

  await runTest('toBase64String', () => {
    const encoded = toBase64String(base64Payload)
    assertEqual(encoded, 'aGVsbG8=')

    const view = new DataView(base64Payload.buffer, 1, 3)
    assertEqual(toBase64String(view), 'ZWxs')
  })

  await runTest('fromBase64String', () => {
    const decoded = fromBase64String('aGVsbG8=')
    assertArrayEqual(decoded, base64Payload)
  })

  await runTest('toBase64UrlString', () => {
    const encoded = toBase64UrlString(base64Payload)
    assertEqual(encoded, 'aGVsbG8')
  })

  await runTest('fromBase64UrlString', () => {
    const decoded = fromBase64UrlString('aGVsbG8')
    assertArrayEqual(decoded, base64Payload)
    assertThrows(() => fromBase64UrlString('a'), /Invalid base64url length/)
  })

  await runTest('fromString', () => {
    const bytes = fromString(utf8Text)
    assertEqual(toString(bytes), utf8Text)
  })

  await runTest('toString', () => {
    const ascii = fromString('abcd')
    const text = toString(ascii)
    assertEqual(text, 'abcd')

    const bytes = fromString(utf8Text)
    assertEqual(toString(bytes), utf8Text)

    const view = new DataView(ascii.buffer, 1, 2)
    assertEqual(toString(view), 'bc')
  })

  await runTest('fromJSON', () => {
    const bytes = fromJSON(jsonValue)
    assertJsonEqual(toJSON(bytes), jsonValue)
  })

  await runTest('toJSON', () => {
    assertJsonEqual(
      toJSON('{"ok":true,"count":3,"list":["x",{"y":1}],"nil":null}'),
      jsonValue
    )
  })

  await runTest('toUint8Array', () => {
    const source = new Uint8Array([10, 20, 30, 40])
    const view = new DataView(source.buffer, 1, 2)
    const normalized = toUint8Array(view)
    source[1] = 99
    source[2] = 88

    assertArrayEqual(normalized, [20, 30])
  })

  await runTest('toArrayBuffer', () => {
    const source = new Uint8Array([10, 20, 30, 40])
    const view = new DataView(source.buffer, 1, 2)
    const copiedBuffer = toArrayBuffer(view)
    source[1] = 99
    source[2] = 88
    assertArrayEqual(new Uint8Array(copiedBuffer), [20, 30])
  })

  await runTest('toBufferSource', () => {
    const source = new Uint8Array([10, 20, 30, 40])
    const view = new DataView(source.buffer, 1, 2)
    const bufferSource = toBufferSource(view)
    source[1] = 99
    source[2] = 88
    assert(ArrayBuffer.isView(bufferSource), 'expected ArrayBufferView')
    assertArrayEqual(bufferSource, [20, 30])
  })

  await runTest('SharedArrayBuffer support', () => {
    const SharedArrayBufferCtor = runtimeGlobals.SharedArrayBuffer
    if (typeof SharedArrayBufferCtor === 'undefined') return
    const shared = new SharedArrayBufferCtor(4)
    const view = new Uint8Array(shared)
    view.set([5, 6, 7, 8])
    const normalized = toUint8Array(view)
    const copiedBuffer = toArrayBuffer(view)
    view[1] = 99
    assertArrayEqual(normalized, [5, 6, 7, 8])
    assertArrayEqual(new Uint8Array(copiedBuffer), [5, 6, 7, 8])
  })

  await runTest('concat', () => {
    const left = Uint8Array.from([1, 2, 3])
    const right = [4, 5]
    const buffer = new Uint8Array([6, 7]).buffer
    const view = new DataView(new Uint8Array([8, 9, 10, 11]).buffer, 1, 2)

    const merged = concat([left, right, buffer, view])
    assertArrayEqual(merged, [1, 2, 3, 4, 5, 6, 7, 9, 10])
  })

  await runTest('equals', () => {
    const merged = Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 9, 10])
    assertEqual(equals(merged, merged.slice()), true)
    assertEqual(equals(merged, [1, 2, 3]), false)
  })

  await runTest('toCompressed', async () => {
    const nodeLike = isNodeLikeRuntime()

    if (!nodeLike && typeof runtimeGlobals.CompressionStream === 'undefined') {
      await assertRejects(
        () => toCompressed(compressionPayload),
        /gzip compression not available/
      )
      return
    }

    const compressed = await withTimeout(
      toCompressed(compressionPayload),
      COMPRESS_TIMEOUT_MS,
      'toCompressed'
    )
    assert(compressed instanceof Uint8Array, 'expected Uint8Array result')
    assert(compressed.length > 0, 'expected compressed bytes')
  })

  await runTest('fromCompressed', async () => {
    const nodeLike = isNodeLikeRuntime()

    if (!nodeLike && typeof runtimeGlobals.CompressionStream === 'undefined') {
      await assertRejects(
        () => toCompressed(compressionPayload),
        /gzip compression not available/
      )
      return
    }

    const compressed = await withTimeout(
      toCompressed(compressionPayload),
      COMPRESS_TIMEOUT_MS,
      'toCompressed for fromCompressed'
    )

    if (
      !nodeLike &&
      typeof runtimeGlobals.DecompressionStream === 'undefined'
    ) {
      await assertRejects(
        () => fromCompressed(compressed),
        /gzip decompression not available/
      )
      return
    }

    const restored = await withTimeout(
      fromCompressed(compressed),
      COMPRESS_TIMEOUT_MS,
      'fromCompressed'
    )
    assertArrayEqual(restored, compressionPayload)
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

    const value = { wrapper: true, items: [1, 2, 3] }
    assertJsonEqual(Bytes.toJSON(Bytes.fromJSON(value)), value)

    const joined = Bytes.concat([payload, [5, 6]])
    assertArrayEqual(joined, [1, 2, 3, 4, 5, 6])
    assertEqual(Bytes.equals(payload, [1, 2, 3, 4]), true)
  })

  return results
}

export function printResults(results) {
  const passed = results.tests.filter((test) => test.ok).length
  console.log(`${results.label}: ${passed}/${results.tests.length} passed`)
  if (!results.ok) {
    for (const error of results.errors)
      console.error(`  - ${error.name}: ${error.message}`)
  }
}

export function ensurePassing(results) {
  if (results.ok) return
  throw new Error(
    `${results.label} failed with ${results.errors.length} failing tests`
  )
}
