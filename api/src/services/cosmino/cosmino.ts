import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'
import {
  contexts,
  CreateBuchungArgs,
  createBuchungWithUser,
  CreateContextArgs,
  createContextWithUser,
  killContextWithUser,
} from 'src/lib/puppeteer'

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
export const killSession = ({ username }: KillSessionInput) => {
  return killContextWithUser(username)
}

type CreateBuchungInput = {
  input: CreateBuchungArgs & { terminal: string }
}

export const createBuchung = async ({ input }: CreateBuchungInput) => {
  requireAuth({ roles: 'user' })
  const { id, name } = context.currentUser
  const result = await createBuchungWithUser({ username: name, ...input })
  const { message } = result

  await db.log.create({
    data: {
      userId: id,
      terminal: input.terminal,
      code: input.code,
      message,
    },
  })

  return { ...result, code: input.code }
}
