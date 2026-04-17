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
import { BASE58BTC_PREFIX } from '../.helpers/index.js'
import { fromBase58String } from '../fromBase58String/index.js'

/**
 * Decodes a multibase base58btc string with the `z` prefix.
 *
 * @param base58BtcString The base58btc string to decode.
 * @returns A new `Uint8Array` containing the decoded bytes.
 */
export function fromBase58BtcString(base58BtcString: string): Uint8Array {
  if (typeof base58BtcString !== 'string')
    throw new BytecodecError(
      'BASE58BTC_INPUT_EXPECTED',
      'fromBase58BtcString expects a string input'
    )

  if (!base58BtcString.startsWith(BASE58BTC_PREFIX))
    throw new BytecodecError(
      'BASE58BTC_INVALID_PREFIX',
      'base58btc string must start with the multibase prefix "z"'
    )

  return fromBase58String(base58BtcString.slice(1))
}
