import { parseISO } from 'date-fns'

import BuchungLogEntry from '../BuchungLogEntry/BuchungLogEntry'

export type Logs = {
  id: number
  timestamp: string
  code: string
  type: string
  message: string
  faultStatus: string
}

type BuchenLogProps = {
  logs: Logs[]
}

const BuchungLog = ({ logs }: BuchenLogProps) => {
  const sortedLogs = logs.sort(
    (a, b) => parseISO(b.timestamp).valueOf() - parseISO(a.timestamp).valueOf()
  )

  return (
    <div className="p-4">
      <ol className="flex flex-col gap-3">
        {sortedLogs.map(({ id, ...data }) => {
          return (
            <li key={id}>
              <BuchungLogEntry id={id} {...data} />
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default BuchungLog
