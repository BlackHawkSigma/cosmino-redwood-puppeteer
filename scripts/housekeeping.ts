import { copyFile } from 'fs/promises'

import { db } from 'api/src/lib/db'
import { subBusinessDays } from 'date-fns'

export default async () => {
  // create a backup
  const timestamp = new Date().toISOString().split('T')[0]
  const dbFile = process.env.DATABASE_URL.split('/')[1] // file:./dev.db

  await copyFile(`api/db/${dbFile}`, `api/db/${timestamp}-${dbFile}`)

  // throw away old logs
  const oneDayAgo = subBusinessDays(new Date(), 1)
  await db.log.deleteMany({
    where: {
      createdAt: { lt: oneDayAgo },
    },
  })
  await db.$disconnect()
}
