import type { ServerStatusQuery } from 'types/graphql'

import { CellSuccessProps } from '@redwoodjs/web'

export const QUERY = gql`
  query ServerStatusQuery {
    serverStatus {
      memoryUsage
    }
  }
`

export const beforeQuery = (props) => {
  return { variables: props, fetchPolicy: 'no-cache', pollInterval: 30_000 }
}

export const Success = ({
  serverStatus,
}: CellSuccessProps<ServerStatusQuery>) => {
  return (
    <div>
      Server Auslastung{' '}
      {serverStatus.memoryUsage.toLocaleString('de-DE', {
        style: 'percent',
        maximumFractionDigits: 2,
      })}
    </div>
  )
}
