import assert from 'node:assert/strict'
import test from 'node:test'

function importFreshBundle(tag) {
  const url = new URL(
    `../../dist/index.js?${tag}=${Date.now()}-${Math.random()}`,
    import.meta.url
  )
  return import(url.href)
}

test('public errors expose code, name, and prefixed message', async () => {
  const originalTextEncoder = globalThis.TextEncoder
  const originalBuffer = globalThis.Buffer
  let capturedError

  globalThis.TextEncoder = undefined
  globalThis.Buffer = undefined

  try {
    const { fromString } = await importFreshBundle('utf8-error')

    assert.throws(
      () => fromString('hello'),
      (error) => {
        capturedError = error
        assert.equal(error.code, 'UTF8_ENCODER_UNAVAILABLE')
        assert.equal(error.name, 'BytecodecError')
        assert.equal(
          error.message,
          '{@sovereignbase/bytecodec} No UTF-8 encoder available in this environment.'
        )
        return true
      }
    )
  } finally {
    globalThis.TextEncoder = originalTextEncoder
    globalThis.Buffer = originalBuffer
  }

  assert.ok(capturedError)
  const BytecodecError = capturedError.constructor
  const errorWithCodeFallback = new BytecodecError('UTF8_ENCODER_UNAVAILABLE')

  assert.equal(errorWithCodeFallback.code, 'UTF8_ENCODER_UNAVAILABLE')
  assert.equal(errorWithCodeFallback.name, 'BytecodecError')
  assert.equal(
    errorWithCodeFallback.message,
    '{@sovereignbase/bytecodec} UTF8_ENCODER_UNAVAILABLE'
  )
})

test('validation errors use the same public error shape', async () => {
  const { fromBase64UrlString, fromBigInt, fromHex, toZ85String } =
    await importFreshBundle('validation-error')

  assert.throws(
    () => fromBase64UrlString('a'),
    (error) => {
      assert.equal(error.code, 'BASE64URL_INVALID_LENGTH')
      assert.equal(error.name, 'BytecodecError')
      assert.equal(
        error.message,
        '{@sovereignbase/bytecodec} Invalid base64url length'
      )
      return true
    }
  )

  assert.throws(
    () => fromHex('abc'),
    (error) => {
      assert.equal(error.code, 'HEX_INVALID_LENGTH')
      assert.equal(error.name, 'BytecodecError')
      assert.equal(
        error.message,
        '{@sovereignbase/bytecodec} Hex string must have an even length'
      )
      return true
    }
  )

  assert.throws(
    () => fromBigInt(-1n),
    (error) => {
      assert.equal(error.code, 'BIGINT_UNSIGNED_EXPECTED')
      assert.equal(error.name, 'BytecodecError')
      assert.equal(
        error.message,
        '{@sovereignbase/bytecodec} fromBigInt expects an unsigned bigint'
      )
      return true
    }
  )

  assert.throws(
    () => toZ85String([1, 2, 3]),
    (error) => {
      assert.equal(error.code, 'Z85_INVALID_LENGTH')
      assert.equal(error.name, 'BytecodecError')
      assert.equal(
        error.message,
        '{@sovereignbase/bytecodec} Z85 input length must be divisible by 4'
      )
      return true
    }
  )
})
