import { useLocalStorage } from 'usehooks-ts'

import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const HomePage = () => {
  const [terminal] = useLocalStorage('terminal', '')
  return (
    <>
      <MetaTags title="Home" description="Home page" />

      <div className="container mx-auto">
        <h1 className="text-center text-lg">Übersicht</h1>
        <div className="flex flex-col gap-4 underline">
          <Link
            className="rounded bg-blue-300 px-4 py-2"
            to={routes.settings()}
          >
            Einstellungen
          </Link>
          <Link
            className="rounded bg-blue-300 px-4 py-2"
            to={
              terminal.length > 0
                ? routes.terminal({ terminal })
                : routes.terminals()
            }
          >
            Buchen
          </Link>

          <Link
            className="rounded bg-blue-100 px-4 py-2"
            to={routes.sessions()}
          >
            Sessions
          </Link>

          <div className="flex gap-4">
            <Link
              className="rounded bg-blue-100 px-4 py-2"
              to={routes.dashboard({ type: '1' })}
            >
              Übersicht Seite 1
            </Link>
            <Link
              className="rounded bg-blue-100 px-4 py-2"
              to={routes.dashboard({ type: '2' })}
            >
              Übersicht Seite 2
            </Link>
            <Link
              className="rounded bg-blue-100 px-4 py-2"
              to={routes.dashboard({ type: 'alle' })}
            >
              Übersicht gesammt
            </Link>
          </div>
          <Link
            className="rounded bg-blue-100 px-4 py-2"
            to={routes.missingData()}
          >
            fehlende Buchungen
          </Link>
        </div>
      </div>
    </>
  )
}

export default HomePage
