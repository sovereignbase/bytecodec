import assert from 'node:assert/strict'
import test from 'node:test'
import { equals } from '../../dist/index.js'

test('equals handles matching inputs', () => {
  const left = Uint8Array.from([1, 2, 3, 4])
  const same = new Uint8Array(left)
  const array = [1, 2, 3, 4]
  const buffer = new Uint8Array([1, 2, 3, 4]).buffer

  assert.equal(equals(left, same), true)
  assert.equal(equals(left, array), true)
  assert.equal(equals(left, buffer), true)
})

test('equals handles different inputs', () => {
  const left = Uint8Array.from([1, 2, 3, 4])
  const view = new DataView(new Uint8Array([0, 1, 2, 3, 9]).buffer, 1, 4)

  assert.equal(equals(left, view), false)
  assert.equal(equals(left, [1, 2, 3, 5]), false)
  assert.equal(equals([1, 2], [1, 2, 3]), false)
})

test('equals rejects invalid input', () => {
  assert.throws(
    () => equals('nope', [1]),
    /Expected a Uint8Array, ArrayBuffer, SharedArrayBuffer, ArrayBufferView, or number\[\]/
  )
})
