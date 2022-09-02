import { MutationResolvers } from 'types/graphql'

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

import { unclaimTerminal, updateTerminal } from '../terminal'

export const sessions = () => {
  return [...contexts.entries()]
    .sort((a, b) => +a[0] - +b[0])
    .map((session) => {
      const username = session[0]

      // todo: remove
      const busy = false

      return {
        user: username,
        busy,
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

      return {
        id: log.id,
        code: input.code,
        timestamp: log.createdAt.toISOString(),
        type: 'error',
        message: 'Fehlgeschlagen. Bitte erneut scannen!',
      }
    } finally {
      await updateTerminal({ id: input.terminalId, input: { busy: false } })
    }
  })
}
