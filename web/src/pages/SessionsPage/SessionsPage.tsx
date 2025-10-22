import { MetaTags } from '@redwoodjs/web'

import LockStatisticsCell from 'src/components/LockStatisticsCell'
import ServerStatusCell from 'src/components/ServerStatusCell'
import SessionsCell from 'src/components/SessionsCell'

const SessionsPage = () => {
  return (
    <>
      <MetaTags title="Sitzungen" description="Sitzungen" />

      <div className="p-4">
        <h1 className="text-center text-lg">aktive Sitzungen</h1>
        <div className="flex flex-col items-center gap-2 p-4">
          <LockStatisticsCell />
          <SessionsCell />
          <ServerStatusCell />
        </div>
      </div>
    </>
  )
}

export default SessionsPage
