import assert from 'node:assert/strict'
import test from 'node:test'
import { fromHex, toHex } from '../../dist/index.js'

test('hex roundtrip', () => {
  const payload = new Uint8Array([0, 1, 15, 16, 171, 205, 239, 255])
  const encoded = toHex(payload)
  assert.equal(encoded, '00010f10abcdefff')
  const decoded = fromHex(encoded)
  assert.deepStrictEqual([...decoded], [...payload])
})

test('hex accepts uppercase strings and ByteSource input', () => {
  assert.equal(toHex([1, 2, 254, 255]), '0102feff')
  const decoded = fromHex('0102FEFF')
  assert.deepStrictEqual([...decoded], [1, 2, 254, 255])
})

test('fromHex rejects non-string input', () => {
  assert.throws(() => fromHex(123), /fromHex expects a string input/)
})

test('fromHex rejects odd-length strings', () => {
  assert.throws(() => fromHex('abc'), /Hex string must have an even length/)
})

test('fromHex rejects invalid high nibble characters', () => {
  assert.throws(() => fromHex('x0'), /Invalid hex character at index 0/)
})

test('fromHex rejects invalid low nibble characters', () => {
  assert.throws(() => fromHex('0x'), /Invalid hex character at index 1/)
})

test('fromHex rejects non-ASCII characters', () => {
  assert.throws(() => fromHex('åå'), /Invalid hex character at index 0/)
})
