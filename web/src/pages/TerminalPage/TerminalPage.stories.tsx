import TerminalPage from './TerminalPage'

export const generated = () => {
  mockCurrentUser({
    id: 1,
    name: 'Alice',
    userRoles: [{ userRole: { id: 1, name: 'user' } }],
    roles: [],
  })

  return <TerminalPage terminal={1} />
}

export default { title: 'Pages/TerminalPage' }
