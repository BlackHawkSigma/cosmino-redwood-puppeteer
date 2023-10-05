import { parseISO } from 'date-fns/fp'
import type {
  MissingTransactionsQuery,
  StartRecheck,
  StartRecheckVariables,
  StartReruns,
  StartRerunsVariables,
} from 'types/graphql'

import {
  type CellSuccessProps,
  type CellFailureProps,
  useMutation,
} from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast'

import { useAuth } from 'src/auth'

const RERUN_MUTATION = gql`
  mutation StartReruns($startTime: DateTime!, $endTime: DateTime!) {
    rerunMissingTransactions(startTime: $startTime, endTime: $endTime)
  }
`

const RECHECK_MUTATION = gql`
  mutation StartRecheck($startTime: DateTime!, $endTime: DateTime!) {
    recheckMissingTransactions(startTime: $startTime, endTime: $endTime)
  }
`

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
  variables,
}: CellSuccessProps<MissingTransactionsQuery>) => {
  const { hasRole } = useAuth()

  const [rerunMutation, { loading: rerunLoading, error }] = useMutation<
    StartReruns,
    StartRerunsVariables
  >(RERUN_MUTATION, {
    variables,
    onCompleted(data) {
      toast.success(`${data.rerunMissingTransactions} Buchungen nachgetragen`)
    },
  })

  const [recheckMutation, { loading: recheckLoading }] = useMutation<
    StartRecheck,
    StartRecheckVariables
  >(RECHECK_MUTATION, {
    variables,
    refetchQueries: ['MissingTransactionsQuery'],
    awaitRefetchQueries: true,
    onCompleted() {
      toast.success('aktualisiert')
    },
  })

  const countValidCodes = missingTransactions.filter(
    (item) => item.code.length === 9
  ).length
  const countInvalidCodes = missingTransactions.filter(
    (item) => item.code.length !== 9
  ).length

  return (
    <div className="p-4">
      <div>{error && <span>{error.message}</span>}</div>
      <div className="my-4 flex gap-2">
        <button
          disabled={recheckLoading}
          className="rw-button rw-button-green disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => recheckMutation()}
        >
          {recheckLoading ? 'läuft' : 'erneut prüfen'}
        </button>

        {hasRole('admin') && (
          <button
            disabled={rerunLoading}
            className="rw-button rw-button-red disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => rerunMutation()}
          >
            {rerunLoading ? 'läuft' : 'nachbuchen'}
          </button>
        )}
      </div>

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
