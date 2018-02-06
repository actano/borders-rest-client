import backend from '../src/backends/impl-rest'
import testBackend from '../src/spec/backend.spec'
import testImplBackend from '../src/spec/impl-backend.spec'

describe('borders-rest-client/rest-backend', () => {
  testBackend(backend)
  testImplBackend(backend)
})
