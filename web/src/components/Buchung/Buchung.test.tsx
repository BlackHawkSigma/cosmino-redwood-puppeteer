import { render } from '@redwoodjs/testing/web'

import Buchung from './Buchung'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Buchung', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Buchung terminal="1" />)
    }).not.toThrow()
  })
})
