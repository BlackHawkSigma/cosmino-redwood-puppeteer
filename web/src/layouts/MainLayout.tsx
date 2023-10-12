import { useEffect } from 'react'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast'

import { useAuth } from 'src/auth'
import { KILL_SESSION_MUTUTAION } from 'src/components/SessionCard'

type MainLayoutProps = {
  children?: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { isAuthenticated, currentUser, logOut } = useAuth()
  const [killSession] = useMutation(KILL_SESSION_MUTUTAION, {
    variables: { username: currentUser?.name },
    onCompleted: () => logOut(),
    onError: () => logOut(),
  })

  useEffect(() => {
    const onUnload = () => killSession()

    window.addEventListener('beforeunload', onUnload)

    return () => {
      window.removeEventListener('beforeunload', onUnload)
    }
  }, [killSession])

  const handlePauseButton = () => {
    toast.success(
      'Es ist nicht mehr notwending die Pause zu aktiviern.\nDieser Button wird demnächst entfernt'
    )
  }

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
                    onClick={handlePauseButton}
                    className="rw-button text-xl disabled:pointer-events-none"
                  >
                    Pause Starten
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </>
  )
}

export default MainLayout
