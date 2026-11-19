import { Bytes } from '../../dist/index.js'
export function workloads({ bytes }) {
  const text = Bytes.utf8.encode(bytes)
  return [
    {
      operation: 'encode (bytes → string)',
      run: () => Bytes.utf8.encode(bytes),
      expected: text,
    },
    {
      operation: 'decode (string → bytes)',
      run: () => Bytes.utf8.decode(text),
      expected: bytes,
    },
  ]
}
