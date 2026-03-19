import assert from 'node:assert/strict'
import test from 'node:test'
import {
  fromBase64String,
  fromBase64UrlString,
  toBase64String,
  toBase64UrlString,
} from '../../dist/index.js'

test('base64 roundtrip', () => {
  const payload = new Uint8Array([104, 101, 108, 108, 111])
  const encoded = toBase64String(payload)
  assert.equal(encoded, 'aGVsbG8=')
  const decoded = fromBase64String(encoded)
  assert.deepStrictEqual([...decoded], [...payload])
})

test('base64 accepts ByteSource input', () => {
  const encoded = toBase64String([1, 2, 3, 4])
  assert.equal(encoded, 'AQIDBA==')
  const decoded = fromBase64String(encoded)
  assert.deepStrictEqual([...decoded], [1, 2, 3, 4])
})

test('base64url roundtrip', () => {
  const payload = new Uint8Array([104, 101, 108, 108, 111])
  const encoded = toBase64UrlString(payload)
  assert.equal(encoded, 'aGVsbG8')
  const decoded = fromBase64UrlString(encoded)
  assert.deepStrictEqual([...decoded], [...payload])
})

test('base64url accepts number[] input', () => {
  const encoded = toBase64UrlString([1, 2, 3, 4])
  assert.equal(encoded, 'AQIDBA')
  const decoded = fromBase64UrlString(encoded)
  assert.deepStrictEqual([...decoded], [1, 2, 3, 4])
})

test('base64url rejects invalid length', () => {
  assert.throws(() => fromBase64UrlString('a'), /Invalid base64url length/)
})
