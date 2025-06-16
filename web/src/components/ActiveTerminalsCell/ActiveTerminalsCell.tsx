import type { DashboardQuery } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import BuchungLog from 'src/components/BuchungLog'
import SessionCard from 'src/components/SessionCard'

export const QUERY = gql`
  query DashboardQuery {
    dashboard {
      terminal: Terminal {
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
      logs: Logs {
        id
        timestamp
        code
        message
        type
        faultStatus
      }
      successCount
    }
  }
`

export const beforeQuery = (props) => {
  return { variables: props, fetchPolicy: 'no-cache', pollInterval: 1_000 }
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
  dashboard,
  terminals,
}: CellSuccessProps<DashboardQuery> & SuccessProps) => {
  return (
    <div>
      <div className="grid grid-cols-3">
        {terminals.map((terminal) => {
          const activeTerminal = dashboard.find(
            (item) => item.terminal.name === terminal && item.terminal.user
          )
          return activeTerminal ? (
            <div key={terminal} className="px-2 shadow">
              <p className="text-center text-lg">Terminal {terminal}</p>
              <div
                className={`rounded-xl border-8 ${
                  activeTerminal.terminal.focused
                    ? 'border-lime-500'
                    : 'border-red-500'
                }`}
              >
                <SessionCard
                  user={activeTerminal.terminal.user}
                  busy={activeTerminal.terminal.busy}
                />
              </div>

              {activeTerminal.terminal.busy && (
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

              {!activeTerminal.terminal.busy && activeTerminal.terminal.src && (
                <img src={activeTerminal.terminal.src} alt="letze scannung" />
              )}

              <div className="text-xl">
                {activeTerminal.successCount && (
                  <div className="rounded bg-emerald-50 p-2 text-center text-lg">
                    {activeTerminal.successCount} erfolgreiche{' '}
                    {`${
                      activeTerminal.successCount === 1
                        ? 'Buchung'
                        : 'Buchungen'
                    }`}
                  </div>
                )}
                <BuchungLog logs={activeTerminal.logs} />
              </div>
            </div>
          ) : (
            <div key={terminal}></div>
          )
        })}
      </div>
    </div>
  )
}
