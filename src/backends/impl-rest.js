import rest from 'rest'
import mime from 'rest/interceptor/mime'

import { GET } from '../../src/commands/get'

export default () => {
  const client = rest.wrap(mime, { mime: 'application/json', accept: 'application/json' })

  const backend = {
    async [GET]({ request }) {
      const { entity } = await client(
        {
          method: 'GET',
          path: request.path,
        },
      )
      return entity
    },
  }

  return backend
}

