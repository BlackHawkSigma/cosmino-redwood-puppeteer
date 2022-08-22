import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.TerminalCreateArgs>({
  terminal: {
    one: {
      data: { id: 1, name: 'String3904178', busy: false, focused: false },
    },
    two: {
      data: { id: 2, name: 'String9079873', busy: false, focused: false },
    },
  },
})

export type StandardScenario = typeof standard
