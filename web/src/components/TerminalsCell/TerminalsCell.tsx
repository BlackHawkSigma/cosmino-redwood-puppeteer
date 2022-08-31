import { useState } from 'react'

import type { TerminalsQuery } from 'types/graphql'
import { useLocalStorage } from 'usehooks-ts'

import { Link, routes } from '@redwoodjs/router'
import { CellSuccessProps, CellFailureProps, useMutation } from '@redwoodjs/web'

import { KILL_SESSION_MUTUTAION } from 'src/components/SessionCard'

export const QUERY = gql`
  query TerminalsQuery {
    terminals {
      id
      name
      user {
        name
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ terminals }: CellSuccessProps<TerminalsQuery>) => {
  const [killSession] = useMutation(KILL_SESSION_MUTUTAION, {
    refetchQueries: [{ query: QUERY }],
  })

  const [checked, setChecked] = useState(false)
  const [_terminal, setTerminal] = useLocalStorage('terminal', '')

  const handleLogoff = (username) => {
    killSession({ variables: { username } })
  }

  return (
    <div className="p-4">
      <div>
        <input
          className="mr-2"
          type="checkbox"
          name="set"
          id="set"
          checked={checked}
          onChange={() => setChecked(!checked)}
        />
        <label htmlFor="set">dauerhaft setzen</label>
      </div>

      <div className="flex flex-col gap-4 p-2 ">
        {terminals.map(({ name: terminal, id, user }) => {
          return !user ? (
            <Link
              key={id}
              className="rounded border bg-slate-300 px-4 py-2 text-center text-xl"
              onClick={checked ? () => setTerminal(terminal) : null}
              to={routes.terminal({ terminal })}
            >
              {terminal}
            </Link>
          ) : (
            <button
              className="rounded border bg-slate-400 px-4 py-2 text-center text-xl"
              onClick={() => handleLogoff(user.name)}
            >
              Terminal {terminal} belegt durch &quot;{user.name}&quot;.
              abmelden?
            </button>
          )
        })}
      </div>
    </div>
  )
}
