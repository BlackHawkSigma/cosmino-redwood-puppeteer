import { parseISO } from 'date-fns'

import type { Logs } from '../BuchungLog'

const BuchungLogEntry = ({
  type,
  message,
  code,
  timestamp,
  faultStatus,
}: Logs) => {
  const date = parseISO(timestamp)

  return (
    <div
      className={`flex justify-between gap-1 whitespace-nowrap border-l-4 p-2 ${
        type === 'success'
          ? 'border-l-emerald-600 bg-emerald-50 text-emerald-600'
          : type === 'error'
          ? 'border-l-red-600 bg-red-100 text-red-600'
          : null
      }`}
    >
      <span>{date.toLocaleTimeString('de-DE')}</span>
      <span>|</span>
      <span>{code}:</span>
      <span className="min-w-0 flex-grow truncate px-1">{message}</span>

      <FaultStaus status={faultStatus as FAULT_STATUS} />
    </div>
  )
}

export default BuchungLogEntry

type FAULT_STATUS = 'none' | 'pending' | 'ok' | 'check' | 'scrap'

const FaultStaus = ({ status }: { status: FAULT_STATUS }) => {
  switch (status) {
    case 'ok':
      return <div>&#10003;</div>
    case 'pending':
      return <div className="animate-pulse">...</div>
    case 'check':
      return (
        <div className="animate-pulse font-bold text-red-600">Störmeldung</div>
      )
    case 'scrap':
      return (
        <div className="animate-pulse bg-red-100 px-4 text-xl font-extrabold tracking-widest text-red-600">
          Ausschuss
        </div>
      )
    case 'none':
    default:
      return <></>
  }
}
