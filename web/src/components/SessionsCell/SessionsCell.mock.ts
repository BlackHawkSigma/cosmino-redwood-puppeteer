// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  cosminoSessions: [
    { id: '1', user: 'foo', terminal: '1', transactions: 33 },
    { id: '2', user: 'bar', terminal: '2', transactions: 33 },
    { id: '3', user: 'fizz', terminal: '3', transactions: 33 },
  ],
})
