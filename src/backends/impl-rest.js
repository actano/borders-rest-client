import rest from 'rest'
import interceptor from 'rest/interceptor'
import errorCode from 'rest/interceptor/errorCode'
import mime from 'rest/interceptor/mime'

import { GET } from '../../src/commands/get'
import RestError from '../error/rest-error'

const responseToError = interceptor({
  error: async (response) => {
    if (!(response instanceof Error)) {
      throw new RestError(response)
    }
    throw response
  },
})

export default () => {
  const client = rest
    .wrap(mime, { mime: 'application/json', accept: 'application/json' })
    .wrap(errorCode)
    .wrap(responseToError)

  const backend = {
    async [GET]({ request }) {
      const { entity } = await client({
        method: 'GET',
        path: request.path,
      })
      return entity
    },
  }

  return backend
}

