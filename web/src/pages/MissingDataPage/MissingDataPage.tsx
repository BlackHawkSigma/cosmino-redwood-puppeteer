import { useState } from 'react'

import { format, isValid, startOfHour, subMinutes } from 'date-fns'

import { MetaTags } from '@redwoodjs/web'

import MissingTransactionsCell from 'src/components/MissingTransactionsCell'

const MissingDataPage = () => {
  const [startTime, setStartTime] = useState<Date>(startOfHour(new Date()))
  const [endTime, setEndTime] = useState<Date>(subMinutes(new Date(), 5))

  const [timeSet, setTimeSet] = useState([])

  const handleClick = () => {
    setTimeSet([startTime.toISOString(), endTime.toISOString()])
  }

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
            </div>
          </div>
          <div className="w-1/2">
            {timeSet.length === 2 && (
              <MissingTransactionsCell
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
