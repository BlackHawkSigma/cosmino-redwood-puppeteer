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

export const Failure = () => {
  return <div className="text-gray-600">Server Auslastung unbekannt</div>
}

export const Success = ({
  serverStatus: { memoryUsage },
}: CellSuccessProps<ServerStatusQuery>) => {
  return (
    <div
      className={
        memoryUsage >= 0.8 ? 'font-bold text-red-800' : 'text-gray-600'
      }
    >
      Server Auslastung{' '}
      {memoryUsage.toLocaleString('de-DE', {
        style: 'percent',
        maximumFractionDigits: 2,
      })}
    </div>
  )
}
