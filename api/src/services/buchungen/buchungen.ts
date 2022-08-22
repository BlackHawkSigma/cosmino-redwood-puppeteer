import type { QueryResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

import { terminalByUserId } from '../terminal'

export const lastFiveLogsByUser: QueryResolvers['lastFiveLogsByUser'] = async ({
  userId,
}) => {
  const terminal = await terminalByUserId({ userId })

  return db.log
    .findMany({
      where: {
        AND: [
          { user: { id: userId } },
          { createdAt: { gte: terminal.loggedInAt } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })
    .then((result) =>
      result.map((entry) => ({
        ...entry,
        message:
          entry.type === 'success'
            ? entry.message
            : entry.message === 'Bearbeitungseinheit nicht gefunden!'
            ? 'Bearbeitungseinheit nicht gefunden!'
            : 'Fehlgeschlagen. Bitte erneut scannen!',
        timestamp: entry.createdAt.toISOString(),
      }))
    )
}

type SuccessCountArgs = {
  userId: number
}

export const successCount: QueryResolvers['successCount'] = async ({
  userId,
}: SuccessCountArgs) => {
  const terminal = await terminalByUserId({ userId })
  const permission = (await db.user.findUnique({ where: { id: userId } }))
    .showSuccessCounter

  return permission
    ? db.log.count({
        where: {
          AND: [
            { user: { id: userId } },
            { type: 'success' },
            { createdAt: { gte: terminal.loggedInAt } },
          ],
        },
      })
    : null
}
