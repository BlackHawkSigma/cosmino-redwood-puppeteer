import { standard as log } from 'src/components/BuchungLog/BuchungLog.mock'

export const standard = () => ({
  logs: log().logs,
  successCount: 117,
})
