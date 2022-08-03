import type { MutationResolvers } from 'types/graphql'

import { context } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

type Session = {
  id: string
  username: string
  terminal: string
  busy: boolean
  focused: boolean
  lastSuccessImgUrl?: string
  createdAt: Date
}

export const activeSessions = async (): Promise<Session[]> => {
  return db.session
    .findMany({ include: { user: { select: { name: true } } } })
    .then((result) =>
      result.map((entry) => ({
        ...entry,
        id: entry.terminal,
        username: entry.user.name,
      }))
    )
}

export const createActiveSession: MutationResolvers['createActiveSession'] =
  async ({ input }): Promise<Session> => {
    const { id: userId, name } = context.currentUser

    return db.session
      .upsert({
        where: { userId },
        create: {
          ...input,
          busy: false,
          focused: true,
          user: { connect: { name } },
        },
        update: { ...input, busy: false, focused: true },
      })
      .then((entry) => ({ ...entry, id: entry.terminal, username: name }))
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
  const { id: userId, name } = context.currentUser

  return db.session
    .update({
      where: { userId },
      data: { ...input },
    })
    .then((entry) => ({ ...entry, id: entry.terminal, username: name }))
}

export const deleteActiveSession: MutationResolvers['deleteActiveSession'] =
  () => {
    const { id: userId } = context.currentUser
    return db.session.delete({ where: { userId } })
  }
