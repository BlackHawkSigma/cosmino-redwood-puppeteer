import { render } from '@redwoodjs/testing/web'

import BuchungLogEntry from './BuchungLogEntry'
import { ok } from './BuchungLogEntry.mock'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('BuchungLogEntry', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<BuchungLogEntry {...ok()} />)
    }).not.toThrow()
  })
})
