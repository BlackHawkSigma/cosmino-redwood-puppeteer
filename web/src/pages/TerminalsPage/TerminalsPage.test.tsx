import { render } from '@redwoodjs/testing/web'

import TerminalsPage from './TerminalsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('TerminalsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<TerminalsPage />)
    }).not.toThrow()
  })
})
