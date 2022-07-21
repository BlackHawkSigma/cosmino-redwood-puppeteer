import { useAuth } from '@redwoodjs/auth'
import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

const KILL_SESSION_MUTUTAION = gql`
  mutation KillCosminoSessionMutation($username: String!) {
    killSession(username: $username)
  }
`

type MainLayoutProps = {
  children?: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { isAuthenticated, currentUser, logOut } = useAuth()
  const [killSession] = useMutation(KILL_SESSION_MUTUTAION, {
    variables: { username: currentUser.name },
    onCompleted: () => logOut(),
  })

  return (
    <>
      <header className="mb-4 bg-slate-200">
        <nav>
          <ul className="flex h-10 items-center gap-5 pl-2">
            <li>
              <Link to={routes.home()} className="rw-button rw-button">
                Start
              </Link>
            </li>

            <li>
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => killSession()}
                  className="rw-button rw-button-blue"
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
