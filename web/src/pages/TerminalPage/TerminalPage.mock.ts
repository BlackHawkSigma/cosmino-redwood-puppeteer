import type {
  ClaimTerminalMutation,
  ClaimTerminalMutationVariables,
  ReleaseTerminalMutation,
  ReleaseTerminalMutationVariables,
} from 'types/graphql'

mockGraphQLMutation<ClaimTerminalMutation, ClaimTerminalMutationVariables>(
  'ClaimTerminalMutation',
  (variables, { ctx }) => {
    ctx.delay(1_000)

    const { id } = variables
    return {
      claimTerminal: { id, name: '1', user: { name: 'Alice' } },
    }
  }
)

mockGraphQLMutation<ReleaseTerminalMutation, ReleaseTerminalMutationVariables>(
  'ReleaseTerminalMutation',
  (variables, { ctx }) => {
    ctx.delay(250)

    const { id } = variables
    return { unclaimTerminal: { id, user: { name: 'Alice' } } }
  }
)
