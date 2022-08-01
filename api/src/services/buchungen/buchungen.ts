import type { QueryResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

import { activeSessions } from '../sessions'

export const lastFiveLogsByUser: QueryResolvers['lastFiveLogsByUser'] = async ({
  username,
}) => {
  const sessions = await activeSessions()
  const session = sessions.find((session) => session.username === username)

  return db.log
    .findMany({
      where: {
        AND: [
          { user: { name: username } },
          { createdAt: { gte: session.createdAt } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })
    .then((result) =>
      result.map((entry) => ({
        ...entry,
        timestamp: entry.createdAt.toISOString(),
      }))
    )
}
