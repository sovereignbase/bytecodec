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
import { fromBase64String } from '../fromBase64String/index.js'

/**
 * Decodes a base64url-encoded string into a new `Uint8Array`.
 *
 * @param base64UrlString The base64url string to decode.
 * @returns A new `Uint8Array` containing the decoded bytes.
 */
export function fromBase64UrlString(
  base64UrlString: Base64URLString
): Uint8Array {
  const base64String = toBase64String(base64UrlString)
  return fromBase64String(base64String)
}

/**
 * Converts a base64url string into a padded base64 string.
 *
 * @param base64UrlString The base64url string to normalize.
 * @returns A padded base64 string.
 */
function toBase64String(base64UrlString: Base64URLString): string {
  let base64String = base64UrlString.replace(/-/g, '+').replace(/_/g, '/')
  const mod = base64String.length & 3
  if (mod === 2) base64String += '=='
  else if (mod === 3) base64String += '='
  else if (mod !== 0)
    throw new BytecodecError(
      'BASE64URL_INVALID_LENGTH',
      'Invalid base64url length'
    )
  return base64String
}
