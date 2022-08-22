import { MutationResolvers } from 'types/graphql'

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
  id: number
  username: string
}
export const killSession = async ({ id, username }: KillSessionInput) => {
  await unclaimTerminal({ id })
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

  await updateTerminal({ id: input.terminal, input: { busy: true } })
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
      await updateTerminal({
        id: input.terminal,
        input: { lastSuccessImgUrl: result.imageUrl },
      })
    } else {
      await updateTerminal({
        id: input.terminal,
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
      id: input.terminal,
      input: { lastSuccessImgUrl: null },
    })

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
    await updateTerminal({ id: input.terminal, input: { busy: false } })
  }
}
