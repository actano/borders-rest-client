import client from 'request-promise'

import RestError from '../error/rest-error'
import RestStatusError from '../error/rest-status-error'
import { POST } from '../commands/post'
import { DELETE } from '../commands/delete'
import { GET } from '../commands/get'

async function performRequest(method, request) {
  console.log("performRequest")
  const json = !request.binary
  if (request.binary) throw new Error('ERROR in performRequest')
  // if (request.binary) throw 'ERROR in performRequest'
  try {
    console.log('before client')
    const response = await client({
      method,
      uri: request.path,
      headers: request.headers,
      form: request.bodyUrlencoded,
      body: request.bodyJson,
      qs: request.query,
      json,
      resolveWithFullResponse: true,
    })
    console.log('after await client')

    return {
      body: response.body,
      status: response.statusCode,
      headers: response.headers,
    }
  } catch (e) {
    if (e.statusCode) {
      throw new RestStatusError(e, e.statusCode, e.response)
    }
    throw new RestError(e, `Error performing request ${request.path}`)
  }
}

export default () => {
  const backend = {
    async [GET]({ request }) {
      return performRequest('GET', request)
    },
    async [POST]({ request }) {
      return performRequest('POST', request)
    },
    async [DELETE]({ request }) {
      return performRequest('DELETE', request)
    },
  }

  return backend
}
