import type { QueryResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

import { terminalByUserId } from '../terminal'

export const lastLogsByUser: QueryResolvers['lastLogsByUser'] = async ({
  count,
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
      take: count,
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

export const successCount: QueryResolvers['successCount'] = async ({
  userId,
}) => {
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

export const missingTransactions: QueryResolvers['missingTransactions'] =
  async ({ startTime, endTime }) => {
    return db.log
      .findMany({
        include: { user: { select: { name: true } } },
        where: {
          AND: [
            { createdAt: { gte: startTime } },
            { createdAt: { lt: endTime } },
            { checkedAt: null },
          ],
        },
      })
      .then((results) =>
        results.map((result) => ({
          ...result,
          createdAt: result.createdAt.toISOString(),
          personalnummer: result.user.name,
        }))
      )
  }
