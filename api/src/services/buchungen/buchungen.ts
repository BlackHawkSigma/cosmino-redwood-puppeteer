import type { QueryResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const lastFiveLogsByUser: QueryResolvers['lastFiveLogsByUser'] = async ({
  username,
}) => {
  return db.log
    .findMany({
      where: { user: { name: username } },
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
