import { MutationResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'
import { codeLogger, logger } from 'src/lib/logger'
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

import { checkHU } from '../checkHU/checkHU'

export const sessions = () => {
  return [...contexts.entries()]
    .sort((a, b) => +a[0] - +b[0])
    .map((session) => {
      const username = session[0]
      const { busy } = session[1]

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
  await deleteActiveSession({ username })
  return killContextWithUser(username)
}

type CreateBuchungInput = {
  input: CreateBuchungArgs & { terminal: string }
}

export const createBuchung: MutationResolvers['createBuchung'] = async ({
  input,
}: CreateBuchungInput) => {
  requireAuth({ roles: 'user' })
  const { id, name } = context.currentUser

  codeLogger.trace({ id, input })

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
      setTimeout(async () => {
        const result = await checkHU(input.code)
        console.log(JSON.stringify({ result, input }))

        if (result.data.abnahmebuchung === null) {
          logger.warn(`retry ${input.code}`)
          createBuchung({ input })
        } else {
          await db.log.update({
            where: { id: log.id },
            data: { checkedAt: result.data.abnahmebuchung.datum },
          })
        }
      }, 30_000)

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
}
