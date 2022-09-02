import { MetaTags } from '@redwoodjs/web'

import ActiveTerminalsCell from 'src/components/ActiveTerminalsCell'
import ServerStatusCell from 'src/components/ServerStatusCell'

const DashboardPage = ({ type }) => {
  const sideOne = type === 'alle' || type === '1'
  const sideTwo = type === 'alle' || type === '2'

  return (
    <>
      <MetaTags title={`Übersicht - ${type}`} />

      <section className="p-4">
        {sideOne && (
          <div className="mb-4 p-2 shadow-xl">
            <h1 className="text-center text-lg">Seite 1</h1>
            <ActiveTerminalsCell terminals={['1', '2', '3']} />
          </div>
        )}

        {sideTwo && (
          <div className="p-2 shadow-xl">
            <h1 className="text-center text-lg">Seite 2</h1>
            <ActiveTerminalsCell terminals={['4', '5', '6']} />
          </div>
        )}
      </section>

      <section className="mt-4 p-4">
        <div className="flex justify-center">
          <ServerStatusCell />
        </div>
      </section>
    </>
  )
}

export default DashboardPage
