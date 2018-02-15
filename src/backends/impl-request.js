import client from 'request-promise'

import { GET } from '../commands/get'
import RestError from '../error/rest-error'
import { GET } from '../commands/get'

async function performRequest(method, request) {
  try {
    return await client({
      method,
      uri: request.path,
      headers: request.headers,
      qs: request.query,
      json: true,
    })
  } catch (e) {
    throw new RestError(e)
  }
}

export default () => {
  const backend = {
    async [GET]({ request }) {
      return performRequest('GET', request)
    },
  }

  return backend
}
