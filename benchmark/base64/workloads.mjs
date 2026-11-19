import { Bytes } from '../../dist/index.js'
export function workloads({ bytes }) {
  return ['base64', 'base64url'].flatMap((name) => {
    const encoded = Bytes[name].encode(bytes)
    return [
      {
        operation: name + ' encode',
        run: () => Bytes[name].encode(bytes),
        expected: encoded,
      },
      {
        operation: name + ' decode',
        run: () => Bytes[name].decode(encoded),
        expected: bytes,
      },
    ]
  })
}
