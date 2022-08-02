import { render } from '@redwoodjs/testing/web'

import UpdateNotification from './UpdateNotification'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('UpdateNotification', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<UpdateNotification />)
    }).not.toThrow()
  })
})
