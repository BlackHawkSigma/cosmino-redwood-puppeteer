// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  sessions: [
    { user: 'foo', terminal: '1', busy: true },
    { user: 'bar', terminal: '2', busy: false },
    { user: 'fizz', terminal: '3', busy: false },
  ],
})
