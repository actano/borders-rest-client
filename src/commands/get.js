import commandWithStackFrame from 'borders/command-with-stackframe'

export const GET = 'borders-rest-client/get'

export default commandWithStackFrame(request =>
  ({
    type: GET,
    payload: {
      request,
    },
  }),
)
