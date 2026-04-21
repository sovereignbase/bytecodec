import assert from 'node:assert/strict'
import test from 'node:test'
import {
  fromBase45String,
  fromString,
  toBase45String,
  toString,
} from '../../dist/index.js'

test('base45 roundtrip uses the RFC example for "AB"', () => {
  const payload = new Uint8Array([65, 66])
  const encoded = toBase45String(payload)
  assert.equal(encoded, 'BB8')
  const decoded = fromBase45String(encoded)
  assert.deepStrictEqual([...decoded], [...payload])
})

test('base45 encodes a trailing single byte as two characters', () => {
  const payload = new Uint8Array([65, 66, 67])
  const encoded = toBase45String(payload)
  assert.equal(encoded, 'BB8M1')
  const decoded = fromBase45String(encoded)
  assert.deepStrictEqual([...decoded], [...payload])
})

test('base45 matches the RFC 9285 "Hello!!" example', () => {
  const encoded = toBase45String(fromString('Hello!!'))
  assert.equal(encoded, '%69 VD92EX0')
  assert.equal(toString(fromBase45String(encoded)), 'Hello!!')
})

test('base45 matches the RFC 9285 "base-45" example', () => {
  const encoded = toBase45String(fromString('base-45'))
  assert.equal(encoded, 'UJCLQE7W581')
  assert.equal(toString(fromBase45String(encoded)), 'base-45')
})

test('base45 matches the RFC 9285 decoding example', () => {
  assert.equal(toString(fromBase45String('QED8WEX0')), 'ietf!')
})

test('base45 accepts ByteSource input', () => {
  const encoded = toBase45String([1, 2, 3])
  assert.equal(encoded, 'X5030')
  const decoded = fromBase45String(encoded)
  assert.deepStrictEqual([...decoded], [1, 2, 3])
})

test('base45 encodes and decodes empty input', () => {
  assert.equal(toBase45String(new Uint8Array([])), '')
  assert.deepStrictEqual([...fromBase45String('')], [])
})

test('base45 rejects invalid length', () => {
  assert.throws(
    () => fromBase45String('A'),
    /Base45 string length must not leave a trailing single character/
  )
})

test('base45 rejects invalid characters', () => {
  assert.throws(
    () => fromBase45String('bb8'),
    /Invalid base45 character at index 0/
  )
  assert.throws(
    () => fromBase45String('åB8'),
    /Invalid base45 character at index 0/
  )
})

test('base45 rejects chunks outside the byte range', () => {
  assert.throws(() => fromBase45String(':::'), /Invalid base45 chunk at index 0/)
  assert.throws(() => fromBase45String('::'), /Invalid base45 chunk at index 0/)
  assert.throws(() => fromBase45String('GGW'), /Invalid base45 chunk at index 0/)
})

test('base45 accepts the largest valid 16-bit triplet', () => {
  assert.deepStrictEqual([...fromBase45String('FGW')], [0xff, 0xff])
})

test('base45 rejects non-string input', () => {
  assert.throws(
    () => fromBase45String(123),
    /fromBase45String expects a string input/
  )
})
