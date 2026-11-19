import * as root from '../../../dist/index.js'
import * as base45 from '../../../dist/base45/index.js'
import * as base64 from '../../../dist/base64/index.js'
import * as gzip from '../../../dist/gzip/index.js'
import * as utf8 from '../../../dist/utf8/index.js'
import * as util from '../../../dist/util/index.js'
import { runBytecodecSuite } from '../shared/suite.mjs'

export default {
  async fetch(request) {
    if (new URL(request.url).pathname !== '/') {
      return new Response('Not found', { status: 404 })
    }

    const results = await runBytecodecSuite(
      { root, base45, base64, gzip, utf8, util },
      { label: 'cloudflare-workers esm' }
    )
    return Response.json(results, { status: results.ok ? 200 : 500 })
  },
}
