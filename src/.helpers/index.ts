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
