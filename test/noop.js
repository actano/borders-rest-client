import noopBackend from '../src/backends/noop'
import testBackend from '../src/spec/backend.spec'

describe('borders-rest-client/noop-backend', () => {
  testBackend(noopBackend)
})
