import { VError } from 'verror'

export default class RestStatusError extends VError {
  constructor(cause, statusCode, response) {
    super(
      {
        name: 'RestStatusError',
        cause,
        info: {
          statusCode,
          response: {
            body: response.body,
          },
        },
      },
      `Received http error status code (${statusCode})`,
    )
  }
}
