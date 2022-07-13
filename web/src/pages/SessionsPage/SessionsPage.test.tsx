import { render } from '@redwoodjs/testing/web'

import SessionsPage from './SessionsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('SessionsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SessionsPage />)
    }).not.toThrow()
  })
})
