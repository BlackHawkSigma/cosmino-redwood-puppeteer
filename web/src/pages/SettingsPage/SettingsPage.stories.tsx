import SettingsPage from './SettingsPage'

export const generated = (args) => {
  mockCurrentUser({
    id: 1,
    name: 'Alice',
    userRoles: [{ userRole: { id: 1, name: 'user' } }],
  })

  return <SettingsPage {...args} />
}

export default { title: 'Pages/SettingsPage' }
