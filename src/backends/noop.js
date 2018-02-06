import { GET } from '../commands/get'

export default () => {
  const backend = {
    // eslint-disable-next-line no-empty-function
    async [GET]() {},
  }

  return backend
}
