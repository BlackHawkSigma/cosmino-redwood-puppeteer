import { parseISO } from 'date-fns/fp'
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

export const Loading = () => <div>Lade Daten...</div>

export const Empty = () => <div>Keine Daten gefunden</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({
  missingTransactions,
}: CellSuccessProps<MissingTransactionsQuery>) => {
  return (
    <div className="p-4">
      <table className="w-1/2 table-auto">
        <thead>
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
