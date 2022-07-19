import SessionCard from './SessionCard'
import { standard, busy } from './SessionCard.mock'

export const generated = () => {
  return <SessionCard {...standard()} />
}

export const active = () => {
  return <SessionCard {...busy()} />
}

export default { title: 'Components/SessionCard' }
