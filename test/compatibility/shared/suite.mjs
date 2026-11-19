function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function assertEqual(actual, expected, message) {
  assert(
    Object.is(actual, expected),
    `${message}: expected ${String(expected)}, received ${String(actual)}`
  )
}

function assertBytes(actual, expected, message) {
  assert(actual instanceof Uint8Array, `${message}: expected Uint8Array`)
  assert(
    actual.buffer instanceof ArrayBuffer,
    `${message}: expected ArrayBuffer backing`
  )
  assertEqual(actual.length, expected.length, `${message}: byte length`)
  for (let index = 0; index < expected.length; index++) {
    assertEqual(actual[index], expected[index], `${message}: byte ${index}`)
  }
}

export async function runBytecodecSuite(api, options = {}) {
  const label = options.label ?? 'bytecodec'
  const runtimeGlobals = options.runtimeGlobals ?? globalThis
  const gzipAvailable =
    Boolean(runtimeGlobals.process?.versions?.node) ||
    (typeof runtimeGlobals.CompressionStream === 'function' &&
      typeof runtimeGlobals.DecompressionStream === 'function')
  const tests = []
  const errors = []

  async function run(name, callback) {
    try {
      await callback()
      tests.push({ name, ok: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      tests.push({ name, ok: false })
      errors.push({ name, message })
    }
  }

  await run('offset and shared byte inputs', () => {
    const buffers = [new ArrayBuffer(8)]
    if (typeof SharedArrayBuffer !== 'undefined')
      buffers.push(new SharedArrayBuffer(8))
    for (const buffer of buffers) {
      new Uint8Array(buffer).set([255, 65, 66, 255])
      const view = new DataView(buffer, 1, 2)
      const normalized = api.util.normalizeBytes(view)
      assertBytes(normalized, [65, 66], 'offset normalization')
      assertEqual(api.base45.bytesToBase45String(view), 'BB8', 'offset Base45')
      assertEqual(api.base64.bytesToBase64String(view), 'QUI=', 'offset Base64')
      assertEqual(api.utf8.bytesToUTF8String(view), 'AB', 'offset UTF-8')
      normalized[0] = 0
      assertEqual(new Uint8Array(buffer)[1], 65, 'copy ownership')
    }
  })

  await run('focused export surfaces', () => {
    assertEqual(typeof api.root.Bytes, 'function', 'Bytes export')
    assertEqual(
      Object.keys(api.root).sort().join(','),
      'BytecodecError,Bytes',
      'root exports'
    )
    try {
      api.root.Bytes.base45.decode('A')
      throw new Error('invalid Base45 succeeded')
    } catch (error) {
      assert(
        error instanceof api.root.BytecodecError,
        'exported error constructor'
      )
      assertEqual(error.code, 'BASE45_INVALID_LENGTH', 'validation code')
    }
    for (const [namespace, names] of [
      [api.base45, ['bytesFromBase45String', 'bytesToBase45String']],
      [
        api.base64,
        [
          'bytesFromBase64String',
          'bytesFromBase64UrlString',
          'bytesToBase64String',
          'bytesToBase64UrlString',
        ],
      ],
      [api.gzip, ['bytesFromGzipBytes', 'bytesToGzipBytes']],
      [api.utf8, ['bytesFromUTF8String', 'bytesToUTF8String']],
      [
        api.util,
        [
          'concatBytes',
          'deriveBytes',
          'equalBytes',
          'generateBytes',
          'normalizeBytes',
        ],
      ],
    ]) {
      assertEqual(
        Object.keys(namespace).sort().join(','),
        names.sort().join(','),
        'subpath exports'
      )
    }
  })

  await run('Base45', () => {
    const bytes = new Uint8Array([65, 66, 67])
    const encoded = api.base45.bytesToBase45String(bytes)
    assertEqual(encoded, 'BB8M1', 'Base45 encoding')
    assertBytes(
      api.base45.bytesFromBase45String(encoded),
      bytes,
      'Base45 decoding'
    )
  })

  await run('Base64 and Base64URL', () => {
    const bytes = new Uint8Array([104, 101, 108, 108, 111])
    assertEqual(
      api.base64.bytesToBase64String(bytes),
      'aGVsbG8=',
      'Base64 encoding'
    )
    const encoded = api.base64.bytesToBase64UrlString(bytes)
    assertEqual(encoded, 'aGVsbG8', 'Base64URL encoding')
    assertBytes(
      api.base64.bytesFromBase64UrlString(encoded),
      bytes,
      'Base64URL decoding'
    )
  })

  await run('UTF-8', () => {
    const text = 'runtime ✓ 🚀'
    const bytes = api.utf8.bytesFromUTF8String(text)
    assertEqual(api.utf8.bytesToUTF8String(bytes), text, 'UTF-8 round-trip')
  })

  await run('gzip', async () => {
    const bytes = api.utf8.bytesFromUTF8String('runtime compression')
    if (!gzipAvailable) {
      try {
        await api.gzip.bytesToGzipBytes(bytes)
      } catch (error) {
        assertEqual(
          error?.code,
          'GZIP_COMPRESSION_UNAVAILABLE',
          'unavailable gzip error code'
        )
        return
      }
      throw new Error('gzip unexpectedly succeeded without a runtime API')
    }
    const compressed = await api.gzip.bytesToGzipBytes(bytes)
    assert(compressed.length > 0, 'gzip returned no bytes')
    assertBytes(
      await api.gzip.bytesFromGzipBytes(compressed),
      bytes,
      'gzip round-trip'
    )
  })

  await run('byte utilities', () => {
    const normalized = api.util.normalizeBytes(
      new DataView(new Uint8Array([0, 1, 2, 0]).buffer, 1, 2)
    )
    assertBytes(normalized, [1, 2], 'normalization')
    assertBytes(
      api.util.concatBytes([normalized, [3, 4]]),
      [1, 2, 3, 4],
      'concatenation'
    )
    assert(api.util.equalBytes(normalized, [1, 2]), 'equality failed')
    assertEqual(api.util.generateBytes(16).length, 16, 'generated byte length')
  })

  await run('HKDF derivation', async () => {
    const base = new Uint8Array([1, 2, 3])
    const first = await api.util.deriveBytes(base, [4, 5], 16)
    const second = await api.util.deriveBytes(base, [4, 5], 16)
    assertBytes(first, second, 'deterministic derivation')
  })

  await run('Bytes wrapper', async () => {
    const { Bytes } = api.root
    const bytes = Bytes.utf8.decode('wrapper')
    assertEqual(
      Bytes.utf8.encode(Bytes.base64.decode(Bytes.base64.encode(bytes))),
      'wrapper',
      'Bytes Base64 wrapper'
    )
    assertEqual(
      Bytes.utf8.encode(Bytes.base64url.decode(Bytes.base64url.encode(bytes))),
      'wrapper',
      'Bytes Base64URL wrapper'
    )
    if (gzipAvailable) {
      const compressed = await Bytes.gzip.encode(bytes)
      assertBytes(
        await Bytes.gzip.decode(compressed),
        bytes,
        'Bytes gzip wrapper'
      )
    }
  })

  const version =
    runtimeGlobals.Bun?.version ??
    runtimeGlobals.Deno?.version?.deno ??
    runtimeGlobals.process?.versions?.node
  return { label, version, ok: errors.length === 0, tests, errors }
}

export function printResults(results) {
  console.log('BYTECODEC_RESULT ' + JSON.stringify(results))
  const passed = results.tests.filter((test) => test.ok).length
  console.log(`${results.label}: ${passed}/${results.tests.length} passed`)
  for (const error of results.errors) {
    console.error(`  - ${error.name}: ${error.message}`)
  }
}

export function ensurePassing(results) {
  if (!results.ok) {
    throw new Error(
      `${results.label} failed with ${results.errors.length} failing tests`
    )
  }
}
