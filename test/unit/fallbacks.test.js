import assert from 'node:assert/strict'
import test from 'node:test'
import { Buffer as NodeBuffer } from 'node:buffer'
import { ReadableStream, WritableStream } from 'node:stream/web'

const originalTextEncoder = globalThis.TextEncoder
const originalTextDecoder = globalThis.TextDecoder
globalThis.TextEncoder = undefined
globalThis.TextDecoder = undefined

const bundleUrl = new URL(
  `../../dist/index.js?fallbacks=${Date.now()}-${Math.random()}`,
  import.meta.url
)
const {
  concat,
  fromBase58BtcString,
  fromBase58String,
  fromBase64UrlString,
  fromCompressed,
  fromJSON,
  fromString,
  toBase58BtcString,
  toBase58String,
  toBase64UrlString,
  toCompressed,
  toJSON,
  toString,
} = await import(bundleUrl.href)

const originalGlobals = {
  Buffer: globalThis.Buffer,
  btoa: globalThis.btoa,
  atob: globalThis.atob,
  CompressionStream: globalThis.CompressionStream,
  DecompressionStream: globalThis.DecompressionStream,
}
const originalError = globalThis.Error
const FakeError = class FakeError {
  constructor(message) {
    this.message = message
  }
  toString() {
    return this.message
  }
}

const nodeVersionDescriptor = Object.getOwnPropertyDescriptor(
  process.versions,
  'node'
)

function setNodeVersion(value) {
  Object.defineProperty(process.versions, 'node', {
    value,
    configurable: true,
    enumerable: true,
    writable: false,
  })
}

function restoreNodeVersion() {
  if (nodeVersionDescriptor)
    Object.defineProperty(process.versions, 'node', nodeVersionDescriptor)
}

function restoreGlobals() {
  globalThis.Buffer = originalGlobals.Buffer
  globalThis.btoa = originalGlobals.btoa
  globalThis.atob = originalGlobals.atob
  globalThis.CompressionStream = originalGlobals.CompressionStream
  globalThis.DecompressionStream = originalGlobals.DecompressionStream
}

class PassThroughCompressionStream {
  constructor() {
    let controller
    this.readable = new ReadableStream({
      start(streamController) {
        controller = streamController
      },
    })
    this.writable = new WritableStream({
      write(chunk) {
        controller.enqueue(chunk)
      },
      close() {
        controller.close()
      },
    })
  }
}

test('fromString falls back to Buffer when TextEncoder is missing', () => {
  const bytes = fromString('hello')
  assert.deepStrictEqual([...bytes], [104, 101, 108, 108, 111])
})

test('fromString throws without encoder support', () => {
  const originalBuffer = globalThis.Buffer
  globalThis.Buffer = undefined
  assert.throws(() => fromString('hello'), /No UTF-8 encoder available/)
  globalThis.Buffer = originalBuffer
})

test('toString falls back to Buffer when TextDecoder is missing', () => {
  const bytes = new Uint8Array([104, 101, 108, 108, 111])
  assert.equal(toString(bytes), 'hello')
})

test('toString throws without decoder support', () => {
  const originalBuffer = globalThis.Buffer
  globalThis.Buffer = undefined
  assert.throws(() => toString(new Uint8Array([1])), /No UTF-8 decoder/)
  globalThis.Buffer = originalBuffer
})

test('toBase64UrlString uses btoa fallback when Buffer is missing', () => {
  globalThis.Buffer = undefined
  globalThis.btoa = (binary) =>
    NodeBuffer.from(binary, 'binary').toString('base64')
  const encoded = toBase64UrlString(new Uint8Array([104, 101, 108, 108, 111]))
  assert.equal(encoded, 'aGVsbG8')
  restoreGlobals()
})

test('toBase64UrlString throws when no base64 encoder exists', () => {
  globalThis.Buffer = undefined
  globalThis.btoa = undefined
  assert.throws(
    () => toBase64UrlString(new Uint8Array([1, 2, 3])),
    /No base64 encoder available/
  )
  restoreGlobals()
})

test('fromBase64UrlString uses atob fallback when Buffer is missing', () => {
  globalThis.Buffer = undefined
  globalThis.atob = (base64) =>
    NodeBuffer.from(base64, 'base64').toString('binary')
  const decoded = fromBase64UrlString('aGVsbG8')
  assert.deepStrictEqual([...decoded], [104, 101, 108, 108, 111])
  restoreGlobals()
})

test('fromBase64UrlString throws when no base64 decoder exists', () => {
  globalThis.Buffer = undefined
  globalThis.atob = undefined
  assert.throws(() => fromBase64UrlString('aGVsbG8'), /No base64 decoder/)
  restoreGlobals()
})

test('base58 helpers do not depend on Buffer or browser base64 globals', () => {
  globalThis.Buffer = undefined
  globalThis.btoa = undefined
  globalThis.atob = undefined

  const encoded = toBase58String(new Uint8Array([104, 101, 108, 108, 111]))
  assert.equal(encoded, 'Cn8eVZg')
  assert.deepStrictEqual([...fromBase58String(encoded)], [104, 101, 108, 108, 111])

  const btcEncoded = toBase58BtcString(new Uint8Array([0, 1, 2, 3, 4]))
  assert.equal(btcEncoded, 'z12VfUX')
  assert.deepStrictEqual([...fromBase58BtcString(btcEncoded)], [0, 1, 2, 3, 4])

  restoreGlobals()
})

test('concat formats non-Error throws with String()', () => {
  globalThis.Error = FakeError
  assert.throws(
    () => concat([new Uint8Array([1]), 'bad']),
    /concat failed to normalize input at index 1:/
  )
  globalThis.Error = originalError
})

test('fromJSON handles non-Error throws', () => {
  globalThis.Error = FakeError
  const value = { ok: true }
  value.self = value
  assert.throws(() => fromJSON(value), /fromJSON failed to stringify value:/)
  globalThis.Error = originalError
})

test('toJSON handles non-Error throws', () => {
  globalThis.Error = FakeError
  assert.throws(() => toJSON('{\"ok\":true'), /toJSON failed to parse value:/)
  globalThis.Error = originalError
})

test('toCompressed throws when CompressionStream is missing', async () => {
  setNodeVersion('')
  globalThis.CompressionStream = undefined
  await assert.rejects(
    () => toCompressed(new Uint8Array([1, 2, 3])),
    /gzip compression not available/
  )
  restoreNodeVersion()
  restoreGlobals()
})

test('fromCompressed throws when DecompressionStream is missing', async () => {
  setNodeVersion('')
  globalThis.DecompressionStream = undefined
  await assert.rejects(
    () => fromCompressed(new Uint8Array([1, 2, 3])),
    /gzip decompression not available/
  )
  restoreNodeVersion()
  restoreGlobals()
})

test('toCompressed/fromCompressed use stream path when available', async () => {
  setNodeVersion('')
  globalThis.CompressionStream = PassThroughCompressionStream
  globalThis.DecompressionStream = PassThroughCompressionStream
  globalThis.TextEncoder = originalTextEncoder
  globalThis.TextDecoder = originalTextDecoder

  const input = new Uint8Array([9, 8, 7, 6])
  const compressed = await toCompressed(input)
  const restored = await fromCompressed(compressed)
  assert.deepStrictEqual([...restored], [...input])

  globalThis.TextEncoder = undefined
  globalThis.TextDecoder = undefined
  restoreNodeVersion()
  restoreGlobals()
})
