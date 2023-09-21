// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  dashboard: [
    {
      terminal: {
        id: 1,
        name: '1',
        user: {
          id: 1,
          name: 'John Doe',
        },
        busy: true,
        focused: false,
      },

      logs: [
        {
          id: 1,
          timestamp: new Date().toISOString(),
          code: '123',
          message: 'ok',
          type: 'success',
        },
      ],

      successCount: 1,
    },
  ],
  terminals: ['1', '2', '3'],
})
