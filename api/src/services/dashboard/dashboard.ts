import { QueryResolvers } from 'types/graphql'

import { getLastLogsByUser, getSuccessCount } from '../buchungen/buchungen'
import { getTerminals } from '../terminal'

export const getDashboard = async () => {
  const terminalList = await getTerminals()

  return terminalList.map(async (terminal) => {
    const userId = terminal.user?.id

    if (!terminal.user) {
      return { Terminal: terminal, Logs: [], successCount: null }
    }

    const logs = await getLastLogsByUser({ count: 5, userId })
    const successCount = await getSuccessCount({ userId })

    return {
      Terminal: terminal,
      Logs: logs,
      successCount,
    }
  })
}

export const dashboard: QueryResolvers['dashboard'] = () => getDashboard()
