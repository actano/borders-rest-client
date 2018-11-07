/* eslint-env mocha */
import Context from 'borders'
import chai from 'chai'
import chaiSubset from 'chai-subset'
import nock from 'nock'
import querystring from 'querystring'
import { VError } from 'verror'

import { del, get, post } from '../commands'
import { RestError, RestStatusError } from '../error'

import expectThrow from './utils/expect-throw'

chai.use(chaiSubset)

const { expect } = chai

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
    context('when response contains binary data', () => {
      it('should return status, headers and response body', execute(function* test() {
        const binaryString = JSON.stringify({ a: 1 })
        const postParam = { key: 'value' }
        const mock = nock('http://test-server.com')
          .post('/foo/bar', JSON.stringify(postParam))
          .reply(200, binaryString, {
            headerParam1: 'headerValue1',
          })

        expect(yield post({
          path: 'http://test-server.com/foo/bar',
          binaryResponse: true,
          bodyJson: postParam,
        })).to.containSubset({
          status: 200,
          headers: {
            // header keys will converted to lower case
            headerparam1: 'headerValue1',
          },
          body: Buffer.from(binaryString),
        })

        mock.done()
      }))
    })
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

  context('errors', () => {
    context('when connection fails', () => {
      it('should throw a status error', execute(function* test() {
        yield* expectThrow(
          function* () {
            yield get({
              path: 'http://server.com/some/path/entity',
            })
          },
          (err) => {
            expect(err).to.be.instanceof(RestError)
          },
        )
      }))
    })
    context('when response status code indicates an error', () => {
      it('should throw a status error', execute(function* test() {
        const mock = nock('http://server.com')
          .get('/some/path/entity')
          .reply(400, { someErrorInfo: 'some error message' })

        yield* expectThrow(
          function* () {
            yield get({
              path: 'http://server.com/some/path/entity',
            })
          },
          (err) => {
            expect(err).to.be.instanceof(RestStatusError)
          },
        )

        mock.done()
      }))

      it('should contain status code and response body', execute(function* test() {
        const mock = nock('http://server.com')
          .get('/some/path/entity')
          .reply(400, { someProp: 'someValue' })

        yield* expectThrow(
          function* () {
            yield get({
              path: 'http://server.com/some/path/entity',
            })
          },
          (err) => {
            const errInfo = VError.info(err)
            expect(errInfo).to.be.have.property('statusCode', 400)
            expect(errInfo).to.be.have.property('response')
            expect(errInfo.response).to.be.have.deep.property('body', {
              someProp: 'someValue',
            })
          },
        )

        mock.done()
      }))
    })
  })

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
