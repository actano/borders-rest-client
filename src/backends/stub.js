// eslint-disable-next-line import/no-extraneous-dependencies
import sinon from 'sinon'

import { GET } from '../commands/get'
import { POST } from '../commands/post'
import { DELETE } from '../commands/delete'
import { STUB_CALL } from '../test-commands/stub-call'

export default () => {
  const stub = sinon.stub()

  const stubRequest = (method, request, response) => {
    stub.withArgs(sinon.match({
      method: method.toLowerCase(),
      ...request,
    })).returns(response)
  }

  const getStubbedResponse = (method, request) => {
    return stub({
      method: method.toLowerCase(),
      ...request,
    })
  }

  const backend = {
    async [STUB_CALL]({ method, request, response }) {
      stubRequest(method, request, response)
    },
    async [GET]({ request }) {
      return getStubbedResponse('get', request)
    },
    async [POST]({ request }) {
      return getStubbedResponse('post', request)
    },
    async [DELETE]({ request }) {
      return getStubbedResponse('delete', request)
    },
  }

  return backend
}
