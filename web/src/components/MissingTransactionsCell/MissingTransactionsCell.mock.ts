// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  missingTransactions: [
    {
      id: 1,
      code: '123456',
      personalnummer: '117',
      createdAt: '2022-07-19T07:13:11.666Z',
    },
    {
      id: 2,
      code: '302316505',
      personalnummer: '117',
      createdAt: '2022-07-19T07:14:11.666Z',
    },
    {
      id: 3,
      code: '302316504',
      personalnummer: '117',
      createdAt: '2022-07-19T07:18:11.666Z',
    },
  ],
})
