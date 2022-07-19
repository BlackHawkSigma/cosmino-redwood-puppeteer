import { render } from '@redwoodjs/testing/web'

import SessionCard from './SessionCard'
import { standard, busy } from './SessionCard.mock'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('SessionCard', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SessionCard {...standard()} />)
    }).not.toThrow()
  })

  it('renders "busy" successfully', () => {
    expect(() => {
      render(<SessionCard {...busy()} />)
    }).not.toThrow()
  })
})
