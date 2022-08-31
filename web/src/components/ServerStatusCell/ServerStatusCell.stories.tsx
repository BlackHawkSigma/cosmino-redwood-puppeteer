import { Success } from './ServerStatusCell'
import { standard, highUsage } from './ServerStatusCell.mock'

export const nominal = () => {
  return Success ? <Success {...standard()} /> : null
}

export const danger = () => {
  return Success ? <Success {...highUsage()} /> : null
}

export default { title: 'Cells/ServerStatusCell' }
