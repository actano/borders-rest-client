import commandWithStackFrame from 'borders/command-with-stackframe'

export const DELETE = 'borders-rest-client/delete'

export default commandWithStackFrame(request =>
  ({
    type: DELETE,
    payload: {
      request,
    },
  }))
