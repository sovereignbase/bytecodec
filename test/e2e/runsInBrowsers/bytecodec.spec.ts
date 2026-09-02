import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { createServer, type Server } from 'node:http'
import { extname, resolve, sep } from 'node:path'
import type * as Root from '../../../src/index.js'
import type * as Base45 from '../../../src/base45/index.js'
import type * as Base64 from '../../../src/base64/index.js'
import type * as Gzip from '../../../src/gzip/index.js'
import type * as UTF8 from '../../../src/utf8/index.js'
import type * as Util from '../../../src/util/index.js'

const rootDirectory = resolve(process.cwd())
let server: Server
let origin: string

test.beforeAll(async () => {
  server = createServer(async (request, response) => {
    const pathname = new URL(request.url ?? '/', 'http://127.0.0.1').pathname
    if (pathname === '/') {
      response.setHeader('content-type', 'text/html')
      response.end('<!doctype html><title>bytecodec browser test</title>')
      return
    }

    const filePath = resolve(rootDirectory, `.${pathname}`)
    if (!filePath.startsWith(rootDirectory + sep)) {
      response.statusCode = 400
      response.end('Bad request')
      return
    }

    try {
      response.setHeader(
        'content-type',
        extname(filePath) === '.map' ? 'application/json' : 'text/javascript'
      )
      response.end(await readFile(filePath))
    } catch {
      response.statusCode = 404
      response.end('Not found')
    }
  })
  await new Promise<void>((resolveListening, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolveListening)
  })
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('No test port')
  origin = `http://127.0.0.1:${address.port}`
})

test.afterAll(async () => {
  await new Promise<void>((resolveClosed, reject) =>
    server.close((error) => (error ? reject(error) : resolveClosed()))
  )
})

test('loads focused entrypoints and runs every codec in a browser', async ({
  page,
}) => {
  await page.goto(origin)
  const result = await page.evaluate(async () => {
    const rootUrl = '/dist/index.js'
    const base45Url = '/dist/base45/index.js'
    const base64Url = '/dist/base64/index.js'
    const gzipUrl = '/dist/gzip/index.js'
    const utf8Url = '/dist/utf8/index.js'
    const utilUrl = '/dist/util/index.js'
    const [root, base45, base64, gzip, utf8, util] = await Promise.all([
      import(rootUrl) as Promise<typeof Root>,
      import(base45Url) as Promise<typeof Base45>,
      import(base64Url) as Promise<typeof Base64>,
      import(gzipUrl) as Promise<typeof Gzip>,
      import(utf8Url) as Promise<typeof UTF8>,
      import(utilUrl) as Promise<typeof Util>,
    ])

    const text = 'browser ✓ 🚀'
    const bytes = utf8.bytesFromUTF8String(text)
    const compressed = await gzip.bytesToGzipBytes(bytes)
    const restored = await gzip.bytesFromGzipBytes(compressed)
    const derived = await util.deriveBytes(bytes, [1, 2], 16)

    return {
      rootExports: Object.keys(root),
      base45: base45.bytesToBase45String([65, 66]),
      base64: base64.bytesToBase64String(bytes),
      roundTrip: utf8.bytesToUTF8String(restored),
      derivedLength: derived.length,
      wrapper: root.Bytes.utf8.encode(root.Bytes.utf8.decode(text)),
    }
  })

  expect(result).toEqual({
    rootExports: ['Bytes'],
    base45: 'BB8',
    base64: 'YnJvd3NlciDinJMg8J+agA==',
    roundTrip: 'browser ✓ 🚀',
    derivedLength: 16,
    wrapper: 'browser ✓ 🚀',
  })
})
