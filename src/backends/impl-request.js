import client from 'request-promise'

import RestError from '../error/rest-error'
import RestStatusError from '../error/rest-status-error'
import { GET } from '../commands/get'
import { POST } from '../commands/post'
import { DELETE } from '../commands/delete'
import { PUT } from '../commands/put'
import { PATCH } from '../commands/patch'

async function performRequest(method, request) {
  try {
    const req = {
      method,
      uri: request.path,
      headers: request.headers,
      form: request.bodyUrlencoded,
      qs: request.query,
      resolveWithFullResponse: true,
    }
    if (request.binaryResponse) {
      req.encoding = null
      req.json = false
      req.body = JSON.stringify(request.bodyJson)
      req.headers = {
        ...req.headers,
        'Content-type': 'application/json; charset=utf-8',
      }
    } else {
      req.json = true
      req.body = request.bodyJson
    }
    const response = await client(req)

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
    async [PUT]({ request }) {
      return performRequest('PUT', request)
    },
    async [PATCH]({ request }) {
      return performRequest('PATCH', request)
    },
  }

  return backend
}
