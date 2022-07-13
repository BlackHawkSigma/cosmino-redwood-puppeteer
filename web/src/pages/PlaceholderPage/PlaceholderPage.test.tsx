import { render } from '@redwoodjs/testing/web'

import PlaceholderPage from './PlaceholderPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('PlaceholderPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PlaceholderPage />)
    }).not.toThrow()
  })
})
