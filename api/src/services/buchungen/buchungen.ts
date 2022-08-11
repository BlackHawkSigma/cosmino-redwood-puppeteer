import type { QueryResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

import { userSession } from '../sessions'

export const lastFiveLogsByUser: QueryResolvers['lastFiveLogsByUser'] = async ({
  userId,
}) => {
  const session = await userSession({ userId })

  return db.log
    .findMany({
      where: {
        AND: [
          { user: { id: userId } },
          { createdAt: { gte: session.createdAt } },
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
  const session = await userSession({ userId })
  const permission = (await db.user.findUnique({ where: { id: userId } }))
    .showSuccessCounter

  return permission
    ? db.log.count({
        where: {
          AND: [
            { user: { id: userId } },
            { type: 'success' },
            { createdAt: { gte: session.createdAt } },
          ],
        },
      })
    : null
}
