import type {
  FindLastFiveLogsByUserQuery,
  FindLastFiveLogsByUserQueryVariables,
} from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import BuchungLog from 'src/components/BuchungLog'

export const QUERY = gql`
  query FindLastFiveLogsByUserQuery($username: String!) {
    logs: lastFiveLogsByUser(username: $username) {
      id
      timestamp
      code
      message
      type
    }
  }
`

export const beforeQuery = (props) => {
  return { variables: props, fetchPolicy: 'no-cache', pollInterval: 1_000 }
}

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>noch keine Buchungen vorhanden</div>

export const Failure = ({
  error,
}: CellFailureProps<FindLastFiveLogsByUserQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({
  logs,
}: CellSuccessProps<
  FindLastFiveLogsByUserQuery,
  FindLastFiveLogsByUserQueryVariables
>) => {
  return (
    <div className="text-xl">
      <BuchungLog logs={logs} />
    </div>
  )
}
