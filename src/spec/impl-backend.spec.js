import nock from 'nock'
import Context from 'borders'
import chai from 'chai'

import { get } from '../commands'

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
}

