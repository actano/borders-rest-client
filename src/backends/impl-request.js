import client from 'request-promise'

import { GET } from '../../src/commands/get'
import RestError from '../error/rest-error'

export default () => {
  const backend = {
    async [GET]({ request }) {
      try {
        return await client(
          {
            method: 'GET',
            uri: request.path,
            json: true,
          },
        )
      } catch (e) {
        throw new RestError(e)
      }
    },
  }

  return backend
}
