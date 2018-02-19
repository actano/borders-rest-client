// eslint-disable-next-line import/no-extraneous-dependencies
import sinon from 'sinon'

import { GET } from '../commands/get'
import { POST } from '../commands/post'
import { DELETE } from '../commands/delete'
import { STUB_CALL } from '../test-commands/stub-call'
import { RestStatusError } from '../error'

const supportedResponseProperties = [
  'status', 'body', 'headers',
]

const supportedRequestProperties = [
  'path', 'query', 'headers', 'bodyJson', 'bodyUrlencoded',
]

function validateHeaders(response) {
  if (response.headers) {
    for (const headerKey of Object.keys(response.headers)) {
      if (headerKey !== headerKey.toLowerCase()) {
        throw new Error(`The header "${headerKey}" should be lower case`)
      }
    }
  }
}

function validateResponseProperties(response) {
  for (const responseProperty of Object.keys(response)) {
    if (!supportedResponseProperties.includes(responseProperty)) {
      throw new Error(`The response property "${responseProperty}" is not supported`)
    }
  }
}

function validateRequestProperties(request) {
  for (const requestProperty of Object.keys(request)) {
    if (!supportedRequestProperties.includes(requestProperty)) {
      throw new Error(`The request property "${requestProperty}" is not supported`)
    }
  }
}

export default () => {
  const stub = sinon.stub()

  const stubRequest = (method, request, response) => {
    validateHeaders(response)
    validateResponseProperties(response)
    validateRequestProperties(request)

    const callStub = stub.withArgs(sinon.match({
      method: method.toLowerCase(),
      ...request,
    }))

    callStub.returns(response)
    return callStub
  }

  const getStubbedResponse = (method, request) => {
    const response = stub({
      method: method.toLowerCase(),
      ...request,
    })

    if (response.status >= 400) {
      throw new RestStatusError('stubbed rest error', response.status, response)
    }

    return response
  }

  const backend = {
    async [STUB_CALL]({ method, request, response }) {
      return stubRequest(method, request, response)
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
