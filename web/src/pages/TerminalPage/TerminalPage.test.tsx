import { render } from '@redwoodjs/testing/web'

import TerminalPage from './TerminalPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('TerminalPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<TerminalPage />)
    }).not.toThrow()
  })
})
