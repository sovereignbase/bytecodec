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

import { BASE58BTC_PREFIX } from '../.helpers/index.js'
import type { ByteSource } from '../index.js'
import { toBase58String } from '../toBase58String/index.js'

/**
 * Encodes bytes as a multibase base58btc string with the `z` prefix.
 *
 * @param bytes The bytes to encode.
 * @returns A base58btc multibase string representation of `bytes`.
 */
export function toBase58BtcString(bytes: ByteSource): string {
  return BASE58BTC_PREFIX + toBase58String(bytes)
}
