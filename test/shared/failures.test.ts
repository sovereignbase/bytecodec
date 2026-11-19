import { afterEach, expect, it, vi } from 'vitest'
import { BytecodecError, Bytes } from '../../src/index.js'
import { unknownError } from '../../src/.errors/class.js'
import { isNodeRuntime } from '../../src/.helpers/index.js'

afterEach(() => vi.unstubAllGlobals())

it('preserves structured errors and retains unexpected causes, including raw values', () => {
  const original = new BytecodecError('BYTE_SOURCE_EXPECTED')
  expect(unknownError(original, 'test')).toBe(original)
  for (const cause of [new TypeError('failure'), 'raw failure', null]) {
    const error = unknownError(cause, 'test')
    expect(error).toBeInstanceOf(BytecodecError)
    expect(error).toMatchObject({ code: 'UNKNOWN_ERROR', cause })
    expect(error.message).toContain('test failed.')
  }
})

it('preserves validation errors across the public synchronous operations', () => {
  for (const operation of [
    () => Bytes.base45.encode(null as never),
    () => Bytes.base64.encode(null as never),
    () => Bytes.base64url.encode(null as never),
    () => Bytes.utf8.encode(null as never),
    () => Bytes.equals([], null as never),
  ]) {
    expect(operation).toThrowError(
      expect.objectContaining({ code: 'BYTE_SOURCE_EXPECTED' })
    )
  }
})

it('wraps platform exceptions from Base64URL and random generation', () => {
  const cause = new Error('platform failure')
  vi.stubGlobal('Buffer', {
    from: () => {
      throw cause
    },
  })
  expect(() => Bytes.base64url.encode([])).toThrowError(
    expect.objectContaining({
      code: 'UNKNOWN_ERROR',
      cause,
      message: expect.stringContaining('Bytes.base64.encode()'),
    })
  )
  vi.stubGlobal('crypto', {
    getRandomValues: () => {
      throw cause
    },
  })
  expect(() => Bytes.generate(1)).toThrowError(
    expect.objectContaining({ code: 'UNKNOWN_ERROR', cause })
  )
})

it('wraps invalid derivation and gzip inputs', async () => {
  await expect(Bytes.derive([], [], 9000)).rejects.toMatchObject({
    code: 'UNKNOWN_ERROR',
    cause: expect.any(Error),
  })
  await expect(Bytes.derive(null as never, [], 16)).rejects.toMatchObject({
    code: 'BYTE_SOURCE_EXPECTED',
  })
  await expect(Bytes.gzip.encode(null as never)).rejects.toMatchObject({
    code: 'BYTE_SOURCE_EXPECTED',
  })
  await expect(Bytes.gzip.decode(null as never)).rejects.toMatchObject({
    code: 'BYTE_SOURCE_EXPECTED',
  })
  await expect(Bytes.gzip.decode([1, 2, 3])).rejects.toMatchObject({
    code: 'UNKNOWN_ERROR',
  })
})

it('detects runtimes without process or version markers', () => {
  vi.stubGlobal('process', undefined)
  expect(isNodeRuntime()).toBe(false)
  vi.stubGlobal('process', {})
  expect(isNodeRuntime()).toBe(false)
})
