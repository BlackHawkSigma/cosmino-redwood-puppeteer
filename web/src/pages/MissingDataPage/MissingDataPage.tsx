import { useState } from 'react'

import { format, isValid, startOfHour, subMinutes } from 'date-fns'
import type {
  StartReruns,
  StartRerunsVariables,
  StartRecheck,
  StartRecheckVariables,
} from 'types/graphql'

import { MetaTags, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast'

import { useAuth } from 'src/auth'
import MissingTransactionsCell, {
  QUERY,
} from 'src/components/MissingTransactionsCell'

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

const MissingDataPage = () => {
  const { hasRole } = useAuth()
  const [startTime, setStartTime] = useState<Date>(startOfHour(new Date()))
  const [endTime, setEndTime] = useState<Date>(subMinutes(new Date(), 5))
  const [nachbuchenIsEnabled, setNachbuchenIsEnabled] = useState(false)

  const [timeSet, setTimeSet] = useState([])

  const handleClick = () => {
    setTimeSet([startTime.toISOString(), endTime.toISOString()])
  }

  const [rerunMutation, { loading: rerunLoading, error }] = useMutation<
    StartReruns,
    StartRerunsVariables
  >(RERUN_MUTATION, {
    variables: {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    },
    onCompleted(data) {
      toast.success(`${data.rerunMissingTransactions} Buchungen nachgetragen`)
    },
  })

  const [recheckMutation, { loading: recheckLoading }] = useMutation<
    StartRecheck,
    StartRecheckVariables
  >(RECHECK_MUTATION, {
    variables: {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    },
    refetchQueries: [
      {
        query: QUERY,
        variables: {
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        },
      },
    ],
    onCompleted() {
      toast.success('aktualisiert')
    },
  })

  const formatToDatetimeLocal = (date: Date): string =>
    format(date, "yyyy-MM-dd'T'HH:mm")

  return (
    <>
      <MetaTags title="Fehlende Buchungen" description="Fehlende Buchungen" />

      <section className="container mx-auto pt-6">
        <h1 className="mb-8 text-center text-2xl">Fehlende Buchungen</h1>

        <div className="flex justify-between">
          <div>
            <div className="flex w-72 flex-col gap-2">
              <label className="rw-label">
                Von{' '}
                <input
                  type="datetime-local"
                  className="rw-input"
                  defaultValue={formatToDatetimeLocal(startTime)}
                  onInput={({ target }) => {
                    // @ts-expect-error value does not exist
                    if (isValid(new Date(target.value))) {
                      // @ts-expect-error value does not exist
                      setStartTime(new Date(target.value))
                    }
                  }}
                />
              </label>
              <label className="rw-label">
                Bis{' '}
                <input
                  type="datetime-local"
                  className="rw-input"
                  max={formatToDatetimeLocal(subMinutes(new Date(), 5))}
                  defaultValue={formatToDatetimeLocal(endTime)}
                  onInput={({ target }) => {
                    // @ts-expect-error value does not exist
                    if (isValid(new Date(target.value))) {
                      // @ts-expect-error value does not exist
                      setEndTime(new Date(target.value))
                    }
                  }}
                />
              </label>
              <button
                className="rw-button rw-button-blue"
                onClick={handleClick}
              >
                laden
              </button>
              {nachbuchenIsEnabled && (
                <button
                  disabled={recheckLoading}
                  className="rw-button rw-button-green disabled:pointer-events-none disabled:cursor-not-allowed"
                  onClick={() => recheckMutation()}
                >
                  {recheckLoading ? 'läuft' : 'erneut prüfen'}
                </button>
              )}
              {nachbuchenIsEnabled && hasRole('admin') && (
                <button
                  disabled={rerunLoading}
                  className="rw-button rw-button-red disabled:pointer-events-none disabled:cursor-not-allowed"
                  onClick={() => rerunMutation()}
                >
                  {rerunLoading ? 'läuft' : 'nachbuchen'}
                </button>
              )}
            </div>

            <div>{error && <span>{error.message}</span>}</div>
          </div>
          <div className="w-1/2">
            {timeSet.length === 2 && (
              <MissingTransactionsCell
                hasItems={setNachbuchenIsEnabled}
                startTime={timeSet[0]}
                endTime={timeSet[1]}
              />
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default MissingDataPage
