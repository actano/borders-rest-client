import Context from 'borders'
import chai from 'chai'

import stubBackend from '../src/backends/stub'
import testBackend from '../src/spec/backend.spec'

import { get } from '../src/commands'
import stubCall from '../src/test-commands/stub-call'


chai.config.truncateThreshold = 0
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

    // yield stubCall(
    //   'put',
    //   {
    //     path: '/some/path/entity',
    //   },
    //   {
    //     body: 'stubbed response 1',
    //     status: 200,
    //   },
    // )

    expect(
      yield get(
        {
          path: '/some/path/entity',
          header: {
            headerParam1: 23,
          },
          params: {
            param1: 42,
          },
        },
      ),
    ).to.deep.equal(
      {
        body: 'stubbed response 1',
        status: 200,
      },
    )
    expect(
      yield get(
        {
          path: '/some/another-path/entity',
          header: {
            headerParam1: 23,
          },
          params: {
            param1: 42,
          },
        },
      ),
    ).to.deep.equal(
      {
        body: 'stubbed response 2',
        status: 200,
      },
    )
  }))
})
