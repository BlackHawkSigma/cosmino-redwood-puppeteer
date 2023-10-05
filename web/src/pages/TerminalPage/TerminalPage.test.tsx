import type {
  ClaimTerminalMutation,
  ClaimTerminalMutationVariables,
  ReleaseTerminalMutation,
  ReleaseTerminalMutationVariables,
  UpdateTerminalMutation,
} from 'types/graphql'

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

mockGraphQLMutation<ClaimTerminalMutation, ClaimTerminalMutationVariables>(
  'ClaimTerminalMutation',
  (variables) => {
    const { id } = variables
    return {
      claimTerminal: { id, name: '1', user: { name: 'Alice' } },
    }
  }
)

mockGraphQLMutation<ReleaseTerminalMutation, ReleaseTerminalMutationVariables>(
  'ReleaseTerminalMutation',
  (variables) => {
    const { id } = variables
    return { unclaimTerminal: { id, user: { name: 'Alice' } } }
  }
)

mockGraphQLMutation<UpdateTerminalMutation>('UpdateTerminalMutation', () => {
  return { updateTerminal: { id: 1, user: { name: 'Alice' } } }
})
