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

import { BytecodecError } from '../.errors/class.js'
import { Z85_VALUES } from '../.helpers/index.js'

/**
 * Decodes a Z85 string into a new `Uint8Array`.
 *
 * @param z85String The Z85 string to decode.
 * @returns A new `Uint8Array` containing the decoded bytes.
 */
export function fromZ85String(z85String: string): Uint8Array {
  if (typeof z85String !== 'string')
    throw new BytecodecError(
      'Z85_INPUT_EXPECTED',
      'fromZ85String expects a string input'
    )

  if (z85String.length % 5 !== 0)
    throw new BytecodecError(
      'Z85_INVALID_LENGTH',
      'Z85 string length must be divisible by 5'
    )

  const bytes = new Uint8Array((z85String.length / 5) * 4)
  let byteOffset = 0

  for (let blockOffset = 0; blockOffset < z85String.length; blockOffset += 5) {
    let value = 0

    for (let digitOffset = 0; digitOffset < 5; digitOffset++) {
      const stringOffset = blockOffset + digitOffset
      const code = z85String.charCodeAt(stringOffset)
      const digit = code < 128 ? Z85_VALUES[code] : -1

      if (digit === -1)
        throw new BytecodecError(
          'Z85_INVALID_CHARACTER',
          `Invalid Z85 character at index ${stringOffset}`
        )

      value = value * 85 + digit
    }

    if (value > 0xffffffff)
      throw new BytecodecError(
        'Z85_INVALID_BLOCK',
        `Invalid Z85 block at index ${blockOffset}`
      )

    bytes[byteOffset++] = value >>> 24
    bytes[byteOffset++] = (value >>> 16) & 0xff
    bytes[byteOffset++] = (value >>> 8) & 0xff
    bytes[byteOffset++] = value & 0xff
  }

  return bytes
}
