import noopBackend from '../src/backends/noop'
import testRestClient from '../src/spec'

describe('borders-rest-client/noop-backend', () => {
    testRestClient(noopBackend)
})
