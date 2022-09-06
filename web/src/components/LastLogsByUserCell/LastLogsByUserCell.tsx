import type {
  FindLastLogsByUserQuery,
  FindLastLogsByUserQueryVariables,
} from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import BuchungLog from 'src/components/BuchungLog'

export const QUERY = gql`
  query FindLastLogsByUserQuery($userId: Int!, $count: Int!) {
    logs: lastLogsByUser(userId: $userId, count: $count) {
      id
      timestamp
      code
      message
      type
    }
    successCount(userId: $userId)
  }
`

export const beforeQuery = (props) => {
  return { variables: props, fetchPolicy: 'no-cache', pollInterval: 1_000 }
}

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>noch keine Buchungen vorhanden</div>

export const Failure = ({
  error,
}: CellFailureProps<FindLastLogsByUserQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({
  logs,
  successCount,
}: CellSuccessProps<
  FindLastLogsByUserQuery,
  FindLastLogsByUserQueryVariables
>) => {
  return (
    <div className="text-xl">
      {successCount && (
        <div className="rounded bg-emerald-50 p-2 text-center text-lg">
          {successCount} erfolgreiche{' '}
          {`${successCount === 1 ? 'Buchung' : 'Buchungen'}`}
        </div>
      )}
      <BuchungLog logs={logs} />
    </div>
  )
}
