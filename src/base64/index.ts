import { BytecodecError } from '../.errors/class.js'
import { normalizeBytes } from '../util/index.js'
import type { ByteSource } from '../index.js'

/**
 * Encodes bytes as a base64 string.
 *
 * @param bytes The bytes to encode.
 * @returns A base64 string representation of `bytes`.
 */
export function bytesToBase64String(bytes: ByteSource): string {
  const view = normalizeBytes(bytes)
  if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function')
    return Buffer.from(view).toString('base64')

  let binaryString = ''
  const chunkSize = 0x8000
  for (let offset = 0; offset < view.length; offset += chunkSize) {
    const end = Math.min(offset + chunkSize, view.length)
    let chunkString = ''
    for (let index = offset; index < end; index++) {
      chunkString += String.fromCharCode(view[index])
    }
    binaryString += chunkString
  }
  if (typeof btoa !== 'function')
    throw new BytecodecError(
      'BASE64_ENCODER_UNAVAILABLE',
      'No base64 encoder available in this environment.'
    )
  return btoa(binaryString)
}

/**
 * Decodes a base64-encoded string into a new `Uint8Array`.
 *
 * @param base64String The base64 string to decode.
 * @returns A new `Uint8Array` containing the decoded bytes.
 */
export function bytesFromBase64String(base64String: string): Uint8Array {
  if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function')
    return new Uint8Array(Buffer.from(base64String, 'base64'))

  if (typeof atob !== 'function')
    throw new BytecodecError(
      'BASE64_DECODER_UNAVAILABLE',
      'No base64 decoder available in this environment.'
    )

  const binaryString = atob(base64String)
  const bytes = new Uint8Array(binaryString.length)
  for (let index = 0; index < binaryString.length; index++)
    bytes[index] = binaryString.charCodeAt(index)
  return bytes
}

/**
 * Decodes a base64url-encoded string into a new `Uint8Array`.
 *
 * @param base64UrlString The base64url string to decode.
 * @returns A new `Uint8Array` containing the decoded bytes.
 */
export function bytesFromBase64UrlString(
  base64UrlString: Base64URLString
): Uint8Array {
  const base64String = base64UrlbytesToBase64String(base64UrlString)
  return bytesFromBase64String(base64String)
}

/**
 * Encodes bytes as a base64url string without trailing padding.
 *
 * @param bytes The bytes to encode.
 * @returns A base64url string representation of `bytes`.
 */
export function bytesToBase64UrlString(bytes: ByteSource): Base64URLString {
  const base64 = bytesToBase64String(bytes)
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

/**
 * Converts a base64url string into a padded base64 string.
 *
 * @param base64UrlString The base64url string to normalize.
 * @returns A padded base64 string.
 */
function base64UrlbytesToBase64String(
  base64UrlString: Base64URLString
): string {
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
