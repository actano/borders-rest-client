import client from 'request-promise'

import { GET } from '../commands/get'
import RestError from '../error/rest-error'

export default () => {
  const backend = {
    async [GET]({ request }) {
      try {
        return await client({
          method: 'GET',
          uri: request.path,
          headers: request.headers,
          qs: request.query,
          json: true,
        })
      } catch (e) {
        throw new RestError(e)
      }
    },
  }

  return backend
}
