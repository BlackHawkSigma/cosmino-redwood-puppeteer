import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: {
        name: 'String1116033',
        hashedPassword: 'String',
        password: 'String',
        salt: 'String',
        showSuccessCounter: true,
      },
    },
    two: {
      data: {
        name: 'String4950813',
        hashedPassword: 'String',
        password: 'String',
        salt: 'String',
        showSuccessCounter: false,
      },
    },
  },
})

export type StandardScenario = typeof standard
