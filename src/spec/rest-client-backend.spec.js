/* eslint-disable import/no-extraneous-dependencies */
/* eslint-env mocha */
import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import Context from 'borders'

import { get, GET } from '../commands'

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
      sandbox = sinon.sandbox.create()
      sandbox.stub(backend, GET)
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should handle "GET" command', execute(function* test() {
    yield get({
        path: '/some/path/entity',
        header: {
          headerParam1: 23,
        },
        params: {
          param1: 42,
        },
    })

    expect(backend[GET]).to.have.been.calledWith({
        request: {
            path: '/some/path/entity',
            header: {
                headerParam1: 23,
            },
            params: {
                param1: 42,
            },
        }
    })
  }))
}
