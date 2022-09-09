import { useState } from 'react'

import { MetaTags } from '@redwoodjs/web'

import MissingTransactionsCell from 'src/components/MissingTransactionsCell'

const MissingDataPage = () => {
  const [startTime, setStartTime] = useState<Date>(new Date())
  const [endTime, setEndTime] = useState<Date>(new Date())

  const [timeSet, setTimeSet] = useState([])

  const handleClick = () => {
    setTimeSet([startTime.toISOString(), endTime.toISOString()])
  }

  return (
    <>
      <MetaTags title="Fehlende Buchungen" description="Fehlende Buchungen" />

      <h1>Fehlende Buchungen</h1>

      <div className="flex w-72 flex-col">
        <label className="rw-label">
          Von{' '}
          <input
            type="datetime-local"
            className="rw-input"
            defaultValue={startTime.toISOString().substring(0, 16)}
            // @ts-expect-error value does not exist
            onInput={({ target }) => setStartTime(new Date(target.value))}
          />
        </label>

        <label className="rw-label">
          Bis{' '}
          <input
            type="datetime-local"
            className="rw-input"
            defaultValue={endTime.toISOString().substring(0, 16)}
            // @ts-expect-error value does not exist
            onInput={({ target }) => setEndTime(new Date(target.value))}
          />
        </label>

        <button className="rw-button rw-button-blue" onClick={handleClick}>
          laden
        </button>
      </div>

      {timeSet.length === 2 && (
        <MissingTransactionsCell startTime={timeSet[0]} endTime={timeSet[1]} />
      )}
    </>
  )
}

export default MissingDataPage
