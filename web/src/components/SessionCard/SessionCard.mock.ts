import type {
  KillCosminoSessionMutation,
  KillCosminoSessionMutationVariables,
} from 'types/graphql'

export const standard = () => ({
  user: { name: 'John Doe' },
  transactions: 0,
  busy: false,
})

export const busy = () => ({
  user: { name: 'John Doe' },
  transactions: 42,
  busy: true,
})

mockGraphQLMutation<
  KillCosminoSessionMutation,
  KillCosminoSessionMutationVariables
>('KillCosminoSessionMutation', (_variables, { ctx }) => {
  ctx.delay(250)

  return { killSession: true }
})
