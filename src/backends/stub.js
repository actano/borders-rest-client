// eslint-disable-next-line import/no-extraneous-dependencies
import sinon from 'sinon'

import { GET } from '../commands/get'
import { STUB_CALL } from '../test-commands/stub-call'

export default () => {
  const getStub = sinon.stub()

  const backend = {
    async [STUB_CALL]({ request, response }) {
      getStub
        .withArgs(sinon.match(request)).returns(response)
    },
    async [GET]({ request }) {
      return getStub(request)
    },
  }

  return backend
}
