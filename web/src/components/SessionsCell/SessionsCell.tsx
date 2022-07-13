import type { SessionsQuery } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

export const QUERY = gql`
  query SessionsQuery {
    sessions {
      user
      terminal
      busy
    }
  }
`

export const beforeQuery = (props) => {
  return { variables: props, fetchPolicy: 'no-cache', pollInterval: 1000 }
}

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ sessions }: CellSuccessProps<SessionsQuery>) => {
  return (
    <ul>
      {sessions.map((item) => {
        return <li key={item.terminal}>{JSON.stringify(item)}</li>
      })}
    </ul>
  )
}
