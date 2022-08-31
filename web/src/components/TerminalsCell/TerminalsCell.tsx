import { useState } from 'react'

import type { TerminalsQuery } from 'types/graphql'
import { useLocalStorage } from 'usehooks-ts'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

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
  const [checked, setChecked] = useState(false)
  const [_terminal, setTerminal] = useLocalStorage('terminal', '')

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
          return (
            <Link
              key={id}
              className="rounded border bg-slate-300 px-4 py-2 text-center text-xl"
              onClick={checked ? () => setTerminal(terminal) : null}
              to={routes.terminal({ terminal })}
            >
              {user !== undefined
                ? terminal
                : `${terminal} belegt durch ${user?.name}`}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
