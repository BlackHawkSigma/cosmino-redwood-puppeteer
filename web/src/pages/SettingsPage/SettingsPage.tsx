import { MetaTags } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import SettingsCell from 'src/components/SettingsCell'

const SettingsPage = () => {
  const { currentUser, isAuthenticated } = useAuth()
  return (
    <>
      <MetaTags title="Einstellungen" description="Benutzer Einstellungen" />

      {isAuthenticated && <SettingsCell userId={currentUser.id} />}
    </>
  )
}

export default SettingsPage
