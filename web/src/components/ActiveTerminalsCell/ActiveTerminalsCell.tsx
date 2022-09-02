import type { ActiveTerminalsQuery } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import LastLogsByUserCell from 'src/components/LastLogsByUserCell'
import SessionCard from 'src/components/SessionCard'

export const QUERY = gql`
  query ActiveTerminalsQuery {
    activeTerminals: terminals {
      id
      name
      user {
        id
        name
      }
      busy
      focused
      src: lastSuccessImgUrl
    }
  }
`

export const beforeQuery = (props) => {
  return { variables: props, fetchPolicy: 'no-cache', pollInterval: 2_000 }
}

export const Loading = () => <div>Loading...</div>

export const Empty = () => (
  <div className="text-center">Keine Terminals aktiv</div>
)

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

type SuccessProps = {
  terminals: string[]
}

export const Success = ({
  activeTerminals,
  terminals,
}: CellSuccessProps<ActiveTerminalsQuery> & SuccessProps) => {
  return (
    <div>
      <div className="grid grid-cols-3">
        {terminals.map((terminal) => {
          const activeTerminal = activeTerminals.find(
            (item) => item.name === terminal && item.user
          )
          return activeTerminal ? (
            <div key={terminal} className="px-2 shadow">
              <p className="text-center text-lg">Terminal {terminal}</p>
              <div
                className={`rounded-xl border-8 ${
                  activeTerminal.focused ? 'border-lime-500' : 'border-red-500'
                }`}
              >
                <SessionCard
                  user={activeTerminal.user}
                  busy={activeTerminal.busy}
                />
              </div>

              {activeTerminal.busy && (
                <div className="flex h-[415px] w-[600px] items-center justify-center">
                  <svg
                    className="animate-spin-slow h-24 w-24 text-blue-700"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              )}

              {!activeTerminal.busy && activeTerminal.src && (
                <img src={activeTerminal.src} alt="letze scannung" />
              )}

              <LastLogsByUserCell
                userId={activeTerminal.user?.id}
                count={5}
                key={terminal}
              />
            </div>
          ) : (
            <div key={terminal}></div>
          )
        })}
      </div>
    </div>
  )
}
