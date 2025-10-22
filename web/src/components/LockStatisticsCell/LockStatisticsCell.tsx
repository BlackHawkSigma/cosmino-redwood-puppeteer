import { useState, useEffect } from 'react'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

export const QUERY = gql`
  query LockStatisticsQuery {
    lockStatistics {
      totalAcquired
      totalReleased
      totalTimeouts
      totalErrors
      activeLocks
      activeUsers {
        username
        waitingFor
      }
    }
  }
`

// Add polling interval of 2 seconds
export const beforeQuery = () => {
  return {
    fetchPolicy: 'no-cache',
    pollInterval: 2000,
  }
}

export const Loading = () => (
  <div className="rounded-lg border border-gray-200 bg-white p-4 shadow">
    <h2 className="mb-4 text-lg font-semibold">Lock Statistics</h2>
    <div className="animate-pulse">Loading...</div>
  </div>
)

export const Empty = () => (
  <div className="rounded-lg border border-gray-200 bg-white p-4 shadow">
    <h2 className="mb-4 text-lg font-semibold">Lock Statistics</h2>
    <div>No data available</div>
  </div>
)

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rounded-lg border border-red-200 bg-red-50 p-4 shadow">
    <h2 className="mb-4 text-lg font-semibold text-red-800">Lock Statistics</h2>
    <div className="text-red-600">Error: {error.message}</div>
  </div>
)

interface LockStatisticsQuery {
  lockStatistics: {
    totalAcquired: number
    totalReleased: number
    totalTimeouts: number
    totalErrors: number
    activeLocks: number
    activeUsers: Array<{
      username: string
      waitingFor: number
    }>
  }
}

export const Success = ({
  lockStatistics,
}: CellSuccessProps<LockStatisticsQuery>) => {
  const {
    totalAcquired,
    totalReleased,
    totalTimeouts,
    totalErrors,
    activeLocks,
    activeUsers,
  } = lockStatistics

  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0)
  const [updateTrigger] = useState(() => Date.now()) // Unique value per component instance

  // Track when component renders (successful fetch from server)
  useEffect(() => {
    setLastUpdate(new Date())
    setSecondsSinceUpdate(0)
  }, [lockStatistics, updateTrigger])

  // Update seconds counter every second
  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - lastUpdate.getTime()) / 1000)
      setSecondsSinceUpdate(seconds)
    }, 1000)

    return () => clearInterval(interval)
  }, [lastUpdate])

  const totalCompleted = totalReleased + totalTimeouts + totalErrors
  const successRate =
    totalCompleted > 0
      ? ((totalReleased / totalCompleted) * 100).toFixed(1)
      : '100.0'

  const getStatusColor = () => {
    if (totalTimeouts > 10 || totalErrors > 10) return 'text-red-600'
    if (totalTimeouts > 5 || totalErrors > 5) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getConnectionStatus = () => {
    if (secondsSinceUpdate <= 3) {
      return { color: 'text-green-500', text: 'Live' }
    } else if (secondsSinceUpdate <= 10) {
      return { color: 'text-yellow-500', text: 'Stale' }
    } else {
      return { color: 'text-red-500', text: 'Disconnected' }
    }
  }

  const connectionStatus = getConnectionStatus()

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Lock Statistics</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className={`text-xs ${connectionStatus.color}`}>●</span>
            <span className="text-xs text-gray-500">
              {connectionStatus.text} ({secondsSinceUpdate}s)
            </span>
          </div>
          <span className={'text-sm font-medium ' + getStatusColor()}>
            {successRate}% Success Rate
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <div className="rounded bg-blue-50 p-3">
          <div className="text-xs font-medium text-gray-500">
            Total Acquired
          </div>
          <div className="text-xl font-bold text-blue-600">{totalAcquired}</div>
        </div>

        <div className="rounded bg-green-50 p-3">
          <div className="text-xs font-medium text-gray-500">
            Total Released
          </div>
          <div className="text-xl font-bold text-green-600">
            {totalReleased}
          </div>
        </div>

        <div className="rounded bg-yellow-50 p-3">
          <div className="text-xs font-medium text-gray-500">Timeouts</div>
          <div className="text-xl font-bold text-yellow-600">
            {totalTimeouts}
          </div>
        </div>

        <div className="rounded bg-red-50 p-3">
          <div className="text-xs font-medium text-gray-500">Errors</div>
          <div className="text-xl font-bold text-red-600">{totalErrors}</div>
        </div>

        <div className="rounded bg-purple-50 p-3">
          <div className="text-xs font-medium text-gray-500">Active Locks</div>
          <div className="text-xl font-bold text-purple-600">{activeLocks}</div>
        </div>
      </div>

      {activeUsers.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-2 text-sm font-semibold text-gray-700">
            Active Users ({activeUsers.length})
          </h3>
          <div className="space-y-2">
            {activeUsers.map((user) => {
              const seconds = Math.floor(user.waitingFor / 1000)
              const isLongWait = seconds > 15

              return (
                <div
                  key={user.username}
                  className={
                    'flex items-center justify-between rounded p-2 ' +
                    (isLongWait ? 'bg-red-50' : 'bg-gray-50')
                  }
                >
                  <span className="font-medium">{user.username}</span>
                  <span
                    className={
                      'text-sm ' +
                      (isLongWait
                        ? 'font-semibold text-red-600'
                        : 'text-gray-600')
                    }
                  >
                    {seconds}s
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeLocks === 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          No active locks
        </div>
      )}
    </div>
  )
}
