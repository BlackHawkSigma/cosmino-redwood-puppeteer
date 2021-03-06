import type { ActiveSessionsQuery } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import LastFiveLogsByUserCell from 'src/components/LastFiveLogsByUserCell'
import SessionCard from 'src/components/SessionCard'

export const QUERY = gql`
  query ActiveSessionsQuery {
    activeSessions {
      id
      terminal
      user: username
      busy
      focused
      src: lastSuccessImgUrl
    }
  }
`

export const beforeQuery = (props) => {
  return { variables: props, fetchPolicy: 'no-cache', pollInterval: 1_000 }
}

export const Loading = () => <div>Loading...</div>

export const Empty = () => (
  <div className="text-center">Keine Terminals aktiv</div>
)

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

type SuccessProps = {
  terminals: string[]
}

export const Success = ({
  activeSessions,
  terminals,
}: CellSuccessProps<ActiveSessionsQuery> & SuccessProps) => {
  return (
    <div>
      <div className="grid grid-cols-3">
        {terminals.map((terminal) => {
          const session = activeSessions.find(
            (session) => session.terminal === terminal
          )
          return session ? (
            <div key={terminal} className="px-2 shadow">
              <p className="text-center text-lg">Terminal {terminal}</p>
              <div
                className={`rounded-xl border-8 ${
                  session.focused ? 'border-lime-500' : 'border-red-500'
                }`}
              >
                <SessionCard {...session} />
              </div>

              {session.src && <img src={session.src} alt="letze scannung" />}

              <LastFiveLogsByUserCell username={session.user} key={terminal} />
            </div>
          ) : (
            <div key={terminal}></div>
          )
        })}
      </div>
    </div>
  )
}
