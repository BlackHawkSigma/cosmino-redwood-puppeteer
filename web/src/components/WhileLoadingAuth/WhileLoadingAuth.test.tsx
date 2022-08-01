import { render } from '@redwoodjs/testing/web'

import WhileLoadingAuth from './WhileLoadingAuth'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('WhileLoadingAuth', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<WhileLoadingAuth />)
    }).not.toThrow()
  })
})
