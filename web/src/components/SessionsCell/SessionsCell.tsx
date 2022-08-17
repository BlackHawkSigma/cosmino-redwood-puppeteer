import type { SessionsQuery } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import SessionCard from 'src/components/SessionCard'

export const QUERY = gql`
  query SessionsQuery {
    sessions {
      user
      busy
    }
  }
`

export const beforeQuery = (props) => {
  return { variables: props, fetchPolicy: 'no-cache', pollInterval: 1_000 }
}

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ sessions }: CellSuccessProps<SessionsQuery>) => {
  return (
    <div className="flex justify-around">
      {sessions.map((session) => {
        return <SessionCard key={session.user} user={{ name: session.user }} />
      })}
    </div>
  )
}
