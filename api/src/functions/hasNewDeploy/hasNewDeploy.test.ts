import { mockHttpEvent } from '@redwoodjs/testing/api'

import { getGitVersion, handler } from './hasNewDeploy'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-functions

describe('hasNewDeploy function', () => {
  it('Should respond with 200', async () => {
    const httpEvent = mockHttpEvent({})

    const response = await handler(httpEvent, null)
    const { version } = JSON.parse(response.body)

    expect(response.statusCode).toBe(200)
    expect(version).toBe(await getGitVersion())
  })

  // You can also use scenarios to test your api functions
  // See guide here: https://redwoodjs.com/docs/testing#scenarios
  //
  // scenario('Scenario test', async () => {
  //
  // })
})
