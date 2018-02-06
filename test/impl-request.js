import backend from '../src/backends/impl-request'
import testBackend from '../src/spec/backend.spec'
import testImplBackend from '../src/spec/impl-backend.spec'

describe('borders-rest-client/request-backend', () => {
  testBackend(backend)
  testImplBackend(backend)
})
