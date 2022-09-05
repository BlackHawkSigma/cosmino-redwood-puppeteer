import type {
  UpdateTerminalMutation,
  UpdateTerminalMutationVariables,
} from 'types/graphql'

mockGraphQLMutation<UpdateTerminalMutation, UpdateTerminalMutationVariables>(
  'UpdateTerminalMutation',
  (variables, { ctx }) => {
    ctx.delay(250)

    const { id } = variables
    return { updateTerminal: { id, user: { name: 'Alice' } } }
  }
)
