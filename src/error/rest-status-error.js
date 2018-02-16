import RestError from './rest-error'

export default class RestStatusError extends RestError {
  constructor(message, statusCode, response) {
    super(message)
    this.statusCode = statusCode
    this.response = {
      body: response.body,
    }
  }
}
