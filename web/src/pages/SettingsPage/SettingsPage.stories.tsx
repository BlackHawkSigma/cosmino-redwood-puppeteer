import SettingsPage from './SettingsPage'

export const generated = (args) => {
  mockCurrentUser({
    id: 1,
    name: 'Alice',
    userRoles: [{ userRole: { id: 1, name: 'user' } }],
    roles: [],
  })

  return <SettingsPage {...args} />
}

export default { title: 'Pages/SettingsPage' }
