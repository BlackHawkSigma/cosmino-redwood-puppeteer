import type { MutationResolvers } from 'types/graphql'

import { context } from '@redwoodjs/graphql-server'

type Session = {
  username: string
  terminal: string
  busy: boolean
  focused: boolean
  createdAt: Date
}

const sessions: Map<string, Session> = new Map()

export const activeSessions = (): Session[] => {
  return [...sessions.values()]
}

export const createActiveSession: MutationResolvers['createActiveSession'] = ({
  input,
}): Session => {
  const { name } = context.currentUser

  sessions.set(name, {
    ...input,
    username: name,
    busy: false,
    focused: true,
    createdAt: new Date(),
  })
  return sessions.get(name)
}

// type updateActiveSessionArgs = {
//   username: string
//   input: {
//     focused?: boolean
//     busy?: boolean
//   }
// }

export const updateActiveSession: MutationResolvers['updateActiveSession'] = ({
  input,
}): Session | null => {
  const { name } = context.currentUser
  const session = sessions.get(name)
  if (!session) return null

  sessions.set(name, { ...session, ...input })
  const userSession = sessions.get(name)
  return userSession
}

export const deleteActiveSession: MutationResolvers['deleteActiveSession'] =
  (): Session | null => {
    const { name } = context.currentUser

    const userSession = sessions.get(name)
    sessions.delete(name)
    return userSession || null
  }
