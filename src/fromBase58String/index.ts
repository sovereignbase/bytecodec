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
import { BASE58BTC_VALUES } from '../.helpers/index.js'

/**
 * Decodes a base58btc-alphabet string without a multibase prefix.
 *
 * @param base58String The base58 string to decode.
 * @returns A new `Uint8Array` containing the decoded bytes.
 */
export function fromBase58String(base58String: string): Uint8Array {
  if (typeof base58String !== 'string')
    throw new BytecodecError(
      'BASE58_INPUT_EXPECTED',
      'fromBase58String expects a string input'
    )

  if (base58String.length === 0) return new Uint8Array(0)

  let zeroCount = 0

  while (
    zeroCount < base58String.length &&
    base58String.charCodeAt(zeroCount) === 49
  )
    zeroCount++

  const bytes: number[] = []

  for (let stringOffset = 0; stringOffset < base58String.length; stringOffset++) {
    const code = base58String.charCodeAt(stringOffset)
    const digit = code < 128 ? BASE58BTC_VALUES[code] : -1

    if (digit === -1)
      throw new BytecodecError(
        'BASE58_INVALID_CHARACTER',
        `Invalid base58 character at index ${stringOffset}`
      )

    let carry = digit

    for (let byteOffset = 0; byteOffset < bytes.length; byteOffset++) {
      carry += bytes[byteOffset] * 58
      bytes[byteOffset] = carry & 0xff
      carry >>= 8
    }

    while (carry > 0) {
      bytes.push(carry & 0xff)
      carry >>= 8
    }
  }

  const decoded = new Uint8Array(zeroCount + bytes.length)

  for (let index = 0; index < bytes.length; index++) {
    decoded[decoded.length - 1 - index] = bytes[index]
  }

  return decoded
}
