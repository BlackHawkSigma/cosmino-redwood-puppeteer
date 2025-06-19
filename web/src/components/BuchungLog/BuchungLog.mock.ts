export const standard = () => ({
  logs: [
    {
      id: 1,
      timestamp: '2022-07-19T07:13:11.666Z',
      code: '123456',
      message: 'Scan fehlgeschlagen',
      type: 'error',
      faultStatus: 'none',
    },
    {
      id: 2,
      timestamp: '2022-07-19T07:14:11.666Z',
      code: '302316505',
      message: 'VW326R-L VO 18115 SF. HLAK C9A',
      type: 'success',
      faultStatus: 'ok',
    },
    {
      id: 3,
      timestamp: '2022-07-19T07:18:11.666Z',
      code: '302316504',
      message: 'VW326R-L VO 18115 SF. HLAK C9A',
      type: 'success',
      faultStatus: 'check',
    },
  ],
  successCount: 2,
})
