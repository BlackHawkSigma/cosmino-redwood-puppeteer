type SessionCardProps = {
  user: string
  busy: boolean
}

const SessionCard = ({ user, busy }: SessionCardProps) => {
  return (
    <div className="h-20 rounded p-2 shadow-md">
      <p className="text-xl">{user}</p>
      <p>{busy && <span className="animate-pulse">buchung läuft</span>}</p>
    </div>
  )
}

export default SessionCard
