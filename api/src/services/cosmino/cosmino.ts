import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'
import {
  contexts,
  CreateBuchungArgs,
  createBuchungWithTerminal,
  CreateContextArgs,
  createContextWithUser,
  killContextwithTerminal,
} from 'src/lib/puppeteer'

export const sessions = () => {
  return [...contexts.entries()]
    .sort((a, b) => +a[0] - +b[0])
    .map((session) => {
      const terminal = session[0]
      const { username, busy } = session[1]

      return {
        terminal,
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
  terminal: string
}
export const killSession = ({ terminal }: KillSessionInput) => {
  return killContextwithTerminal(terminal)
}

type CreateBuchungInput = {
  input: CreateBuchungArgs
}

export const createBuchung = async ({ input }: CreateBuchungInput) => {
  requireAuth({ roles: 'user' })
  const { id } = context.currentUser
  const result = await createBuchungWithTerminal({ ...input })

  await db.log.create({
    data: {
      userId: id,
      terminal: input.terminal,
      code: input.code,
      message: result,
    },
  })
  return result
}
