import client from 'request-promise'

import RestError from '../error/rest-error'
import { POST } from '../commands/post'
import { DELETE } from '../commands/delete'
import { GET } from '../commands/get'

async function performRequest(method, request) {
  try {
    const response = await client({
      method,
      uri: request.path,
      headers: request.headers,
      form: request.bodyUrlencoded,
      body: request.bodyJson,
      qs: request.query,
      json: true,
      resolveWithFullResponse: true,
    })

    return {
      body: response.body,
      status: response.statusCode,
      headers: response.headers,
    }
  } catch (e) {
    throw new RestError(e)
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
