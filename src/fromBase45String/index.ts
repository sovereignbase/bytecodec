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
import { BASE45_VALUES } from '../.helpers/index.js'

/**
 * Decodes a Base45 string into a new `Uint8Array`.
 *
 * @param base45String The Base45 string to decode.
 * @returns A new `Uint8Array` containing the decoded bytes.
 */
export function fromBase45String(base45String: string): Uint8Array {
  if (typeof base45String !== 'string')
    throw new BytecodecError(
      'BASE45_INPUT_EXPECTED',
      'fromBase45String expects a string input'
    )

  if (base45String.length % 3 === 1)
    throw new BytecodecError(
      'BASE45_INVALID_LENGTH',
      'Base45 string length must not leave a trailing single character'
    )

  const bytes = new Uint8Array(
    Math.floor(base45String.length / 3) * 2 + (base45String.length % 3 === 2 ? 1 : 0)
  )
  let byteOffset = 0

  for (let stringOffset = 0; stringOffset < base45String.length; ) {
    const remaining = base45String.length - stringOffset
    const digit0 = toBase45Digit(base45String, stringOffset)
    const digit1 = toBase45Digit(base45String, stringOffset + 1)

    if (remaining === 2) {
      const value = digit0 + digit1 * 45

      if (value > 0xff)
        throw new BytecodecError(
          'BASE45_INVALID_CHUNK',
          `Invalid base45 chunk at index ${stringOffset}`
        )

      bytes[byteOffset++] = value
      stringOffset += 2
      continue
    }

    const digit2 = toBase45Digit(base45String, stringOffset + 2)
    const value = digit0 + digit1 * 45 + digit2 * 2025

    if (value > 0xffff)
      throw new BytecodecError(
        'BASE45_INVALID_CHUNK',
        `Invalid base45 chunk at index ${stringOffset}`
      )

    bytes[byteOffset++] = value >>> 8
    bytes[byteOffset++] = value & 0xff
    stringOffset += 3
  }

  return bytes
}

function toBase45Digit(base45String: string, stringOffset: number): number {
  const code = base45String.charCodeAt(stringOffset)
  const digit = code < 128 ? BASE45_VALUES[code] : -1

  if (digit === -1)
    throw new BytecodecError(
      'BASE45_INVALID_CHARACTER',
      `Invalid base45 character at index ${stringOffset}`
    )

  return digit
}
