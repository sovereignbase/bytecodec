import assert from 'node:assert/strict'
import test from 'node:test'
import { fromBigInt, toBigInt } from '../../dist/index.js'

test('bigint roundtrip uses unsigned big-endian encoding', () => {
  const value = 0x1234567890abcdef1234567890abcdefn
  const bytes = fromBigInt(value)

  assert.deepStrictEqual(
    [...bytes],
    [
      0x12, 0x34, 0x56, 0x78, 0x90, 0xab, 0xcd, 0xef, 0x12, 0x34, 0x56, 0x78,
      0x90, 0xab, 0xcd, 0xef,
    ]
  )
  assert.equal(toBigInt(bytes), value)
})

test('bigint helpers accept normalized ByteSource inputs', () => {
  const source = Uint8Array.from([0xaa, 0xbb, 0xcc, 0xdd])
  const view = new DataView(source.buffer, 1, 2)

  assert.equal(toBigInt(view), 0xbbccn)
  assert.deepStrictEqual([...fromBigInt(0xbbccn)], [0xbb, 0xcc])
})

test('bigint helpers encode zero as an empty byte array', () => {
  assert.deepStrictEqual([...fromBigInt(0n)], [])
  assert.equal(toBigInt(new Uint8Array()), 0n)
  assert.equal(toBigInt([]), 0n)
})

test('bigint helpers use minimal-width encoding', () => {
  assert.equal(toBigInt([0x00, 0x01]), 1n)
  assert.deepStrictEqual([...fromBigInt(1n)], [0x01])
})

test('fromBigInt rejects invalid inputs', () => {
  assert.throws(() => fromBigInt(123), /fromBigInt expects a bigint input/)
  assert.throws(() => fromBigInt(-1n), /fromBigInt expects an unsigned bigint/)
})
