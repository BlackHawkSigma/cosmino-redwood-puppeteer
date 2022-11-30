import type { Log } from '@prisma/client'
import type {
  MutationResolvers,
  QuerylastLogsByUserArgs,
  QueryResolvers,
} from 'types/graphql'

import { emitter } from 'src/functions/graphql'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import { createBuchungWithUser, killContextWithUser } from 'src/lib/puppeteer'
import { checkHU } from 'src/services/checkHU'
import { cosminoSessions } from 'src/services/cosmino'
import { terminalByUserId } from 'src/services/terminal'

type LogWithTimestamp = Log & {
  timestamp: string
}
type LogsMap = {
  created: number
  logs: LogWithTimestamp[]
}

type SuccessCounterMap = {
  created: number
  count: number | null
}

const logsMap = new Map<number, LogsMap>()
const successCounterMap = new Map<number, SuccessCounterMap>()

const TTL = 3_600_000

export const getLastLogsByUser = async ({
  count,
  userId,
}: QuerylastLogsByUserArgs) => {
  if (logsMap.has(userId)) {
    const map = logsMap.get(userId)
    const now = new Date().valueOf()

    if (now - map.created > TTL) {
      logsMap.delete(userId)
    } else {
      return map.logs
    }
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

  logsMap.set(userId, { logs: result, created: new Date().valueOf() })
  return result
}

export const lastLogsByUser: QueryResolvers['lastLogsByUser'] = ({
  count,
  userId,
}) => getLastLogsByUser({ count, userId })

export const getSuccessCount = async ({ userId }) => {
  if (successCounterMap.has(userId)) {
    const map = successCounterMap.get(userId)
    const now = new Date().valueOf()

    if (now - map.created > TTL) {
      successCounterMap.delete(userId)
    } else {
      return map.count
    }
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

  successCounterMap.set(userId, {
    count: result,
    created: new Date().valueOf(),
  })

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

  const currentLogs = logsMap.get(userId)?.logs ?? []
  currentLogs.push(log)
  logsMap.set(userId, {
    logs: currentLogs.slice(-5),
    created: new Date().valueOf(),
  })

  const permission = (await db.user.findUnique({ where: { id: userId } }))
    .showSuccessCounter

  if (permission && log.type === 'success') {
    const count = (successCounterMap.get(userId)?.count ?? 0) + 1
    successCounterMap.set(userId, { count, created: new Date().valueOf() })
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

export const rerunMissingTransactions: MutationResolvers['rerunMissingTransactions'] =
  async ({ startTime, endTime }) => {
    const list = await db.log.findMany({
      include: { user: { select: { name: true } } },
      where: {
        AND: [
          { createdAt: { gte: startTime } },
          { createdAt: { lt: endTime } },
          { checkedAt: null },
        ],
      },
    })

    // Remove items that can't be valid codes
    const filteredList = list.filter((item) => item.code.length === 9)

    let successCount = 0
    const aktiveSessions = cosminoSessions()

    for (const item of filteredList) {
      try {
        const result = await createBuchungWithUser({
          username: item.user.name,
          code: item.code,
        })
        if (result.type === 'success') {
          successCount++
        }
      } catch (err) {
        logger.error(err)
      }
    }

    const usedSessions = new Set(list.map((item) => item.user.name))

    for (const session of aktiveSessions) {
      usedSessions.delete(session.user)
    }

    for (const username of usedSessions) {
      killContextWithUser(username)
    }

    return successCount
  }

export const recheckMissingTransactions: MutationResolvers['recheckMissingTransactions'] =
  async ({ startTime, endTime }) => {
    const list = await db.log.findMany({
      where: {
        AND: [
          { createdAt: { gte: startTime } },
          { createdAt: { lt: endTime } },
          { checkedAt: null },
        ],
      },
    })

    for (const item of list) {
      const result = await checkHU(item.code)

      if (result.data.abnahmebuchung !== null) {
        await db.log.update({
          where: { id: item.id },
          data: { checkedAt: new Date() },
        })
      }
    }

    emitter.emit('invalidate', { type: 'MissingTransaction' })

    return true
  }
