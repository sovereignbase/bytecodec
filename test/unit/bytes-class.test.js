import assert from 'node:assert/strict'
import test from 'node:test'
import { Bytes } from '../../dist/index.js'

test('Bytes wrapper mirrors functions', async () => {
  const payload = Uint8Array.from([1, 2, 3, 4])
  const base64 = Bytes.toBase64String(payload)
  assert.equal(base64, 'AQIDBA==')
  assert.deepStrictEqual(Bytes.fromBase64String(base64), payload)

  const encoded = Bytes.toBase64UrlString(payload)
  assert.deepStrictEqual(Bytes.fromBase64UrlString(encoded), payload)

  const text = 'wrapper check'
  assert.equal(Bytes.toString(Bytes.fromString(text)), text)

  const value = { wrapper: true, items: [1, 2, 3] }
  const jsonBytes = Bytes.fromJSON(value)
  assert.deepStrictEqual(Bytes.toJSON(jsonBytes), value)

  const compressed = await Bytes.toCompressed(payload)
  const restored = await Bytes.fromCompressed(compressed)
  assert.deepStrictEqual([...restored], [...payload])

  const joined = Bytes.concat([payload, [5, 6]])
  assert.deepStrictEqual([...joined], [1, 2, 3, 4, 5, 6])

  const buffer = Bytes.toArrayBuffer(payload)
  assert.deepStrictEqual([...new Uint8Array(buffer)], [1, 2, 3, 4])

  const view = Bytes.toBufferSource(payload)
  assert.deepStrictEqual([...view], [1, 2, 3, 4])

  const array = Bytes.toUint8Array([7, 8, 9])
  assert.deepStrictEqual([...array], [7, 8, 9])

  assert.equal(Bytes.equals(payload, [1, 2, 3, 4]), true)
})
