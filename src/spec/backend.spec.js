/* eslint-env mocha */
import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import Context from 'borders'

import {
  get,
  GET,
  post,
  POST,
  del,
  DELETE,
  put,
  PUT,
  patch,
  PATCH,
} from '../commands'

chai.use(sinonChai)
const { expect } = chai

export default (createBackend) => {
  let backend

  const execute = generatorFunction => () => {
    const context = new Context().use(backend)
    return context.execute(generatorFunction())
  }

  let sandbox

  beforeEach(() => {
    backend = createBackend()
    sandbox = sinon.createSandbox()
    sandbox.stub(backend, GET)
    sandbox.stub(backend, POST)
    sandbox.stub(backend, DELETE)
    sandbox.stub(backend, PUT)
    sandbox.stub(backend, PATCH)
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should handle "GET" command', execute(function* test() {
    yield get({
      path: '/some/path/entity',
    })

    expect(backend[GET]).to.have.been.calledWith({
      request: {
        path: '/some/path/entity',
      },
    })
  }))

  it('should handle "POST" command', execute(function* test() {
    yield post({
      path: '/some/path/entity',
    })

    expect(backend[POST]).to.have.been.calledWith({
      request: {
        path: '/some/path/entity',
      },
    })
  }))

  it('should handle "DELETE" command', execute(function* test() {
    yield del({
      path: '/some/path/entity',
    })

    expect(backend[DELETE]).to.have.been.calledWith({
      request: {
        path: '/some/path/entity',
      },
    })
  }))

  it('should handle "PUT" command', execute(function* test() {
    yield put({
      path: '/some/path/entity',
    })

    expect(backend[PUT]).to.have.been.calledWith({
      request: {
        path: '/some/path/entity',
      },
    })
  }))

  it('should handle "PATCH" command', execute(function* test() {
    yield patch({
      path: '/some/path/entity',
    })

    expect(backend[PATCH]).to.have.been.calledWith({
      request: {
        path: '/some/path/entity',
      },
    })
  }))
}
