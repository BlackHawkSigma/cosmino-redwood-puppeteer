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
import {
  deleteActiveSession,
  updateActiveSession,
} from 'src/services/sessions/'

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

type KillSessionInput = {
  username: string
}
export const killSession = async ({ username }: KillSessionInput) => {
  return await Promise.all([
    deleteActiveSession({ username }),
    killContextWithUser(username),
  ])
}

type CreateBuchungInput = {
  input: CreateBuchungArgs & { terminal: string }
}

const userLock = new AsyncLock()

export const createBuchung: MutationResolvers['createBuchung'] = async ({
  input,
}: CreateBuchungInput) => {
  requireAuth({ roles: 'user' })
  const { id, name } = context.currentUser

  return userLock.acquire(name, async () => {
    await updateActiveSession({ input: { busy: true } })

    try {
      const result = await createBuchungWithUser({ username: name, ...input })
      const { message, type } = result

      const log = await db.log.create({
        data: {
          userId: id,
          terminal: input.terminal,
          code: input.code,
          type,
          message,
        },
      })

      if (result.type === 'success') {
        await updateActiveSession({
          input: { lastSuccessImgUrl: result.imageUrl },
        })
      } else {
        await updateActiveSession({ input: { lastSuccessImgUrl: null } })
      }

      return {
        ...result,
        id: log.id,
        code: input.code,
        timestamp: log.createdAt.toISOString(),
      }
    } catch (error) {
      logger.error(error)

      await updateActiveSession({ input: { lastSuccessImgUrl: null } })

      const log = await db.log.create({
        data: {
          userId: id,
          terminal: input.terminal,
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
      await updateActiveSession({ input: { busy: false } })
    }
  })
}
