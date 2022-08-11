import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: {
        name: 'String1116033',
        hashedPassword: 'String',
        password: 'String',
        salt: 'String',
      },
    },
    two: {
      data: {
        name: 'String4950813',
        hashedPassword: 'String',
        password: 'String',
        salt: 'String',
      },
    },
  },
})

export type StandardScenario = typeof standard
