// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  cosminoSessions: [
    { id: '1', user: 'foo', terminal: '1', transactions: 0, busy: true },
    { id: '2', user: 'bar', terminal: '2', transactions: 13, busy: false },
    { id: '3', user: 'fizz', terminal: '3', transactions: 42, busy: false },
  ],
})
