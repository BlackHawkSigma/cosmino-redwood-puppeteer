// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  activeTerminals: [
    {
      id: 1,
      name: '1',
      user: { id: 1, name: 'John Doe' },
      busy: false,
      focused: true,
    },
  ],
  terminals: ['1', '2', '3'],
})
