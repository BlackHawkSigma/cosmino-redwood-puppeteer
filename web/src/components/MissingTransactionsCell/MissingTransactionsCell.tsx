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
  const countValidCodes = missingTransactions.filter(
    (item) => item.code.length === 9
  ).length
  const countInvalidCodes = missingTransactions.filter(
    (item) => item.code.length !== 9
  ).length

  useEffect(() => {
    hasItems(countValidCodes > 0)
  }, [countValidCodes, hasItems])

  return (
    <div className="p-4">
      <table className="w-full table-auto">
        <caption>
          {countValidCodes} fehlende und {countInvalidCodes} fehlerhafte
          Buchungen
        </caption>
        <thead className="text-left">
          <tr>
            <th>Barcode (HU)</th>
            <th>Persnr.</th>
            <th>Zeitpunkt</th>
          </tr>
        </thead>
        <tbody>
          {missingTransactions.map((item) => {
            const isInvalid = item.code.length !== 9

            return (
              <tr
                key={item.id}
                className={`${
                  isInvalid ? 'bg-red-100 text-red-700' : 'bg-white'
                } hover:brightness-75`}
              >
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
