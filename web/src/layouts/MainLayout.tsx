import { useAuth } from '@redwoodjs/auth'
import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

const KILL_SESSION_MUTUTAION = gql`
  mutation KillSessionMutation($terminal: String!) {
    killSession(terminal: $terminal)
  }
`

type MainLayoutProps = {
  children?: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { isAuthenticated, currentUser, logOut } = useAuth()
  const [killSession] = useMutation(KILL_SESSION_MUTUTAION, {
    variables: { terminal: '1' },
    onCompleted: () => logOut(),
  })

  return (
    <>
      <header className="mb-4 bg-slate-200">
        <nav>
          <ul className=" flex gap-3 pl-2 text-sm">
            <li>
              <Link to={routes.home()}>Start</Link>
            </li>

            <li>
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => killSession()}
                  className="underline"
                >
                  {currentUser.name} - Abmelden
                </button>
              )}
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </>
  )
}

export default MainLayout
