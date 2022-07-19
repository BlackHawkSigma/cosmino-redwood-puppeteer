import type { MutationResolvers, QueryResolvers } from 'types/graphql'

type Session = {
  username: string
  terminal: string
  busy: boolean
  focused: boolean
  createdAt: Date
}

const sessions: Map<string, Session> = new Map()

export const activeSessions: QueryResolvers['activeSessions'] = () => {
  return [...sessions.values()]
}

export const createActiveSession: MutationResolvers['createActiveSession'] = ({
  input,
}) => {
  sessions.set(input.username, {
    ...input,
    busy: false,
    focused: true,
    createdAt: new Date(),
  })
  return sessions.get(input.username)
}

export const deleteActiveSession: MutationResolvers['deleteActiveSession'] = ({
  username,
}) => {
  const userSession = sessions.get(username)
  sessions.delete(username)
  return userSession || null
}
