import { render } from '@redwoodjs/testing/web'

import BuchungLog from './BuchungLog'
import { standard } from './BuchungLog.mock'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('BuchungLog', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<BuchungLog {...standard()} />)
    }).not.toThrow()
  })
})
