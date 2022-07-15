import { useLocalStorage } from 'usehooks-ts'

import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const HomePage = () => {
  const [terminal] = useLocalStorage('terminal', '')
  return (
    <>
      <MetaTags title="Home" description="Home page" />

      <div className="p-4">
        <h1 className="text-center text-lg">Übersicht</h1>
        <div className="flex flex-col underline">
          <Link to={routes.sessions()}>Sessions</Link>
          <Link
            to={
              terminal.length > 0
                ? routes.buchen({ terminal })
                : routes.terminal()
            }
          >
            Buchen
          </Link>
        </div>
      </div>
    </>
  )
}

export default HomePage
