import assert from 'node:assert/strict'
import test from 'node:test'
import {
  fromBase58BtcString,
  fromBase58String,
  toBase58BtcString,
  toBase58String,
} from '../../dist/index.js'

test('base58 roundtrip', () => {
  const payload = new Uint8Array([104, 101, 108, 108, 111])
  const encoded = toBase58String(payload)
  assert.equal(encoded, 'Cn8eVZg')
  const decoded = fromBase58String(encoded)
  assert.deepStrictEqual([...decoded], [...payload])
})

test('base58 preserves leading zero bytes', () => {
  const payload = new Uint8Array([0, 0, 1, 2, 3, 4])
  const encoded = toBase58String(payload)
  assert.equal(encoded, '112VfUX')
  const decoded = fromBase58String(encoded)
  assert.deepStrictEqual([...decoded], [...payload])
})

test('base58 accepts ByteSource input', () => {
  const encoded = toBase58String([1, 2, 3, 4])
  assert.equal(encoded, '2VfUX')
  const decoded = fromBase58String(encoded)
  assert.deepStrictEqual([...decoded], [1, 2, 3, 4])
})

test('base58btc roundtrip', () => {
  const payload = new Uint8Array([104, 101, 108, 108, 111])
  const encoded = toBase58BtcString(payload)
  assert.equal(encoded, 'zCn8eVZg')
  const decoded = fromBase58BtcString(encoded)
  assert.deepStrictEqual([...decoded], [...payload])
})

test('base58btc encodes empty input as just the multibase prefix', () => {
  assert.equal(toBase58BtcString(new Uint8Array([])), 'z')
  assert.deepStrictEqual([...fromBase58BtcString('z')], [])
})

test('base58 rejects invalid characters', () => {
  assert.throws(
    () => fromBase58String('0'),
    /Invalid base58 character at index 0/
  )
  assert.throws(
    () => fromBase58String('å'),
    /Invalid base58 character at index 0/
  )
})

test('base58 rejects non-string input', () => {
  assert.throws(
    () => fromBase58String(123),
    /fromBase58String expects a string input/
  )
})

test('base58btc rejects missing multibase prefix', () => {
  assert.throws(
    () => fromBase58BtcString('Cn8eVZg'),
    /base58btc string must start with the multibase prefix "z"/
  )
})

test('base58btc rejects non-string input', () => {
  assert.throws(
    () => fromBase58BtcString(123),
    /fromBase58BtcString expects a string input/
  )
})
