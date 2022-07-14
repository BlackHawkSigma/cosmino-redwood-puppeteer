import { render } from '@redwoodjs/testing/web'

import ScannerHandler from './ScannerHandler'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ScannerHandler', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ScannerHandler onFire={() => {}} />)
    }).not.toThrow()
  })
})
