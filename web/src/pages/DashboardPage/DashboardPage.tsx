import { MetaTags } from '@redwoodjs/web'

import ActiveSessionsCell from 'src/components/ActiveSessionsCell'

const DashboardPage = ({ type }) => {
  const sideOne = type === 'alle' || type === '1'
  const sideTwo = type === 'alle' || type === '2'

  return (
    <>
      <MetaTags title={`Übersicht - ${type}`} />
      <section className="p-4">
        {sideOne && (
          <div className="mb-4 p-2 shadow-xl">
            <h1>Seite 1</h1>
            <ActiveSessionsCell terminals={['1', '2', '3']} />
          </div>
        )}

        {sideTwo && (
          <div className="p-2 shadow-xl">
            <h1>Seite 2</h1>
            <ActiveSessionsCell terminals={['4', '5', '6']} />
          </div>
        )}
      </section>
    </>
  )
}

export default DashboardPage
