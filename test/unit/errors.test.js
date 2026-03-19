import assert from 'node:assert/strict'
import test from 'node:test'
import { BytecodecError } from '../../dist/.errors/class.js'

test('BytecodecError uses code when message is omitted', () => {
  const err = new BytecodecError('UTF8_ENCODER_UNAVAILABLE')
  assert.equal(err.code, 'UTF8_ENCODER_UNAVAILABLE')
  assert.equal(err.name, 'BytecodecError')
  assert.equal(
    err.message,
    '{@sovereignbase/bytecodec} UTF8_ENCODER_UNAVAILABLE'
  )
})

test('BytecodecError prefixes custom message', () => {
  const err = new BytecodecError(
    'UTF8_ENCODER_UNAVAILABLE',
    'No UTF-8 encoder available in this environment.'
  )
  assert.equal(
    err.message,
    '{@sovereignbase/bytecodec} No UTF-8 encoder available in this environment.'
  )
})
