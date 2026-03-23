import assert from 'node:assert/strict'
import test from 'node:test'
import { fromZ85String, toZ85String } from '../../dist/index.js'

const helloWorldBytes = [0x86, 0x4f, 0xd2, 0x6f, 0xb5, 0x59, 0xf7, 0x5b]

test('z85 roundtrip uses the ZeroMQ test vector', () => {
  const payload = new Uint8Array(helloWorldBytes)
  const encoded = toZ85String(payload)
  assert.equal(encoded, 'HelloWorld')
  const decoded = fromZ85String(encoded)
  assert.deepStrictEqual([...decoded], [...payload])
})

test('z85 accepts number[] input', () => {
  assert.equal(toZ85String(helloWorldBytes), 'HelloWorld')
})

test('fromZ85String rejects non-string input', () => {
  assert.throws(
    () => fromZ85String(123),
    /fromZ85String expects a string input/
  )
})

test('toZ85String rejects lengths that are not divisible by 4', () => {
  assert.throws(
    () => toZ85String([1, 2, 3]),
    /Z85 input length must be divisible by 4/
  )
})

test('fromZ85String rejects lengths that are not divisible by 5', () => {
  assert.throws(
    () => fromZ85String('abcd'),
    /Z85 string length must be divisible by 5/
  )
})

test('fromZ85String rejects invalid ASCII characters', () => {
  assert.throws(
    () => fromZ85String('Hell~'),
    /Invalid Z85 character at index 4/
  )
})

test('fromZ85String rejects invalid non-ASCII characters', () => {
  assert.throws(
    () => fromZ85String('Hellå'),
    /Invalid Z85 character at index 4/
  )
})

test('fromZ85String rejects blocks outside the uint32 range', () => {
  assert.throws(() => fromZ85String('#####'), /Invalid Z85 block at index 0/)
})
