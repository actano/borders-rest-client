import commandWithStackFrame from 'borders/command-with-stackframe'

export const PATCH = 'borders-rest-client/patch'

export default commandWithStackFrame(request =>
  ({
    type: PATCH,
    payload: {
      request,
    },
  }))
