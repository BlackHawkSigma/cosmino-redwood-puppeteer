import { useEffect } from 'react'

import { parseISO } from 'date-fns/fp'
import type { MissingTransactionsQuery } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

type CellProps = {
  hasItems: (hasItems: boolean) => void
}

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

export const Loading = ({ hasItems }: CellProps) => {
  useEffect(() => hasItems(false), [hasItems])

  return <div>Lade Daten...</div>
}

export const Empty = ({ hasItems }: CellFailureProps & CellProps) => {
  useEffect(() => hasItems(false), [hasItems])

  return <div>Keine Daten gefunden</div>
}

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({
  missingTransactions,
  hasItems,
}: CellSuccessProps<MissingTransactionsQuery> & CellProps) => {
  useEffect(() => {
    hasItems(missingTransactions.length > 0)
  }, [hasItems, missingTransactions])
  return (
    <div className="p-4">
      <table className="w-full table-auto">
        <thead className="text-left">
          <tr>
            <th>Barcode (HU)</th>
            <th>Persnr.</th>
            <th>Zeitpunkt</th>
          </tr>
        </thead>
        <tbody>
          {missingTransactions
            .filter((item) => item.code.length === 9)
            .map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.code}</td>
                  <td>{item.personalnummer}</td>
                  <td>{parseISO(item.createdAt).toLocaleString('de-DE')}</td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  )
}
