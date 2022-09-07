import type { MissingTransactionsQuery } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

export const QUERY = gql`
  query MissingTransactionsQuery($startTime: DateTime!, $endTime: DateTime!) {
    missingTransactions(startTime: $startTime, endTime: $endTime) {
      id
      code
      personalnummer
      createdAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({
  missingTransactions,
}: CellSuccessProps<MissingTransactionsQuery>) => {
  return (
    <ul>
      {missingTransactions.map((item) => {
        return <li key={item.id}>{JSON.stringify(item)}</li>
      })}
    </ul>
  )
}
