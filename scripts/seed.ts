import type { Prisma } from '@prisma/client'
import { db } from 'api/src/lib/db'

export default async () => {
  try {
    //
    // Manually seed via `yarn rw prisma db seed`
    // Seeds automatically with `yarn rw prisma migrate dev` and `yarn rw prisma migrate reset`
    //
    const data: Prisma.UserRoleCreateArgs['data'][] = [
      { name: 'user', id: 1 },
      { name: 'admin', id: 2 },
    ]
    const terminals: Prisma.TerminalCreateArgs['data'][] = [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
    ].map((name) => ({ id: +name, name, busy: false, focused: false }))

    // Note: if using PostgreSQL, using `createMany` to insert multiple records is much faster
    // @see: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#createmany
    Promise.all(
      [
        data.map(async (data: Prisma.UserRoleCreateArgs['data']) => {
          const record = await db.userRole.upsert({
            where: { id: data.id },
            update: {},
            create: { ...data },
          })
          console.log(record)
        }),

        terminals.map(async (create: Prisma.TerminalCreateArgs['data']) => {
          const record = await db.terminal.upsert({
            where: { id: create.id },
            update: {},
            create,
          })
          console.log(record)
        }),
      ].flat()
    )
  } catch (error) {
    console.warn('Please define your seed data.')
    console.error(error)
  }
}
