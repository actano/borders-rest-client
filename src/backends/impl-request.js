import client from 'request-promise'

import { GET } from '../../src/commands/get'

export default () => {
  const backend = {
    async [GET]({ request }) {
      return await client(
        {
          method: 'GET',
          uri: request.path,
          json: true,
        },
      )
    },
  }

  return backend
}
