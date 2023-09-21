import type { CosminoSessionsQuery } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import SessionCard from 'src/components/SessionCard'

export const QUERY = gql`
  query CosminoSessionsQuery {
    cosminoSessions {
      id
      user
      transactions
    }
  }
`

export const beforeQuery = (props) => {
  return { variables: props, fetchPolicy: 'no-cache', pollInterval: 1_000 }
}

export const Loading = () => <div>Lade...</div>

export const Empty = () => <div>keine Cosmino Verbindungen aktiv</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({
  cosminoSessions,
}: CellSuccessProps<CosminoSessionsQuery>) => {
  return (
    <div className="flex justify-around">
      {cosminoSessions.map((session) => {
        return (
          <SessionCard
            key={session.id}
            user={{ name: session.user }}
            transactions={session.transactions}
          />
        )
      })}
    </div>
  )
}
