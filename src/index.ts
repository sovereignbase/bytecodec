/*
 * Copyright 2026 Sovereignbase
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/***/
import { fromBase58String } from './fromBase58String/index.js'
import { toBase58String } from './toBase58String/index.js'
/***/
import { fromBase58BtcString } from './fromBase58BtcString/index.js'
import { toBase58BtcString } from './toBase58BtcString/index.js'
/***/
import { fromBase64String } from './fromBase64String/index.js'
import { toBase64String } from './toBase64String/index.js'
/***/
import { fromBase64UrlString } from './fromBase64UrlString/index.js'
import { toBase64UrlString } from './toBase64UrlString/index.js'
/***/
import { fromHex } from './fromHex/index.js'
import { toHex } from './toHex/index.js'
/***/
import { fromZ85String } from './fromZ85String/index.js'
import { toZ85String } from './toZ85String/index.js'
/***/
import { fromString } from './fromString/index.js'
import { toString } from './toString/index.js'
/***/
import { fromBigInt } from './fromBigInt/index.js'
import { toBigInt } from './toBigInt/index.js'
/***/
import { fromJSON } from './fromJSON/index.js'
import { toJSON } from './toJSON/index.js'
/***/
import { toCompressed } from './toCompressed/index.js'
import { fromCompressed } from './fromCompressed/index.js'
/***/
import { toBufferSource } from './toBufferSource/index.js'
import { toArrayBuffer } from './toArrayBuffer/index.js'
import { toUint8Array } from './toUint8Array/index.js'
/***/
import { concat } from './concat/index.js'
import { equals } from './equals/index.js'
/***/

/**
 * A supported byte input source accepted by the codec helpers.
 */
export type ByteSource =
  | ArrayBuffer
  | SharedArrayBuffer
  | ArrayBufferView
  | number[]

export type { BytecodecErrorCode } from './.errors/class.js'

export {
  /***/
  fromBase58String,
  toBase58String,
  /***/
  fromBase58BtcString,
  toBase58BtcString,
  /***/
  fromBase64String,
  toBase64String,
  /***/
  fromBase64UrlString,
  toBase64UrlString,
  /***/
  fromHex,
  toHex,
  /***/
  fromZ85String,
  toZ85String,
  /***/
  fromString,
  toString,
  /***/
  fromBigInt,
  toBigInt,
  /***/
  fromJSON,
  toJSON,
  /***/
  toCompressed,
  fromCompressed,
  /***/
  toBufferSource,
  toArrayBuffer,
  toUint8Array,
  /***/
  concat,
  equals,
}

/**
 * Convenience wrapper around the codec functions.
 */
export class Bytes {
  /**
   * See {@link fromBase58String}.
   */
  static fromBase58String(base58String: string): Uint8Array {
    return fromBase58String(base58String)
  }

  /**
   * See {@link toBase58String}.
   */
  static toBase58String(bytes: ByteSource): string {
    return toBase58String(bytes)
  }

  /**
   * See {@link fromBase58BtcString}.
   */
  static fromBase58BtcString(base58BtcString: string): Uint8Array {
    return fromBase58BtcString(base58BtcString)
  }

  /**
   * See {@link toBase58BtcString}.
   */
  static toBase58BtcString(bytes: ByteSource): string {
    return toBase58BtcString(bytes)
  }

  /**
   * See {@link fromBase64String}.
   */
  static fromBase64String(base64String: string): Uint8Array {
    return fromBase64String(base64String)
  }

  /**
   * See {@link toBase64String}.
   */
  static toBase64String(bytes: ByteSource): string {
    return toBase64String(bytes)
  }

  /**
   * See {@link fromBase64UrlString}.
   */
  static fromBase64UrlString(base64UrlString: Base64URLString): Uint8Array {
    return fromBase64UrlString(base64UrlString)
  }

  /**
   * See {@link toBase64UrlString}.
   */
  static toBase64UrlString(bytes: ByteSource): Base64URLString {
    return toBase64UrlString(bytes)
  }

  /**
   * See {@link fromHex}.
   */
  static fromHex(hex: string): Uint8Array {
    return fromHex(hex)
  }

  /**
   * See {@link toHex}.
   */
  static toHex(bytes: ByteSource): string {
    return toHex(bytes)
  }

  /**
   * See {@link fromZ85String}.
   */
  static fromZ85String(z85String: string): Uint8Array {
    return fromZ85String(z85String)
  }

  /**
   * See {@link toZ85String}.
   */
  static toZ85String(bytes: ByteSource): string {
    return toZ85String(bytes)
  }

  /**
   * See {@link fromString}.
   */
  static fromString(text: string): Uint8Array {
    return fromString(text)
  }

  /**
   * See {@link toString}.
   */
  static toString(bytes: ByteSource): string {
    return toString(bytes)
  }

  /**
   * See {@link fromBigInt}.
   */
  static fromBigInt(value: bigint): Uint8Array {
    return fromBigInt(value)
  }

  /**
   * See {@link toBigInt}.
   */
  static toBigInt(bytes: ByteSource): bigint {
    return toBigInt(bytes)
  }

  /**
   * See {@link toJSON}.
   */
  static toJSON(bytes: ByteSource | string): any {
    return toJSON(bytes)
  }

  /**
   * See {@link fromJSON}.
   */
  static fromJSON(value: any): Uint8Array {
    return fromJSON(value)
  }

  /**
   * See {@link toCompressed}.
   */
  static toCompressed(bytes: ByteSource): Promise<Uint8Array> {
    return toCompressed(bytes)
  }

  /**
   * See {@link fromCompressed}.
   */
  static fromCompressed(bytes: ByteSource): Promise<Uint8Array> {
    return fromCompressed(bytes)
  }

  /**
   * See {@link toBufferSource}.
   */
  static toBufferSource(bytes: ByteSource): BufferSource {
    return toBufferSource(bytes)
  }

  /**
   * See {@link toArrayBuffer}.
   */
  static toArrayBuffer(bytes: ByteSource): ArrayBuffer {
    return toArrayBuffer(bytes)
  }

  /**
   * See {@link toUint8Array}.
   */
  static toUint8Array(bytes: ByteSource): Uint8Array {
    return toUint8Array(bytes)
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
}
