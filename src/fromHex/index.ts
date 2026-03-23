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
import { HEX_VALUES } from '../.helpers/index.js'

/**
 * Decodes a hexadecimal string into a new `Uint8Array`.
 *
 * @param hex The hexadecimal string to decode.
 * @returns A new `Uint8Array` containing the decoded bytes.
 */
export function fromHex(hex: string): Uint8Array {
  if (typeof hex !== 'string')
    throw new BytecodecError(
      'HEX_INPUT_EXPECTED',
      'fromHex expects a string input'
    )

  if (hex.length % 2 !== 0)
    throw new BytecodecError(
      'HEX_INVALID_LENGTH',
      'Hex string must have an even length'
    )

  const bytes = new Uint8Array(hex.length / 2)

  for (let offset = 0; offset < hex.length; offset += 2) {
    const highCode = hex.charCodeAt(offset)
    const lowCode = hex.charCodeAt(offset + 1)
    const highNibble = highCode < 128 ? HEX_VALUES[highCode] : -1
    const lowNibble = lowCode < 128 ? HEX_VALUES[lowCode] : -1

    if (highNibble === -1 || lowNibble === -1)
      throw new BytecodecError(
        'HEX_INVALID_CHARACTER',
        `Invalid hex character at index ${
          highNibble === -1 ? offset : offset + 1
        }`
      )

    bytes[offset / 2] = (highNibble << 4) | lowNibble
  }

  return bytes
}
