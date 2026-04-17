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

import { BASE58BTC_CHARS } from '../.helpers/index.js'
import type { ByteSource } from '../index.js'
import { toUint8Array } from '../index.js'

/**
 * Encodes bytes as a base58btc-alphabet string without a multibase prefix.
 *
 * @param bytes The bytes to encode.
 * @returns A base58 string representation of `bytes`.
 */
export function toBase58String(bytes: ByteSource): string {
  const view = toUint8Array(bytes)
  if (view.length === 0) return ''

  let zeroCount = 0

  while (zeroCount < view.length && view[zeroCount] === 0) zeroCount++

  const digits: number[] = []

  for (const value of view) {
    let carry = value

    for (let index = 0; index < digits.length; index++) {
      carry += digits[index] << 8
      digits[index] = carry % 58
      carry = Math.floor(carry / 58)
    }

    while (carry > 0) {
      digits.push(carry % 58)
      carry = Math.floor(carry / 58)
    }
  }

  let base58String = '1'.repeat(zeroCount)

  for (let index = digits.length - 1; index >= 0; index--) {
    base58String += BASE58BTC_CHARS[digits[index]]
  }

  return base58String
}
