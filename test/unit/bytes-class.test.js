import assert from 'node:assert/strict'
import test from 'node:test'
import { Bytes } from '../../dist/index.js'

test('Bytes wrapper mirrors functions', async () => {
  const payload = Uint8Array.from([1, 2, 3, 4])
  const base45 = Bytes.toBase45String(payload)
  assert.equal(base45, 'X507H0')
  assert.deepStrictEqual(Bytes.fromBase45String(base45), payload)

  const base58 = Bytes.toBase58String(payload)
  assert.equal(base58, '2VfUX')
  assert.deepStrictEqual(Bytes.fromBase58String(base58), payload)

  const base58Btc = Bytes.toBase58BtcString(payload)
  assert.equal(base58Btc, 'z2VfUX')
  assert.deepStrictEqual(Bytes.fromBase58BtcString(base58Btc), payload)

  const base64 = Bytes.toBase64String(payload)
  assert.equal(base64, 'AQIDBA==')
  assert.deepStrictEqual(Bytes.fromBase64String(base64), payload)

  const encoded = Bytes.toBase64UrlString(payload)
  assert.deepStrictEqual(Bytes.fromBase64UrlString(encoded), payload)

  const hex = Bytes.toHex(payload)
  assert.equal(hex, '01020304')
  assert.deepStrictEqual(Bytes.fromHex(hex), payload)

  const z85 = Bytes.toZ85String(payload)
  assert.deepStrictEqual(Bytes.fromZ85String(z85), payload)

  const text = 'wrapper check'
  assert.equal(Bytes.toString(Bytes.fromString(text)), text)

  const bigint = 0x01020304n
  assert.deepStrictEqual([...Bytes.fromBigInt(bigint)], [1, 2, 3, 4])
  assert.equal(Bytes.toBigInt(payload), bigint)

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
