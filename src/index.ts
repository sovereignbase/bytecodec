import {} from './base45/index.js'
import {} from './base64/index.js'
import {} from './gzip/index.js'
import {} from './utf8/index.js'
import {} from './util/index.js'
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
    encode: toBase45String,
    decode: fromBase45String,
  }

  static readonly base64 = {
    encode: toBase64String,
    decode: fromBase64String,
    url: {
      encode: toBase64UrlString,
      decode: fromBase64UrlString,
    },
  }

  static readonly utf8 = {
    encode: toString,
    decode: fromString,
  }

  static readonly gzip = {
    encode: toCompressed,
    decode: fromCompressed,
  }

  /**
   * See {@link concat}.
   */
  static concat(sources: ByteSource[]): Uint8Array {
    return concat(sources)
  }

  /**
   * See {@link equals}.
   */
  static equals(a: ByteSource, b: ByteSource): boolean {
    return equals(a, b)
  }

  static derive(base: Uint8Array, domain: Uint8Array, byteLength: number) {
    return derive(base, domain, byteLength)
  }

  static generate(byteLength: number) {
    return generate(byteLength)
  }

  /**
   * See {@link toUint8Array}.
   */
  static normalize(bytes: ByteSource): Uint8Array {
    return toUint8Array(bytes)
  }
}
