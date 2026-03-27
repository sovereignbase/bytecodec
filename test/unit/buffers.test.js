import assert from 'node:assert/strict'
import test from 'node:test'
import {
  toArrayBuffer,
  toBufferSource,
  toUint8Array,
} from '../../dist/index.js'

test('toUint8Array handles Uint8Array', () => {
  const input = new Uint8Array([1, 2, 3])
  const output = toUint8Array(input)
  assert.notStrictEqual(output, input)
  assert.notStrictEqual(output.buffer, input.buffer)
  assert.deepStrictEqual([...output], [...input])
})

test('toUint8Array handles SharedArrayBuffer', () => {
  if (typeof SharedArrayBuffer === 'undefined') return
  const sab = new SharedArrayBuffer(4)
  new Uint8Array(sab).set([9, 8, 7, 6])
  const output = toUint8Array(sab)
  assert.notStrictEqual(output.buffer, sab)
  assert.deepStrictEqual([...output], [9, 8, 7, 6])
})

test('toUint8Array handles ArrayBuffer', () => {
  const buffer = new Uint8Array([4, 5]).buffer
  const output = toUint8Array(buffer)
  assert.notStrictEqual(output.buffer, buffer)
  assert.deepStrictEqual([...output], [4, 5])
})

test('toUint8Array handles ArrayBufferView', () => {
  const source = new Uint8Array([10, 11, 12, 13])
  const view = new DataView(source.buffer, 1, 2)
  const output = toUint8Array(view)
  assert.notStrictEqual(output.buffer, source.buffer)
  assert.deepStrictEqual([...output], [11, 12])
})

test('toUint8Array handles SharedArrayBuffer view', () => {
  if (typeof SharedArrayBuffer === 'undefined') return
  const sab = new SharedArrayBuffer(4)
  const source = new Uint8Array(sab)
  source.set([5, 6, 7, 8])
  const view = new DataView(sab, 1, 2)
  const output = toUint8Array(view)
  assert.notStrictEqual(output.buffer, sab)
  assert.deepStrictEqual([...output], [6, 7])
})

test('toUint8Array handles number[]', () => {
  const output = toUint8Array([7, 8, 9])
  assert.deepStrictEqual([...output], [7, 8, 9])
})

test('toUint8Array rejects invalid input', () => {
  assert.throws(
    () => toUint8Array('nope'),
    /Expected a Uint8Array, ArrayBuffer, SharedArrayBuffer, ArrayBufferView, or number\[\]/
  )
})

test('toArrayBuffer handles ArrayBuffer', () => {
  const buffer = new Uint8Array([1, 2, 3]).buffer
  const output = toArrayBuffer(buffer)
  assert.notStrictEqual(output, buffer)
  assert.deepStrictEqual([...new Uint8Array(output)], [1, 2, 3])
})

test('toArrayBuffer handles SharedArrayBuffer', () => {
  if (typeof SharedArrayBuffer === 'undefined') return
  const sab = new SharedArrayBuffer(4)
  new Uint8Array(sab).set([1, 2, 3, 4])
  const output = toArrayBuffer(sab)
  assert.equal(output instanceof SharedArrayBuffer, false)
  assert.deepStrictEqual([...new Uint8Array(output)], [1, 2, 3, 4])
})

test('toArrayBuffer handles ArrayBufferView', () => {
  const source = new Uint8Array([5, 6, 7, 8])
  const view = new DataView(source.buffer, 1, 2)
  const output = toArrayBuffer(view)
  assert.notStrictEqual(output, source.buffer)
  assert.deepStrictEqual([...new Uint8Array(output)], [6, 7])
})

test('toArrayBuffer handles SharedArrayBuffer view', () => {
  if (typeof SharedArrayBuffer === 'undefined') return
  const sab = new SharedArrayBuffer(4)
  const source = new Uint8Array(sab)
  source.set([1, 2, 3, 4])
  const output = toArrayBuffer(source)
  assert.equal(output instanceof SharedArrayBuffer, false)
  assert.deepStrictEqual([...new Uint8Array(output)], [1, 2, 3, 4])
})

test('toArrayBuffer handles number[]', () => {
  const output = toArrayBuffer([9, 10])
  assert.deepStrictEqual([...new Uint8Array(output)], [9, 10])
})

test('toArrayBuffer rejects invalid input', () => {
  assert.throws(
    () => toArrayBuffer('nope'),
    /Expected a Uint8Array, ArrayBuffer, SharedArrayBuffer, ArrayBufferView, or number\[\]/
  )
})

test('toBufferSource returns Uint8Array copy', () => {
  const input = new Uint8Array([20, 21, 22])
  const output = toBufferSource(input)
  assert.notStrictEqual(output, input)
  assert.notStrictEqual(output.buffer, input.buffer)
  assert.deepStrictEqual([...output], [...input])
})

test('toBufferSource handles ArrayBuffer', () => {
  const buffer = new Uint8Array([30, 31]).buffer
  const output = toBufferSource(buffer)
  assert.ok(output instanceof Uint8Array)
  assert.notStrictEqual(output.buffer, buffer)
  assert.deepStrictEqual([...output], [30, 31])
})

test('toBufferSource handles SharedArrayBuffer', () => {
  if (typeof SharedArrayBuffer === 'undefined') return
  const sab = new SharedArrayBuffer(4)
  new Uint8Array(sab).set([30, 31, 32, 33])
  const output = toBufferSource(sab)
  assert.ok(output instanceof Uint8Array)
  assert.notStrictEqual(output.buffer, sab)
  assert.deepStrictEqual([...output], [30, 31, 32, 33])
})

test('toBufferSource handles ArrayBufferView', () => {
  const source = new Uint8Array([40, 41, 42, 43])
  const view = new DataView(source.buffer, 2, 2)
  const output = toBufferSource(view)
  assert.ok(output instanceof Uint8Array)
  assert.notStrictEqual(output.buffer, source.buffer)
  assert.deepStrictEqual([...output], [42, 43])
})
