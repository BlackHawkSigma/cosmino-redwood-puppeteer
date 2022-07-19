import { parseISO } from 'date-fns/fp'

export type Logs = {
  timestamp: Date | string
  code: string
  type: string
  message: string
}

type BuchenLogProps = {
  logs: Logs[]
}

const BuchungLog = ({ logs }: BuchenLogProps) => {
  return (
    <div className="p-4 text-3xl">
      <ol className="flex flex-col gap-3">
        {logs.map(({ timestamp, code, message, type }) => {
          const date =
            timestamp instanceof Date ? timestamp : parseISO(timestamp)
          return (
            <li
              className={`border-l-4 p-2 ${
                type === 'success'
                  ? 'border-l-emerald-600 bg-emerald-50 text-emerald-600'
                  : type === 'error'
                  ? 'border-l-red-600 bg-red-100 text-red-600'
                  : null
              }`}
              key={code}
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
