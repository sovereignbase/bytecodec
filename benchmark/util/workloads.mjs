import { Bytes } from '../../dist/index.js'
export async function workloads({ bytes, sharedView }) {
  const different = bytes.slice()
  different[different.length - 1] ^= 1
  const joined = new Uint8Array(bytes.length * 3)
  for (let i = 0; i < 3; i++) joined.set(bytes, i * bytes.length)
  const derived = await Bytes.derive(bytes, [1, 2], 32)
  return [
    {
      operation: 'normalize view',
      run: () => Bytes.normalize(sharedView),
      expected: bytes,
    },
    {
      operation: 'concat three',
      run: () => Bytes.concat([bytes, bytes, bytes]),
      expected: joined,
    },
    {
      operation: 'equals same',
      run: () => Bytes.equals(bytes, bytes),
      expected: true,
    },
    {
      operation: 'equals different',
      run: () => Bytes.equals(bytes, different),
      expected: false,
    },
    {
      operation: 'generate',
      run: () => Bytes.generate(bytes.length),
      verify: (result) =>
        result.length === bytes.length && result.buffer instanceof ArrayBuffer,
    },
    {
      operation: 'derive 32 bytes',
      async: true,
      run: () => Bytes.derive(bytes, [1, 2], 32),
      expected: derived,
    },
  ]
}
