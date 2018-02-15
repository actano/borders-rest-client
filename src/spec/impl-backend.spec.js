/* eslint-env mocha */
import Context from 'borders'
import chai from 'chai'
import chaiSubset from 'chai-subset'
import nock from 'nock'
import querystring from 'querystring'

import { del, get, post } from '../commands'
import RestError from '../error/rest-error'

chai.use(chaiSubset)

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

    expect(yield get({
      path: 'http://server.com/some/path/entity',
    })).containSubset({
      body: { someReturnValue: 42 },
    })

    mock.done()
  }))

  it('should perform a post request', execute(function* test() {
    const mock = nock('http://server.com')
      .post('/some/path/entity')
      .reply(200, { someReturnValue: 42 })

    expect(yield post({
      path: 'http://server.com/some/path/entity',
    })).containSubset({
      body: { someReturnValue: 42 },
    })

    mock.done()
  }))

  it('should perform a delete request', execute(function* test() {
    const mock = nock('http://server.com')
      .delete('/some/path/entity')
      .reply(204)

    yield del({
      path: 'http://server.com/some/path/entity',
    })

    mock.done()
  }))

  context('response', () => {
    it('should return status, headers and response body', execute(function* test() {
      const mock = nock('http://server.com')
        .get('/some/path/entity')
        .reply(200, { someReturnValue: 42 }, {
          headerParam1: 'headerValue1',
        })

      expect(yield get({
        path: 'http://server.com/some/path/entity',
      })).to.containSubset({
        status: 200,
        headers: {
          // header keys will converted to lower case
          headerparam1: 'headerValue1',
        },
        body: {
          someReturnValue: 42,
        },
      })

      mock.done()
    }))
  })

  context('encodings', () => {
    it('should send a body with urlencoding', execute(function* test() {
      const mock = nock('http://server.com')
        .post('/some/path/entity', querystring.stringify({
          param1: 'value1',
          param2: 'value2',
        }))
        .reply(200, { someReturnValue: 42 })

      expect(yield post({
        path: 'http://server.com/some/path/entity',
        bodyUrlencoded: {
          param1: 'value1',
          param2: 'value2',
        },
      })).containSubset({
        body: { someReturnValue: 42 },
      })

      mock.done()
    }))
    it('should send a body with json encoding', execute(function* test() {
      const mock = nock('http://server.com')
        .post('/some/path/entity', {
          param1: 'value1',
          param2: 'value2',
        })
        .reply(200, { someReturnValue: 42 })

      expect(yield post({
        path: 'http://server.com/some/path/entity',
        bodyJson: {
          param1: 'value1',
          param2: 'value2',
        },
      })).containSubset({
        body: { someReturnValue: 42 },
      })

      mock.done()
    }))
  })

  it('should throw an error on error status code', execute(function* test() {
    const mock = nock('http://server.com')
      .get('/some/path/entity')
      .reply(500)

    try {
      yield get({
        path: 'http://server.com/some/path/entity',
      })
    } catch (e) {
      expect(e, e.toString()).to.be.instanceOf(RestError)
      return
    } finally {
      mock.done()
    }
    throw new AssertionError('expected an error')
  }))

  context('headers', () => {
    it('should send specified header fields', execute(function* test() {
      const mock = nock('http://server.com')
        .get('/some/path/entity')
        .matchHeader('someHeaderField', 'someHeaderValue')
        .reply(200)

      yield get({
        path: 'http://server.com/some/path/entity',
        headers: {
          someHeaderField: 'someHeaderValue',
        },
      })

      mock.done()
    }))
  })
  context('query parameters', () => {
    it('should send specified parameters fields', execute(function* test() {
      const mock = nock('http://server.com')
        .get('/some/path/entity')
        .query({
          param1: 'value1',
          param2: 'value2',
        })
        .reply(200)

      yield get({
        path: 'http://server.com/some/path/entity',
        query: {
          param1: 'value1',
          param2: 'value2',
        },
      })

      mock.done()
    }))
  })
}

