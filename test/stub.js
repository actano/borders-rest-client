import Context from 'borders'
import chai from 'chai'
import sinonChai from 'sinon-chai'
import sinon from 'sinon'

import stubBackend from '../src/test-backends/stub'
import testBackend from '../src/spec/backend.spec'
import expectThrow from '../src/spec/utils/expect-throw'
import { get, post, del } from '../src/commands'
import stubCall from '../src/test-commands/stub-call'

chai.use(sinonChai)
const { expect } = chai

const execute = generatorFunction => () => {
  const context = new Context().use(stubBackend())
  return context.execute(generatorFunction())
}

describe('borders-rest-client/stub-backend', () => {
  testBackend(stubBackend)

  it('should stub response for a get request', execute(function* test() {
    yield stubCall(
      'get',
      {
        path: '/some/path/entity',
      },
      {
        body: 'stubbed response 1',
        status: 200,
      },
    )

    yield stubCall(
      'get',
      {
        path: '/some/another-path/entity',
      },
      {
        body: 'stubbed response 2',
        status: 200,
      },
    )

    expect(yield get({
      path: '/some/path/entity',
      headers: {
        headerParam1: 23,
      },
    })).to.deep.equal({
      body: 'stubbed response 1',
      status: 200,
    })
    expect(yield get({
      path: '/some/another-path/entity',
      headers: {
        headerParam1: 23,
      },
    })).to.deep.equal({
      body: 'stubbed response 2',
      status: 200,
    })
  }))

  it('should stub response for a post request', execute(function* test() {
    yield stubCall(
      'post',
      {
        path: '/some/path/entity',
      },
      {
        body: 'stubbed response 1',
        status: 200,
      },
    )

    expect(yield post({
      path: '/some/path/entity',
    })).to.deep.equal({
      body: 'stubbed response 1',
      status: 200,
    })
  }))

  it('should stub response for a delete request', execute(function* test() {
    yield stubCall(
      'delete',
      {
        path: '/some/path/entity',
      },
      {
        status: 204,
      },
    )

    expect(yield del({
      path: '/some/path/entity',
    })).to.deep.equal({
      status: 204,
    })
  }))

  context('encodings', () => {
    it('should match request body with urlencoding', execute(function* test() {
      yield stubCall(
        'post',
        {
          path: '/some/path/entity',
        },
        {
          body: 'stubbed response 1',
          status: 200,
        },
      )
      yield stubCall(
        'post',
        {
          path: '/some/path/entity',
          bodyUrlencoded: {
            param1: 'value1',
            param2: 'value2',
          },
        },
        {
          body: 'stubbed response 2',
          status: 200,
        },
      )

      expect(yield post({
        path: '/some/path/entity',
        bodyUrlencoded: {
          param1: 'value1',
          param2: 'value2',
        },
      })).to.deep.equal({
        body: 'stubbed response 2',
        status: 200,
      })
    }))
    it('should match request body with json encoding', execute(function* test() {
      yield stubCall(
        'post',
        {
          path: '/some/path/entity',
        },
        {
          body: 'stubbed response 1',
          status: 200,
        },
      )
      yield stubCall(
        'post',
        {
          path: '/some/path/entity',
          bodyJson: {
            param1: 'value1',
            param2: 'value2',
          },
        },
        {
          body: 'stubbed response 2',
          status: 200,
        },
      )

      expect(yield post({
        path: '/some/path/entity',
        bodyJson: {
          param1: 'value1',
          param2: 'value2',
        },
      })).to.deep.equal({
        body: 'stubbed response 2',
        status: 200,
      })
    }))
  })

  context('headers', () => {
    it('should match given header fields', execute(function* test() {
      yield stubCall(
        'get',
        {
          path: 'http://server.com/some/path/entity',
        },
        {
          body: 'stubbed response 1',
          status: 200,
        },
      )

      yield stubCall(
        'get',
        {
          path: 'http://server.com/some/path/entity',
          headers: {
            someHeaderField: sinon.match.string,
          },
        },
        {
          body: 'stubbed response 2',
          status: 200,
        },
      )

      expect(yield get({
        path: 'http://server.com/some/path/entity',
        headers: {
          someHeaderField: 'someHeaderValue',
        },
      })).to.deep.equal({
        body: 'stubbed response 2',
        status: 200,
      })
    }))
  })
  context('query parameters', () => {
    it('should match given query parameters', execute(function* test() {
      yield stubCall(
        'get',
        {
          path: 'http://server.com/some/path/entity',
        },
        {
          body: 'stubbed response 1',
          status: 200,
        },
      )

      yield stubCall(
        'get',
        {
          path: 'http://server.com/some/path/entity',
          query: {
            param1: 'value1',
            param2: 'value2',
          },
        },
        {
          body: 'stubbed response 2',
          status: 200,
        },
      )

      expect(yield get({
        path: 'http://server.com/some/path/entity',
        query: {
          param1: 'value1',
          param2: 'value2',
        },
      })).to.deep.equal({
        body: 'stubbed response 2',
        status: 200,
      })
    }))
  })

  context('request format', () => {
    it('should not throw an error for valid request object', execute(function* test() {
      yield stubCall(
        'get',
        {
          path: '/some/path/entity',
          query: {
            param1: 'value1',
            param2: 'value2',
          },
          headers: {
            someHeaderField: 'someHeaderValue',
          },
          bodyJson: {
            param1: 'value1',
            param2: 'value2',
          },
        },
        {},
      )
    }))
    it('should throw an error for invalid properties in the request', execute(function* test() {
      yield* expectThrow(
        function* () {
          yield stubCall(
            'get',
            {
              path: '/some/path/entity',
              query: {
                param1: 'value1',
                param2: 'value2',
              },
              headers: {
                someHeaderField: 'someHeaderValue',
              },
              someProperty: 'some value',
            },
            {},
          )
        },
        (error) => {
          expect(error.message).to.equal('The request property "someProperty" is not supported')
        },
      )
    }))
  })
  context('response format', () => {
    it('should not throw an error for valid response object', execute(function* test() {
      yield stubCall(
        'get',
        {
          path: '/some/path/entity',
        },
        {
          body: 'stubbed response 1',
          status: 200,
          headers: {
            param1: 'value1',
          },
        },
      )
    }))
    it('should throw an error for mixed-case header', execute(function* test() {
      yield* expectThrow(
        function* () {
          yield stubCall(
            'get',
            {
              path: '/some/path/entity',
            },
            {
              body: 'stubbed response 1',
              status: 200,
              headers: {
                Param1: 'value1',
              },
            },
          )
        },
        (error) => {
          expect(error.message).to.equal('The header "Param1" should be lower case')
        },
      )
    }))
    it('should throw an error for invalid properties in the response', execute(function* test() {
      yield* expectThrow(
        function* () {
          yield stubCall(
            'get',
            {
              path: '/some/path/entity',
            },
            {
              someProperty: 'some value',
            },
          )
        },
        (error) => {
          expect(error.message).to.equal('The response property "someProperty" is not supported')
        },
      )
    }))
  })
  context('expectations on stubs', () => {
    it('should return working sinon stubs for stubbed rest calls', execute(function* test() {
      const stub1 = yield stubCall(
        'get',
        {
          path: 'http://server.com/some/path/entity',
          bodyJson: { property: 'value1' },
        },
        {},
      )

      const stub2 = yield stubCall(
        'get',
        {
          path: 'http://server.com/some/path/entity',
          bodyJson: { property: 'value2' },
        },
        {},
      )

      yield get({
        path: 'http://server.com/some/path/entity',
        bodyJson: { property: 'value1' },
      })
      yield get({
        path: 'http://server.com/some/path/entity',
        bodyJson: { property: 'value2' },
      })
      yield get({
        path: 'http://server.com/some/path/entity',
        bodyJson: { property: 'value2' },
      })

      expect(stub1).to.have.callCount(1)
      expect(stub2).to.have.callCount(2)
    }))
  })
})
