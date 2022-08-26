import type { MutationResolvers } from 'types/graphql'

import { context } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'
import { killContextWithUser } from 'src/lib/puppeteer'

type Session = {
  id: string
  user: {
    id: number
    name: string
  }
  terminal: string
  busy: boolean
  focused: boolean
  lastSuccessImgUrl?: string
  createdAt: Date
}

export const activeSessions = async (): Promise<Session[]> => {
  return db.session
    .findMany({ include: { user: { select: { id: true, name: true } } } })
    .then((result) =>
      result.map((entry) => ({
        ...entry,
        id: entry.terminal,
      }))
    )
}

export const userSession = ({ userId }) => {
  return db.session.findUnique({
    where: { userId },
  })
}

export const createActiveSession: MutationResolvers['createActiveSession'] =
  async ({ input }) => {
    const { id: userId, name } = context.currentUser

    return db.session
      .upsert({
        where: { userId },
        create: {
          terminal: input.terminal,
          busy: false,
          focused: true,
          user: { connect: { name } },
        },
        update: { terminal: input.terminal, busy: false, focused: true },
        include: { user: true },
      })
      .then((entry) => ({ ...entry, id: entry.terminal }))
  }

type updateActiveSessionArgs = {
  input: {
    focused?: boolean
    busy?: boolean
    lastSuccessImgUrl?: string
  }
}

export const updateActiveSession = async ({
  input,
}: updateActiveSessionArgs): Promise<Session> => {
  const { id: userId } = context.currentUser

  return db.session
    .update({
      where: { userId },
      data: { ...input },
      include: { user: { select: { id: true, name: true } } },
    })
    .then((entry) => ({ ...entry, id: entry.terminal }))
}

export const deleteActiveSession: MutationResolvers['deleteActiveSession'] =
  async ({ username }) => {
    const user = await db.user.findUnique({ where: { name: username } })
    await killContextWithUser(username)

    return db.session.delete({ where: { userId: user.id } })
  }
