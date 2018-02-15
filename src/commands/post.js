import commandWithStackFrame from 'borders/command-with-stackframe'

export const POST = 'borders-rest-client/post'

export default commandWithStackFrame(request =>
  ({
    type: POST,
    payload: {
      request,
    },
  }))
