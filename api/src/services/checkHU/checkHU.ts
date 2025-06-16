import fetch from 'src/lib/fetch'

const URL = 'http://srfawp0013:9090'

type CheckHU = {
  data: {
    abnahmebuchung: null | {
      datum: string
    }
  }
}

export const checkHU = async (Barcode: string): Promise<CheckHU> => {
  return fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query Abnahmebuchung($Barcode: String!) {
          abnahmebuchung(barcode: $Barcode) {
            datum
          }
        }
      `,
      variables: { Barcode },
    }),
  }).then((res) => res.json())
}

type CheckHUforFaultMessage = {
  data: {
    checkHUforFaultMessage: null | {
      entry: {
        datum: string
      }
      faultMessages: {
        positions: {
          position: string
          type: 'CHECK' | 'SCRAP'
        }[]
      }[]
    }
  }
}

export const checkHUforFaultMessage = async (
  Barcode: string
): Promise<CheckHUforFaultMessage> => {
  return fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query checkHUforFaultMessage($Barcode: String!) {
          checkHUforFaultMessage(barcode: $Barcode) {
            entry {
              datum
            }
            faultMessages
          }
        }
      `,
      variables: { Barcode },
    }),
  }).then((res) => res.json())
}
