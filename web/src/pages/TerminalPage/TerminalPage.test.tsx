import { render, mockCurrentUser, waitFor } from '@redwoodjs/testing/web'

import TerminalPage from './TerminalPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('BuchenPage', () => {
  it('renders successfully', async () => {
    mockCurrentUser({ id: 1, name: 'Alice' })

    await waitFor(() => {
      expect(async () => {
        render(<TerminalPage terminal={1} />)
      }).not.toThrow()
    })
  })
})
