import commandWithStackFrame from 'borders/command-with-stackframe'

export const PUT = 'borders-rest-client/put'

export default commandWithStackFrame(request =>
  ({
    type: PUT,
    payload: {
      request,
    },
  }))
