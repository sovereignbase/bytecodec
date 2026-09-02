import { bytesFromBase45String, bytesToBase45String } from './base45/index.js'
import {
  bytesFromBase64String,
  bytesFromBase64UrlString,
  bytesToBase64String,
  bytesToBase64UrlString,
} from './base64/index.js'
import { bytesFromGzipBytes, bytesToGzipBytes } from './gzip/index.js'
import { bytesFromUTF8String, bytesToUTF8String } from './utf8/index.js'
import {
  bytesEqualsBytes,
  concatBytesToUint8Array,
  deriveBytesToUint8Array,
  generateBytesToUint8Array,
  normalizeBytesToUint8Array,
} from './util/index.js'
/**
 * A supported byte input source accepted by the codec helpers.
 */
export type ByteSource =
  ArrayBuffer | SharedArrayBuffer | ArrayBufferView | number[]

export type { BytecodecErrorCode } from './.errors/class.js'

/**
 * Convenience wrapper around the codec functions.
 */
export class Bytes {
  static readonly base45 = {
    encode: bytesToBase45String,
    decode: bytesFromBase45String,
  }

  static readonly base64 = {
    encode: bytesToBase64String,
    decode: bytesFromBase64String,
    url: {
      encode: bytesToBase64UrlString,
      decode: bytesFromBase64UrlString,
    },
  }

  static readonly utf8 = {
    encode: bytesToUTF8String,
    decode: bytesFromUTF8String,
  }

  static readonly gzip = {
    encode: bytesToGzipBytes,
    decode: bytesFromGzipBytes,
  }

  static concat(sources: ByteSource[]): Uint8Array {
    return concatBytesToUint8Array(sources)
  }

  static equals(a: ByteSource, b: ByteSource): boolean {
    return bytesEqualsBytes(a, b)
  }

  static derive(base: Uint8Array, domain: Uint8Array, byteLength: number) {
    return deriveBytesToUint8Array(base, domain, byteLength)
  }

  static generate(byteLength: number) {
    return generateBytesToUint8Array(byteLength)
  }

  static normalize(bytes: ByteSource): Uint8Array {
    return normalizeBytesToUint8Array(bytes)
  }
}
