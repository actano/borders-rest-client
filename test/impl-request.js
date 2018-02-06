import backend from '../src/backends/impl-request'
import testRestClient from '../src/spec'
import testImplBackend from '../src/spec/impl-backend.spec'

describe('borders-rest-client/request-backend', () => {
  testRestClient(backend)
  testImplBackend(backend)
})
