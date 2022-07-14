import type { TerminalsQuery } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

export const QUERY = gql`
  query TerminalsQuery {
    terminals {
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ terminals }: CellSuccessProps<TerminalsQuery>) => {
  return (
    <div className="p-4">
      <ul>
        {terminals.map(({ name: terminal }) => {
          return (
            <li key={terminal}>
              <Link to={routes.buchen({ terminal })}>{terminal}</Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
