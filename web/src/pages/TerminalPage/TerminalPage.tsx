import { MetaTags } from '@redwoodjs/web'

import TerminalsCell from 'src/components/TerminalsCell'

const TerminalPage = () => {
  return (
    <>
      <MetaTags title="Terminal Auswahl" description="Terminal Auswahl" />

      <h1>Terminal Auswahl</h1>

      <div className="container">
        <TerminalsCell />
      </div>
    </>
  )
}

export default TerminalPage
