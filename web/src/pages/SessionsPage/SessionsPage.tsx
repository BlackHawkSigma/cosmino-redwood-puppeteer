import { MetaTags } from '@redwoodjs/web'

import SessionsCell from 'src/components/SessionsCell'

const SessionsPage = () => {
  return (
    <>
      <MetaTags title="Sitzungen" description="Sitzungen" />

      <div className="p-4">
        <h1 className="text-center text-lg">aktive Sitzungen</h1>

        <SessionsCell />
      </div>
    </>
  )
}

export default SessionsPage
