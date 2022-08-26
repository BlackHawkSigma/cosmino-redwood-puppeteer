import { MetaTags } from '@redwoodjs/web'

import ServerStatusCell from 'src/components/ServerStatusCell'
import SessionsCell from 'src/components/SessionsCell'

const SessionsPage = () => {
  return (
    <>
      <MetaTags title="Sitzungen" description="Sitzungen" />

      <div className="p-4">
        <h1 className="text-center text-lg">aktive Sitzungen</h1>

        <SessionsCell />
        <ServerStatusCell />
      </div>
    </>
  )
}

export default SessionsPage
