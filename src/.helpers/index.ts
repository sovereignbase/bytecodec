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

export const textEncoder =
  typeof TextEncoder !== 'undefined' ? new TextEncoder() : null

export const textDecoder =
  typeof TextDecoder !== 'undefined' ? new TextDecoder() : null

/**
 * Returns `true` when the current runtime exposes a Node.js version marker.
 *
 * @returns Whether the current runtime appears to be Node.js.
 */
export function isNodeRuntime(): boolean {
  return typeof process !== 'undefined' && !!process.versions?.node
}

/**
 * Determines whether an `ArrayBufferLike` value is backed by `SharedArrayBuffer`.
 *
 * @param buffer The buffer to test.
 * @returns `true` if `buffer` is a `SharedArrayBuffer`; otherwise, `false`.
 */
export function isSharedArrayBuffer(
  buffer: ArrayBufferLike
): buffer is SharedArrayBuffer {
  return (
    typeof SharedArrayBuffer !== 'undefined' &&
    buffer instanceof SharedArrayBuffer
  )
}

/**
 * Dynamically imports a Node.js built-in module without exposing a static `node:` dependency to neutral bundles.
 *
 * @param specifier The built-in module specifier to import.
 * @returns A promise that resolves to the imported module namespace.
 */
export async function importNodeBuiltin<T = unknown>(
  specifier: string
): Promise<T> {
  // Keep neutral bundles from rewriting node: specifiers for non-Node runtimes.
  const importer = new Function('specifier', 'return import(specifier)') as (
    value: string
  ) => Promise<T>
  return importer(specifier)
}

export const HEX_PAIRS = Array.from({ length: 256 }, (_, value) =>
  value.toString(16).padStart(2, '0')
)

export const HEX_VALUES = (() => {
  const table = new Int16Array(128).fill(-1)

  for (let index = 0; index < 10; index++)
    table['0'.charCodeAt(0) + index] = index

  for (let index = 0; index < 6; index++) {
    table['A'.charCodeAt(0) + index] = index + 10
    table['a'.charCodeAt(0) + index] = index + 10
  }

  return table
})()

export const BASE45_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:'

export const BASE45_VALUES = (() => {
  const table = new Int16Array(128).fill(-1)

  for (let i = 0; i < BASE45_CHARS.length; i++) {
    table[BASE45_CHARS.charCodeAt(i)] = i
  }

  return table
})()

export const Z85_CHARS =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#'

export const Z85_VALUES = (() => {
  const table = new Int16Array(128).fill(-1)

  for (let i = 0; i < Z85_CHARS.length; i++) {
    table[Z85_CHARS.charCodeAt(i)] = i
  }

  return table
})()

export const BASE58BTC_PREFIX = 'z'

export const BASE58BTC_CHARS =
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

export const BASE58BTC_VALUES = (() => {
  const table = new Int16Array(128).fill(-1)

  for (let i = 0; i < BASE58BTC_CHARS.length; i++) {
    table[BASE58BTC_CHARS.charCodeAt(i)] = i
  }

  return table
})()
