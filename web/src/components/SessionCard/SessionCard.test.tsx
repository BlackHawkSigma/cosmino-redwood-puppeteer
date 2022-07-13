import { render } from '@redwoodjs/testing/web'

import SessionCard from './SessionCard'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('SessionCard', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SessionCard />)
    }).not.toThrow()
  })
})
