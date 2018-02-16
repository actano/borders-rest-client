// This file is only used by the `spec` files. These files don't run in production
// but only in form of unit-tests. Therefore this dev dependency is ok.
// eslint-disable-next-line import/no-extraneous-dependencies
import { expect } from 'chai'

function* expectThrow(generatorFunc, errorPredicate = () => {}) {
  try {
    yield* generatorFunc()
  } catch (e) {
    errorPredicate(e)
    return
  }
  expect.fail(null, null, 'Should throw an error')
}

export default expectThrow
