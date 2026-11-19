import { Bytes } from '../../dist/index.js'
export function workloads({ bytes }) {
  const encoded = Bytes.base45.encode(bytes)
  return [
    {
      operation: 'encode',
      run: () => Bytes.base45.encode(bytes),
      expected: encoded,
    },
    {
      operation: 'decode',
      run: () => Bytes.base45.decode(encoded),
      expected: bytes,
    },
  ]
}
