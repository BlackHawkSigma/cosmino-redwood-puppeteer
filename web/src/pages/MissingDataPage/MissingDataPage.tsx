import { useState } from 'react'

import { format, isValid, startOfHour, subMinutes } from 'date-fns'
import type { StartReruns, StartRerunsVariables } from 'types/graphql'

import { MetaTags, useMutation } from '@redwoodjs/web'

import MissingTransactionsCell from 'src/components/MissingTransactionsCell'

const RERUN_MUTATION = gql`
  mutation StartReruns($startTime: DateTime!, $endTime: DateTime!) {
    rerunMissingTransactions(startTime: $startTime, endTime: $endTime)
  }
`

const MissingDataPage = () => {
  const [startTime, setStartTime] = useState<Date>(startOfHour(new Date()))
  const [endTime, setEndTime] = useState<Date>(subMinutes(new Date(), 5))
  const [nachbuchenIsEnabled, setNachbuchenIsEnabled] = useState(false)

  const [timeSet, setTimeSet] = useState([])

  const handleClick = () => {
    setTimeSet([startTime.toISOString(), endTime.toISOString()])
  }

  const [mutation, { loading, error }] = useMutation<
    StartReruns,
    StartRerunsVariables
  >(RERUN_MUTATION, {})

  const startRerun = () => {
    mutation({
      variables: {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      },
    })
  }

  const formatToDatetimeLocal = (date: Date): string =>
    format(date, "yyyy-MM-dd'T'hh:mm")

  return (
    <>
      <MetaTags title="Fehlende Buchungen" description="Fehlende Buchungen" />

      <section className="container mx-auto pt-6">
        <h1 className="text-xl">Fehlende Buchungen</h1>

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
          <button className="rw-button rw-button-blue" onClick={handleClick}>
            laden
          </button>
          {nachbuchenIsEnabled && (
            <button
              disabled={loading}
              className="rw-button rw-button-red disabled:pointer-events-none disabled:cursor-not-allowed"
              onClick={startRerun}
            >
              {loading ? 'läuft' : 'nachbuchen'}
            </button>
          )}
        </div>

        <div>{error && <span>{error.message}</span>}</div>

        {timeSet.length === 2 && (
          <MissingTransactionsCell
            hasItems={setNachbuchenIsEnabled}
            startTime={timeSet[0]}
            endTime={timeSet[1]}
          />
        )}
      </section>
    </>
  )
}

export default MissingDataPage
