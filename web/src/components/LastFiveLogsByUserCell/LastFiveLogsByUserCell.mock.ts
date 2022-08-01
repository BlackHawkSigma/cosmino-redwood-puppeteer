// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  logs: [
    {
      timestamp: '2022-07-19T07:18:11.666Z',
      code: '123456',
      message: 'Scan fehlgeschlagen',
      type: 'error',
    },
    {
      timestamp: '2022-07-19T07:18:11.666Z',
      code: '302316505',
      message: 'VW326R-L VO 18115 SF. HLAK C9A',
      type: 'success',
    },
    {
      timestamp: '2022-07-19T07:18:11.666Z',
      code: '302316505',
      message: 'VW326R-L VO 18115 SF. HLAK C9A',
      type: 'success',
    },
  ],
})
