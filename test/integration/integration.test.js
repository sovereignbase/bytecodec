import assert from 'node:assert/strict'
import test from 'node:test'
import {
  concat,
  fromBase64String,
  fromBase64UrlString,
  fromJSON,
  fromString,
  toBase64String,
  toBase64UrlString,
  toJSON,
  toString,
} from '../../dist/index.js'

test('integration: utf8 -> base64 -> utf8', () => {
  const text = 'pipeline check'
  const bytes = fromString(text)
  const encoded = toBase64String(bytes)
  const decoded = fromBase64String(encoded)
  assert.equal(toString(decoded), text)
})

test('integration: utf8 -> base64url -> utf8', () => {
  const text = 'pipeline check'
  const bytes = fromString(text)
  const encoded = toBase64UrlString(bytes)
  const decoded = fromBase64UrlString(encoded)
  assert.equal(toString(decoded), text)
})

test('integration: json -> bytes -> base64url -> json', () => {
  const value = { ok: true, list: [1, 2, 3] }
  const bytes = fromJSON(value)
  const encoded = toBase64UrlString(bytes)
  const decoded = fromBase64UrlString(encoded)
  assert.deepStrictEqual(toJSON(decoded), value)
})

test('integration: concat + base64url', () => {
  const left = fromString('left')
  const right = fromString('right')
  const merged = concat([left, right])
  const encoded = toBase64UrlString(merged)
  const decoded = fromBase64UrlString(encoded)
  assert.equal(toString(decoded), 'leftright')
})
