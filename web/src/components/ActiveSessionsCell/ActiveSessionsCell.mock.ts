// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  activeSessions: [
    { terminal: '1', user: 'John Doe', busy: false, focused: true },
  ],
  terminals: ['1', '2', '3'],
})
