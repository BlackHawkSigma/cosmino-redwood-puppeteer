import { parseISO } from 'date-fns/fp'

export type Logs = {
  id: number
  timestamp: string
  code: string
  type: string
  message: string
}

type BuchenLogProps = {
  logs: Logs[]
}

const BuchungLog = ({ logs }: BuchenLogProps) => {
  const sortedLogs = logs
    .map((log) => ({ ...log, date: parseISO(log.timestamp) }))
    .sort((a, b) => b.date.valueOf() - a.date.valueOf())

  return (
    <div className="p-4">
      <ol className="flex flex-col gap-3">
        {sortedLogs.map(({ id, date, code, message, type }) => {
          return (
            <li
              key={id}
              className={`border-l-4 p-2 ${
                type === 'success'
                  ? 'border-l-emerald-600 bg-emerald-50 text-emerald-600'
                  : type === 'error'
                  ? 'border-l-red-600 bg-red-100 text-red-600'
                  : null
              }`}
            >
              {date.toLocaleTimeString('de-DE')} | {code}: {message}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default BuchungLog
