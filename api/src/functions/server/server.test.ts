import { mockHttpEvent } from '@redwoodjs/testing/api'

import { handler } from './server'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-functions

describe('server function', () => {
  it('Should respond with 200', async () => {
    const httpEvent = mockHttpEvent({})

    const response = await handler(httpEvent, null)
    // const { data } = JSON.parse(response.body)

    expect(response.statusCode).toBe(200)
    // expect(data).toBe('server function')
  })

  // You can also use scenarios to test your api functions
  // See guide here: https://redwoodjs.com/docs/testing#scenarios
  //
  // scenario('Scenario test', async () => {
  //
  // })
})
