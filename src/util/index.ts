import { BytecodecError } from '../.errors/class.js'
import type { ByteSource } from '../index.js'

/**
 * Concatenates multiple byte sources into a single `Uint8Array`.
 *
 * @param sources The byte sources to concatenate, in order.
 * @returns A new `Uint8Array` containing the concatenated bytes.
 */
export function concatBytes(sources: ByteSource[]): Uint8Array {
  if (!Array.isArray(sources))
    throw new BytecodecError(
      'CONCAT_INVALID_INPUT',
      'concatBytes expects an array of ByteSource items'
    )

  if (sources.length === 0) return new Uint8Array(0)

  const arrays = sources.map((source, index) => {
    try {
      return normalizeBytes(source)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new BytecodecError(
        'CONCAT_NORMALIZE_FAILED',
        `concatBytes failed to normalize input at index ${index}: ${message}`
      )
    }
  })

  const totalLength = arrays.reduce((sum, array) => sum + array.length, 0)
  const result = new Uint8Array(totalLength)

  let offset = 0
  for (const array of arrays) {
    if (array.length === 0) continue
    result.set(array, offset)
    offset += array.length
  }

  return result
}

/**
 * Compares two byte sources for byte-for-byte equality.
 *
 * @param x The first byte source to compare.
 * @param y The second byte source to compare.
 * @returns `true` if both byte sources contain the same bytes; otherwise, `false`.
 */
export function equalBytes(x: ByteSource, y: ByteSource): boolean {
  const a = normalizeBytes(x)
  const b = normalizeBytes(y)
  if (a.byteLength !== b.byteLength) return false
  let diff = 0
  for (let index = 0; index < a.length; index++) diff |= a[index] ^ b[index]
  return diff === 0
}

/**
 * Normalizes a supported byte source into a new `Uint8Array`.
 *
 * @param input The byte source to normalize.
 * @returns A new `Uint8Array` copy of `input`.
 */
export function normalizeBytes(input: ByteSource): Uint8Array {
  if (input instanceof ArrayBuffer) {
    return new Uint8Array(input.slice(0))
  }

  if (
    typeof SharedArrayBuffer !== 'undefined' &&
    input instanceof SharedArrayBuffer
  ) {
    return new Uint8Array(input).slice()
  }

  if (ArrayBuffer.isView(input)) {
    const view = new Uint8Array(
      input.buffer,
      input.byteOffset,
      input.byteLength
    )
    return new Uint8Array(view)
  }

  if (Array.isArray(input)) {
    return new Uint8Array(input)
  }

  throw new BytecodecError(
    'BYTE_SOURCE_EXPECTED',
    'Expected a Uint8Array, ArrayBuffer, SharedArrayBuffer, ArrayBufferView, or number[]'
  )
}

let ikm: CryptoKey
/**
 * Derives deterministic, domain-separated bytes with HKDF-SHA-256.
 *
 * The same `base`, `domain`, and `byteLength` always produce the same bytes.
 * Use a distinct domain for each purpose so one base value can safely feed
 * independent derivation contexts. The inputs are not modified.
 *
 * @param base - Salt that namespaces the derivation under a base value.
 * @param domain - HKDF context information identifying the derived value's use.
 * @param byteLength - Number of output bytes to derive.
 * @returns A promise that resolves to exactly `byteLength` derived bytes.
 * @throws A `DOMException` when Web Crypto rejects an unsupported or invalid
 * derivation request, including an invalid output length.
 *
 * @example Derive a 32-byte key for one application domain.
 * ```ts
 * const encoder = new TextEncoder()
 * const bytes = await deriveBytes(
 *   encoder.encode('account-1'),
 *   encoder.encode('profile-encryption'),
 *   32
 * )
 * ```
 */
export async function deriveBytes(
  base: ByteSource,
  domain: ByteSource,
  byteLength: number
): Promise<Uint8Array> {
  if (!ikm)
    ikm = await crypto.subtle.importKey(
      'raw',
      new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
      'HKDF',
      false,
      ['deriveBits']
    )

  return normalizeBytes(
    await crypto.subtle.deriveBits(
      {
        name: 'HKDF',
        hash: 'SHA-256',
        salt: normalizeBytes(base) as BufferSource,
        info: normalizeBytes(domain) as BufferSource,
      },
      ikm,
      byteLength * 8
    )
  )
}

export function generateBytes(byteLength: number): Uint8Array {
  const buffer = new Uint8Array(byteLength)
  void crypto.getRandomValues(buffer)
  return buffer
}
