import commandWithStackFrame from 'borders/command-with-stackframe'

export const STUB_CALL = 'borders-rest-client/stub-call'

export default commandWithStackFrame((method, request, response) =>
  ({
    type: STUB_CALL,
    payload: {
      method,
      request,
      response,
    },
  }))
