export function fixture(size) {
  const bytes = Uint8Array.from(
    { length: size },
    (_, index) => 32 + ((index * 17) % 95)
  )
  const shared = new SharedArrayBuffer(size + 8)
  new Uint8Array(shared, 4, size).set(bytes)
  return { bytes, sharedView: new DataView(shared, 4, size) }
}
