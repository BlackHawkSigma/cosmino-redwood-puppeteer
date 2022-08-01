import { useMutation } from '@redwoodjs/web'

import { QUERY as SessionsQuery } from 'src/components/SessionsCell'

type SessionCardProps = {
  user: string
  busy?: boolean
}

const KILL_SESSION_MUTUTAION = gql`
  mutation KillCosminoSessionMutation($username: String!) {
    killSession(username: $username)
  }
`

const SessionCard = ({ user, busy }: SessionCardProps) => {
  const [killSession] = useMutation(KILL_SESSION_MUTUTAION, {
    variables: { username: user },
    refetchQueries: [{ query: SessionsQuery }],
  })

  return (
    <div className="h-20 rounded p-2 shadow-md">
      <div className="flex items-baseline justify-between">
        <p className="text-xl">{user}</p>
        <button
          title="Cosmino Sitzung Beenden"
          className="ml-4 px-2 font-mono font-bold"
          onClick={() => killSession()}
        >
          X
        </button>
      </div>
      <p>{busy && <span className="animate-pulse">buchung läuft</span>}</p>
    </div>
  )
}

export default SessionCard
