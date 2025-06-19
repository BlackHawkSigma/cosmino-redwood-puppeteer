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
        lackierposition?: string
        datum: string
      }
      faultMessages: {
        positions: {
          type: 'CHECK' | 'SCRAP'
          position: string
        }[]
      }[]
    }
  }
}

type CheckResult = {
  datum: string
  faultStatus: 'none' | 'ok' | 'check' | 'scrap'
}

export const checkHUforFaultMessage = async (
  Barcode: string
): Promise<CheckResult> => {
  return fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query checkHUforFaultMessage($Barcode: String!) {
          checkHUforFaultMessage(hu: $Barcode) {
            entry {
              lackierposition
              datum
            }
            faultMessages {
              positions {
                type
                position
              }
            }
          }
        }
      `,
      variables: { Barcode },
    }),
  })
    .then<CheckHUforFaultMessage>((res) => res.json())
    .then((res) => {
      const { entry, faultMessages } = res.data.checkHUforFaultMessage || {}
      if (!entry) {
        return { datum: '', faultStatus: 'none' }
      }

      const datum = entry.datum
      if (faultMessages.length === 0) {
        return { datum, faultStatus: 'ok' }
      }

      // Check if lackierposition matches any position in faultMessages
      const lackierPos = entry.lackierposition
      if (lackierPos) {
        // Look for a position that matches the lackierposition
        for (const message of faultMessages) {
          for (const pos of message.positions) {
            // Extract number from "Position X" format
            const positionMatch = pos.position.match(/Position\s+(\d+)/)
            if (positionMatch && positionMatch[1] === lackierPos) {
              // Found a match for the lackierposition
              if (pos.type === 'CHECK') {
                return { datum, faultStatus: 'check' }
              } else if (pos.type === 'SCRAP') {
                return { datum, faultStatus: 'scrap' }
              }
            }
          }
        }
      }

      return { datum, faultStatus: 'ok' }
    })
}
