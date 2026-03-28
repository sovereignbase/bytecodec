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
import { toUint8Array } from '../toUint8Array/index.js'

/**
 * Encodes an unsigned `bigint` into a minimal big-endian `Uint8Array`.
 *
 * `0n` is encoded as an empty byte array because no width is implied.
 *
 * @param value The unsigned bigint to encode.
 * @returns A new `Uint8Array` containing the encoded bytes.
 */
export function fromBigInt(value: bigint): Uint8Array {
  if (typeof value !== 'bigint')
    throw new BytecodecError(
      'BIGINT_INPUT_EXPECTED',
      'fromBigInt expects a bigint input'
    )

  if (value < 0n)
    throw new BytecodecError(
      'BIGINT_UNSIGNED_EXPECTED',
      'fromBigInt expects an unsigned bigint'
    )

  if (value === 0n) return new Uint8Array()

  const bytes: number[] = []

  while (value > 0n) {
    bytes.push(Number(value & 0xffn))
    value >>= 8n
  }

  bytes.reverse()
  return toUint8Array(bytes)
}
