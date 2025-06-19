import BuchungLogEntry from './BuchungLogEntry'
import { check, none, ok, pending, scrap } from './BuchungLogEntry.mock'

export const Alle = () => {
  return (
    <div className="space-y-4">
      <BuchungLogEntry {...none()} />
      <BuchungLogEntry {...pending()} />
      <BuchungLogEntry {...ok()} />
      <BuchungLogEntry {...check()} />
      <BuchungLogEntry {...scrap()} />
    </div>
  )
}

/** Test */
export const None = () => {
  return <BuchungLogEntry {...none()} />
}

export default {
  title: 'Components/BuchungLogEntry',
  component: BuchungLogEntry,
}
