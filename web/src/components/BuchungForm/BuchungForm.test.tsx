import { render } from '@redwoodjs/testing/web'

import BuchungForm from './BuchungForm'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('BuchungForm', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<BuchungForm />)
    }).not.toThrow()
  })
})
