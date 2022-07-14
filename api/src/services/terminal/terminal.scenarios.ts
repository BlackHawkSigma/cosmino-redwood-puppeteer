import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.TerminalCreateArgs>({
  terminal: {
    one: { data: { name: 'String3904178' } },
    two: { data: { name: 'String9079873' } },
  },
})

export type StandardScenario = typeof standard
