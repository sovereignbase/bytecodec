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
import { fromBase64String } from './fromBase64String/index.js'
import { toBase64String } from './toBase64String/index.js'
/***/
import { fromBase64UrlString } from './fromBase64UrlString/index.js'
import { toBase64UrlString } from './toBase64UrlString/index.js'
/***/
import { fromString } from './fromString/index.js'
import { toString } from './toString/index.js'
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

export type ByteSource = Uint8Array | ArrayBuffer | ArrayBufferView | number[]

export {
  /***/
  fromBase64String,
  toBase64String,
  /***/
  fromBase64UrlString,
  toBase64UrlString,
  /***/
  fromString,
  toString,
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
  /***/
  static fromBase64String(base64String: string): Uint8Array {
    return fromBase64String(base64String)
  }
  static toBase64String(bytes: ByteSource): string {
    return toBase64String(bytes)
  }
  /***/
  /***/
  static fromBase64UrlString(base64UrlString: Base64URLString): Uint8Array {
    return fromBase64UrlString(base64UrlString)
  }

  static toBase64UrlString(bytes: ByteSource): Base64URLString {
    return toBase64UrlString(bytes)
  }
  /***/
  static fromString(text: string): Uint8Array {
    return fromString(text)
  }

  static toString(bytes: ByteSource): string {
    return toString(bytes)
  }
  /***/
  static toJSON(bytes: ByteSource | string): any {
    return toJSON(bytes)
  }

  static fromJSON(value: any): Uint8Array {
    return fromJSON(value)
  }
  /***/
  static toCompressed(bytes: ByteSource): Promise<Uint8Array> {
    return toCompressed(bytes)
  }

  static fromCompressed(bytes: ByteSource): Promise<Uint8Array> {
    return fromCompressed(bytes)
  }
  /***/
  static toBufferSource(bytes: ByteSource): BufferSource {
    return toBufferSource(bytes)
  }

  static toArrayBuffer(bytes: ByteSource): ArrayBuffer {
    return toArrayBuffer(bytes)
  }

  static toUint8Array(bytes: ByteSource): Uint8Array {
    return toUint8Array(bytes)
  }
  /***/
  static concat(sources: ByteSource[]): Uint8Array {
    return concat(sources)
  }

  static equals(a: ByteSource, b: ByteSource): boolean {
    return equals(a, b)
  }
  /***/
}
