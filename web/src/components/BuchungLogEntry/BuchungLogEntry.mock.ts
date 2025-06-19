const data = {
  id: 1,
  timestamp: '2022-07-19T07:13:11.666Z',
  code: '302316505',
  message: 'VW326R-L VO 18115 SF. HLAK C9A',
  type: 'success',
}

export const none = () => ({ ...data, faultStatus: 'none' })
export const pending = () => ({ ...data, faultStatus: 'pending' })
export const ok = () => ({ ...data, faultStatus: 'ok' })
export const check = () => ({ ...data, faultStatus: 'check' })
export const scrap = () => ({ ...data, faultStatus: 'scrap' })
