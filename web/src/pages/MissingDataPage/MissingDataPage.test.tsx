import { render } from '@redwoodjs/testing/web'

import MissingDataPage from './MissingDataPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('MissingDataPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<MissingDataPage />)
    }).not.toThrow()
  })
})
