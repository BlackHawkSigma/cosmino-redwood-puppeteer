import type { UpdateSettings, UpdateSettingsVariables } from 'types/graphql'

// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  user: {
    id: 1,
    name: 'John Doe',
    password: 'secret',
    settings: { showSuccessCounter: true },
  },
})

mockGraphQLMutation<UpdateSettings, UpdateSettingsVariables>(
  'UpdateSettings',
  (variables, { ctx }) => {
    ctx.delay(1_000)

    const { input } = variables
    return {
      updateUser: {
        settings: { showSuccessCounter: input.showSuccessCounter || true },
      },
    }
  }
)
