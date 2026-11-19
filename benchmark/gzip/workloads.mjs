import { Bytes } from '../../dist/index.js'
export async function workloads({ bytes }) {
  const compressed = await Bytes.gzip.encode(bytes)
  return [
    {
      operation: 'compress',
      async: true,
      run: () => Bytes.gzip.encode(bytes),
      verify: async (result) =>
        Bytes.equals(await Bytes.gzip.decode(result), bytes),
    },
    {
      operation: 'decompress',
      async: true,
      run: () => Bytes.gzip.decode(compressed),
      expected: bytes,
    },
  ]
}
