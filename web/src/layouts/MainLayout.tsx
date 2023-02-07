import { useEffect, useState } from 'react'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import { KILL_SESSION_MUTUTAION } from 'src/components/SessionCard'

type MainLayoutProps = {
  children?: React.ReactNode
}

const REFRESH_SESSION_MUTATION = gql`
  mutation RefreshCosminoSession($username: String!) {
    refreshSession(username: $username)
  }
`

const MainLayout = ({ children }: MainLayoutProps) => {
  const { isAuthenticated, currentUser, logOut } = useAuth()
  const [killSession] = useMutation(KILL_SESSION_MUTUTAION, {
    variables: { username: currentUser?.name },
    onCompleted: () => logOut(),
    onError: () => logOut(),
  })
  const [refreshSession, { loading: isRefreshing }] = useMutation(
    REFRESH_SESSION_MUTATION,
    { variables: { username: currentUser?.name } }
  )
  const [isBreak, setIsBreak] = useState(false)

  useEffect(() => {
    const onUnload = () => killSession()

    window.addEventListener('beforeunload', onUnload)

    return () => {
      window.removeEventListener('beforeunload', onUnload)
    }
  }, [killSession])

  return (
    <>
      <header className="mb-4 bg-slate-200 py-2">
        <nav>
          <ul className="flex items-center gap-5 pl-2">
            <li>
              <Link
                to={routes.home()}
                className="rw-button rw-button-green text-xl"
              >
                Start
              </Link>
            </li>

            {isAuthenticated && (
              <>
                <li>
                  <button
                    type="button"
                    onClick={() => killSession()}
                    className="rw-button rw-button-blue text-xl"
                  >
                    {currentUser.name} abmelden
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isBreak) {
                        refreshSession()
                      }
                      setIsBreak(!isBreak)
                    }}
                    disabled={isRefreshing}
                    className="rw-button text-xl disabled:pointer-events-none"
                  >
                    Pause {isBreak ? 'Beenden' : 'Starten'}
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <main>{children}</main>
      {isBreak && (
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-neutral-800/20 backdrop-blur-lg">
          <button className="h-full w-full" onClick={() => setIsBreak(false)}>
            <span className="font-comfortaa block p-8 text-8xl">Pause</span>
            <span className="font-franklin text-6xl">
              Bildschirm berühren zum fortfahren
            </span>
          </button>
        </div>
      )}
    </>
  )
}

export default MainLayout
