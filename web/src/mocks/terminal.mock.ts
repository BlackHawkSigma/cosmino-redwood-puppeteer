import type {
  UpdateTerminalMutation,
  ClaimTerminalMutation,
  ReleaseTerminalMutation,
} from 'types/graphql'

mockGraphQLMutation<ClaimTerminalMutation>('ClaimTerminalMutation', () => {
  return { claimTerminal: { id: 1, name: '1' } }
})

mockGraphQLMutation<UpdateTerminalMutation>('UpdateTerminalMutation', () => {
  return { updateTerminal: { id: 1 } }
})

mockGraphQLMutation<ReleaseTerminalMutation>('ReleaseTerminalMutation', () => {
  return { unclaimTerminal: { id: 1 } }
})
