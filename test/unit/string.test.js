import assert from 'node:assert/strict'
import test from 'node:test'
import { fromString, toString } from '../../dist/index.js'

test('utf8 string roundtrip', () => {
  const text = 'h\u00e9llo \u2713 rocket \ud83d\ude80'
  const bytes = fromString(text)
  assert.equal(toString(bytes), text)
})

test('fromString rejects non-string input', () => {
  assert.throws(() => fromString(123), /fromString expects a string input/)
})

test('toString accepts ArrayBufferView', () => {
  const buffer = new Uint8Array([97, 98, 99, 100]).buffer
  const view = new DataView(buffer, 1, 2)
  assert.equal(toString(view), 'bc')
})

test('toString rejects invalid input', () => {
  assert.throws(
    () => toString('nope'),
    /Expected a Uint8Array, ArrayBuffer, SharedArrayBuffer, ArrayBufferView, or number\[\]/
  )
})
