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

import type { ByteSource } from '../index.js'
import { toUint8Array } from '../index.js'

/**
 * Compares two byte sources for byte-for-byte equality.
 *
 * @param x The first byte source to compare.
 * @param y The second byte source to compare.
 * @returns `true` if both byte sources contain the same bytes; otherwise, `false`.
 */
export function equals(x: ByteSource, y: ByteSource): boolean {
  const a = toUint8Array(x)
  const b = toUint8Array(y)
  if (a.byteLength !== b.byteLength) return false
  let diff = 0
  for (let index = 0; index < a.length; index++) diff |= a[index] ^ b[index]
  return diff === 0
}
