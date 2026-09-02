/**
 * Returns `true` when the current runtime exposes a Node.js version marker.
 *
 * @returns Whether the current runtime appears to be Node.js.
 */
export function isNodeRuntime(): boolean {
  return typeof process !== 'undefined' && !!process.versions?.node
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
  return import(specifier) as Promise<T>
}
