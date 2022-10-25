import type { Log } from '@prisma/client'
import type { QuerylastLogsByUserArgs, QueryResolvers } from 'types/graphql'

import { db } from 'src/lib/db'
import { terminalByUserId } from 'src/services/terminal'

type LogsMap = Log & {
  timestamp: string
}

const logsMap = new Map<number, LogsMap[]>()
const successCounterMap = new Map<number, number | null>()

export const getLastLogsByUser = async ({
  count,
  userId,
}: QuerylastLogsByUserArgs) => {
  if (logsMap.has(userId)) {
    return logsMap.get(userId)
  }

  const terminal = await terminalByUserId({ userId })

  const result = await db.log
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
    .then((result) => result.map(extentResult))

  logsMap.set(userId, result)
  return result
}

export const lastLogsByUser: QueryResolvers['lastLogsByUser'] = ({
  count,
  userId,
}) => getLastLogsByUser({ count, userId })

export const getSuccessCount = async ({ userId }) => {
  if (successCounterMap.has(userId)) {
    return successCounterMap.get(userId)
  }

  const terminal = await terminalByUserId({ userId })
  const permission = (await db.user.findUnique({ where: { id: userId } }))
    .showSuccessCounter

  const result = permission
    ? await db.log.count({
        where: {
          AND: [
            { user: { id: userId } },
            { type: 'success' },
            { createdAt: { gte: terminal.loggedInAt } },
          ],
        },
      })
    : null

  successCounterMap.set(userId, result)

  return result
}
export const successCount: QueryResolvers['successCount'] = ({ userId }) =>
  getSuccessCount({ userId })

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

export const updateLogAndCounter = async ({ userId, logId }) => {
  const log = await db.log
    .findUnique({ where: { id: logId } })
    .then(extentResult)

  const currentLogs = logsMap.get(userId) ?? []
  currentLogs.push(log)
  logsMap.set(userId, currentLogs.slice(-5))

  const permission = (await db.user.findUnique({ where: { id: userId } }))
    .showSuccessCounter

  if (permission && log.type === 'success') {
    successCounterMap.set(userId, (successCounterMap.get(userId) ?? 0) + 1)
  }
}

const extentResult = (entry: Log) => ({
  ...entry,
  message:
    entry.type === 'success'
      ? entry.message
      : entry.message === 'Bearbeitungseinheit nicht gefunden!'
      ? 'Bearbeitungseinheit nicht gefunden!'
      : 'Fehlgeschlagen. Bitte erneut scannen!',
  timestamp: entry.createdAt.toISOString(),
})
