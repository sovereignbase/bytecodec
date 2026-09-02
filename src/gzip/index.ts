import { BytecodecError } from '../.errors/class.js'
import { importNodeBuiltin, isNodeRuntime } from '../.helpers/index.js'
import { normalizeBytes } from '../util/index.js'
import type { ByteSource } from '../index.js'

/**
 * Compresses bytes using gzip.
 *
 * @param bytes The bytes to compress.
 * @returns A promise that resolves to a new `Uint8Array` containing the gzip payload.
 */
export async function bytesToGzipBytes(bytes: ByteSource): Promise<Uint8Array> {
  const view = normalizeBytes(bytes)

  // Node: use built-in zlib
  if (isNodeRuntime()) {
    const { gzip } =
      await importNodeBuiltin<typeof import('node:zlib')>('node:zlib')
    const { promisify } =
      await importNodeBuiltin<typeof import('node:util')>('node:util')
    const gzipAsync = promisify(gzip)
    const compressed = await gzipAsync(view)
    return normalizeBytes(compressed)
  }

  // Browser/edge runtimes: CompressionStream with gzip
  if (typeof CompressionStream === 'undefined')
    throw new BytecodecError(
      'GZIP_COMPRESSION_UNAVAILABLE',
      'gzip compression not available in this environment.'
    )

  return compressWithStream(view, 'gzip')
}

/**
 * Compresses bytes with `CompressionStream` in runtimes that expose the web compression APIs.
 *
 * @param bytes The bytes to compress.
 * @param format The compression format to use.
 * @returns A promise that resolves to the compressed bytes.
 */
async function compressWithStream(
  bytes: Uint8Array,
  format: CompressionFormat
) {
  const compressedStream = new Blob([bytes as BufferSource])
    .stream()
    .pipeThrough(new CompressionStream(format))
  const arrayBuffer = await new Response(compressedStream).arrayBuffer()
  return new Uint8Array(arrayBuffer)
}

/**
 * Decompresses gzip-compressed bytes.
 *
 * @param bytes The gzip-compressed bytes to decompress.
 * @returns A promise that resolves to a new `Uint8Array` containing the decompressed bytes.
 */
export async function bytesFromGzipBytes(
  bytes: ByteSource
): Promise<Uint8Array> {
  const view = normalizeBytes(bytes)

  if (isNodeRuntime()) {
    const { gunzip } =
      await importNodeBuiltin<typeof import('node:zlib')>('node:zlib')
    const { promisify } =
      await importNodeBuiltin<typeof import('node:util')>('node:util')
    const gunzipAsync = promisify(gunzip)
    const decompressed = await gunzipAsync(view)
    return normalizeBytes(decompressed)
  }

  if (typeof DecompressionStream === 'undefined')
    throw new BytecodecError(
      'GZIP_DECOMPRESSION_UNAVAILABLE',
      'gzip decompression not available in this environment.'
    )

  return decompressWithStream(view, 'gzip')
}

/**
 * Decompresses bytes with `DecompressionStream` in runtimes that expose the web compression APIs.
 *
 * @param bytes The bytes to decompress.
 * @param format The compression format to use.
 * @returns A promise that resolves to the decompressed bytes.
 */
async function decompressWithStream(
  bytes: Uint8Array,
  format: CompressionFormat
) {
  const decompressedStream = new Blob([bytes as BufferSource])
    .stream()
    .pipeThrough(new DecompressionStream(format))
  const arrayBuffer = await new Response(decompressedStream).arrayBuffer()
  return new Uint8Array(arrayBuffer)
}
