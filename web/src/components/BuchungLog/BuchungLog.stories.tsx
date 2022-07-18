import BuchungLog from './BuchungLog'
import { standard } from './BuchungLog.mock'

export const generated = () => {
  return <BuchungLog {...standard()} />
}

export default { title: 'Components/BuchungLog' }
