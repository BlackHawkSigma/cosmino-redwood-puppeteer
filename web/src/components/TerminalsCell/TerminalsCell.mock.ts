// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  terminals: [
    { id: 42, name: '42', user: { name: 'Alice' } },
    { id: 43, name: '43', user: { name: 'Bob' } },
    { id: 44, name: '44', user: { name: 'John' } },
  ],
})
