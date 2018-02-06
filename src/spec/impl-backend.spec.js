/* eslint-env mocha */
import Context from 'borders'
import chai from 'chai'
import nock from 'nock'

import { get } from '../commands'
import RestError from '../error/rest-error'

const { expect, AssertionError } = chai

export default (createBackend) => {
  let backend

  const execute = generatorFunction => () => {
    const context = new Context().use(backend)
    return context.execute(generatorFunction())
  }

  beforeEach(() => {
    backend = createBackend()
  })

  it('should perform a get request', execute(function* test() {
    const mock = nock('http://server.com')
      .get('/some/path/entity')
      .reply(200, { someReturnValue: 42 })

    expect(
      yield get(
        {
          path: 'http://server.com/some/path/entity',
        },
      ),
    ).to.deep.equal(
      {
        someReturnValue: 42,
      },
    )

    mock.done()
  }))

  it('should throw an error on error status code', execute(function* test() {
    const mock = nock('http://server.com')
      .get('/some/path/entity')
      .reply(500)

    try {
      yield get(
        {
          path: 'http://server.com/some/path/entity',
        },
      )
    } catch (e) {
      expect(e, e.toString()).to.be.instanceOf(RestError)
      return
    } finally {
      mock.done()
    }
    throw new AssertionError('expected an error')
  }))
}

