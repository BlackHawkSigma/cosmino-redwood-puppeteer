import { MutationResolvers } from 'types/graphql'

import { emitter } from 'src/functions/graphql'
import AsyncLock from 'src/lib/async-lock'
import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import {
  contexts,
  CreateBuchungArgs,
  createBuchungWithUser,
  CreateContextArgs,
  createContextWithUser,
  killContextWithUser,
} from 'src/lib/puppeteer'
import { updateLogAndCounter, updateSingleLog } from 'src/services/buchungen'
import { checkHUforFaultMessage } from 'src/services/checkHU'
import { unclaimTerminal, updateTerminal } from 'src/services/terminal'

const TRANSACTION_LIMIT = 50
const ERROR_LIMIT = 3
const EXECUTION_TIMEOUT = 60_000

export const cosminoSessions = () => {
  return [...contexts.entries()]
    .sort((a, b) => +a[0] - +b[0])
    .map((session) => {
      const username = session[0]

      return {
        id: username,
        user: username,
        transactions: session[1].transactionsHandled,
      }
    })
}

export const lockStatistics = () => {
  return userLock.getStats()
}

type CreateSessionInput = {
  input: CreateContextArgs
}

export const createSession = async ({ input }: CreateSessionInput) => {
  requireAuth({ roles: 'user' })

  const { directMode } = await db.user.findUnique({
    where: { name: input.username },
  })
  const type = directMode ? 'direct' : 'popup'

  return createContextWithUser({ ...input, type })
}

export const killSession: MutationResolvers['killSession'] = async ({
  username,
}) => {
  const user = await db.user.findUnique({ where: { name: username } })
  const terminal = await db.terminal.findUnique({ where: { userId: user.id } })

  const [unclaimed, killed] = await Promise.all([
    terminal ? unclaimTerminal({ id: terminal.id }) : Promise.resolve(true),
    killContextWithUser(username),
  ])

  return unclaimed && killed
}

const userLock = new AsyncLock({ maxExecutionTime: EXECUTION_TIMEOUT })

export const refreshSession: MutationResolvers['refreshSession'] = async ({
  username,
}) => {
  const user = await db.user.findUnique({ where: { name: username } })

  try {
    return await userLock.acquire(username, async () => {
      await killContextWithUser(username)
      return await createContextWithUser({
        username,
        userpwd: user.password,
        type: user.directMode ? 'direct' : 'popup',
      })
    })
  } catch (error) {
    logger.error(`refreshSession timeout for user ${username}:`, error)
    // Clean up any stuck context
    await killContextWithUser(username)
    return false
  }
}

type CreateBuchungInput = {
  input: CreateBuchungArgs & { terminalId: number }
}

export const createBuchung: MutationResolvers['createBuchung'] = async ({
  input,
}: CreateBuchungInput) => {
  requireAuth({ roles: 'user' })
  const { id, name } = context.currentUser

  try {
    return await userLock.acquire(name, async () => {
      await updateTerminal({ id: input.terminalId, input: { busy: true } })

      let logId: number = null
      const start = new Date().valueOf()
      try {
        const result = await createBuchungWithUser({ username: name, ...input })
        const duration = new Date().valueOf() - start

        const { message, type } = result

        const log = await db.log.create({
          data: {
            userId: id,
            terminal: input.terminalId.toString(),
            code: input.code,
            type,
            faultStatus: 'pending',
            message,
            duration,
          },
        })
        logId = log.id

        if (result.type === 'success') {
          // Reset error counter on success
          const ctx = contexts.get(name)
          if (ctx) {
            contexts.set(name, { ...ctx, consecutiveErrors: 0 })
          }

          await updateTerminal({
            id: input.terminalId,
            input: { lastSuccessImgUrl: result.imageUrl },
          })
        } else {
          // Only increment error counter for technical errors, not business errors
          if (!result.isBusinessError) {
            const ctx = contexts.get(name)
            if (ctx) {
              contexts.set(name, {
                ...ctx,
                consecutiveErrors: ctx.consecutiveErrors + 1,
              })
            }
          }

          await updateTerminal({
            id: input.terminalId,
            input: { lastSuccessImgUrl: null },
          })
        }

        return {
          ...result,
          id: log.id,
          code: input.code,
          timestamp: log.createdAt.toISOString(),
        }
      } catch (error) {
        logger.error(error)

        // Increment error counter on exception
        const ctx = contexts.get(name)
        if (ctx) {
          contexts.set(name, {
            ...ctx,
            consecutiveErrors: ctx.consecutiveErrors + 1,
          })
        }

        await updateTerminal({
          id: input.terminalId,
          input: { lastSuccessImgUrl: null },
        })
        const duration = new Date().valueOf() - start

        const log = await db.log.create({
          data: {
            userId: id,
            terminal: input.terminalId.toString(),
            code: input.code,
            type: 'error',
            faultStatus: 'none',
            message: error.message,
            duration,
          },
        })
        logId = log.id

        return {
          id: log.id,
          code: input.code,
          timestamp: log.createdAt.toISOString(),
          type: 'error',
          message: 'Fehlgeschlagen',
        }
      } finally {
        // refresh Session if needed
        const ctx = contexts.get(name)
        const transactions = ctx?.transactionsHandled || 0
        const errors = ctx?.consecutiveErrors || 0

        if (transactions >= TRANSACTION_LIMIT) {
          logger.info(
            `Refreshing session for ${name}: transaction limit reached`
          )
          refreshSession({ username: name })
        } else if (errors >= ERROR_LIMIT) {
          logger.info(
            `Refreshing session for ${name}: ${errors} consecutive errors`
          )
          refreshSession({ username: name })
        }

        // Check if HU was registered by Cosmino and if there is a fault message
        if (logId) {
          setTimeout(async () => {
            try {
              const result = await checkHUforFaultMessage(input.code)

              if (result !== null) {
                const { faultStatus, datum: checkedAt } = result

                await db.log.update({
                  where: { id: logId },
                  data: {
                    faultStatus,
                    checkedAt,
                  },
                })

                await updateSingleLog({ userId: id, logId })

                emitter.emit('invalidate', { type: 'BuchungsLog' })
              }
            } catch (err) {
              logger.error(err)
            }
          }, 1 * 60_000)
        }

        await updateTerminal({ id: input.terminalId, input: { busy: false } })
        if (logId) {
          await updateLogAndCounter({ userId: id, logId })
        }

        emitter.emit('invalidate', { type: 'BuchungsLog' })
      }
    })
  } catch (error) {
    // Handle AsyncLock timeout gracefully
    logger.error(`createBuchung timeout for user ${name}:`, error)

    // Increment error counter on timeout
    const ctx = contexts.get(name)
    if (ctx) {
      contexts.set(name, {
        ...ctx,
        consecutiveErrors: ctx.consecutiveErrors + 1,
      })
    }

    // Clean up any stuck context
    await killContextWithUser(name)

    // Ensure terminal is not left in busy state
    await updateTerminal({ id: input.terminalId, input: { busy: false } })

    // Create error log entry
    const errorLog = await db.log.create({
      data: {
        userId: id,
        terminal: input.terminalId.toString(),
        code: input.code,
        type: 'error',
        faultStatus: 'none',
        message: 'Operation timed out - system may be overloaded',
        duration: EXECUTION_TIMEOUT, // timeout duration
      },
    })

    await updateLogAndCounter({ userId: id, logId: errorLog.id })
    emitter.emit('invalidate', { type: 'BuchungsLog' })

    return {
      id: errorLog.id,
      code: input.code,
      timestamp: errorLog.createdAt.toISOString(),
      type: 'error',
      message: 'System timeout - please try again',
    }
  }
}
