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
import { updateLogAndCounter } from 'src/services/buchungen'
import { checkHU } from 'src/services/checkHU'
import { unclaimTerminal, updateTerminal } from 'src/services/terminal'

export const cosminoSessions = () => {
  return [...contexts.entries()]
    .sort((a, b) => +a[0] - +b[0])
    .map((session) => {
      const username = session[0]

      return {
        id: username,
        user: username,
      }
    })
}

type CreateSessionInput = {
  input: CreateContextArgs
}

export const createSession = ({ input }: CreateSessionInput) => {
  requireAuth({ roles: 'user' })

  return createContextWithUser(input)
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

type CreateBuchungInput = {
  input: CreateBuchungArgs & { terminalId: number }
}

const userLock = new AsyncLock()

export const createBuchung: MutationResolvers['createBuchung'] = async ({
  input,
}: CreateBuchungInput) => {
  requireAuth({ roles: 'user' })
  const { id, name } = context.currentUser

  return userLock.acquire(name, async () => {
    await updateTerminal({ id: input.terminalId, input: { busy: true } })

    let logId: number = null
    try {
      const result = await createBuchungWithUser({ username: name, ...input })
      const { message, type } = result

      const log = await db.log.create({
        data: {
          userId: id,
          terminal: input.terminalId.toString(),
          code: input.code,
          type,
          message,
        },
      })
      logId = log.id

      if (result.type === 'success') {
        await updateTerminal({
          id: input.terminalId,
          input: { lastSuccessImgUrl: result.imageUrl },
        })
      } else {
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

      await updateTerminal({
        id: input.terminalId,
        input: { lastSuccessImgUrl: null },
      })

      const log = await db.log.create({
        data: {
          userId: id,
          terminal: input.terminalId.toString(),
          code: input.code,
          type: 'error',
          message: error.message,
        },
      })
      logId = log.id

      return {
        id: log.id,
        code: input.code,
        timestamp: log.createdAt.toISOString(),
        type: 'error',
        message: 'Fehlgeschlagen. Bitte erneut scannen!',
      }
    } finally {
      // Check if HU was registered by Cosmino
      setTimeout(async () => {
        const result = await checkHU(input.code)

        if (result.data.abnahmebuchung !== null) {
          await db.log.update({
            where: { id: logId },
            data: { checkedAt: result.data.abnahmebuchung.datum },
          })
        }
      }, 5 * 60_000)

      await updateTerminal({ id: input.terminalId, input: { busy: false } })
      await updateLogAndCounter({ userId: id, logId })

      emitter.emit('invalidate', { type: 'BuchungsLog' })
    }
  })
}
