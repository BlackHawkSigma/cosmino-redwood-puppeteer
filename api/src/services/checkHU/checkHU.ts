import fetch from 'src/lib/fetch'

const URL = 'http://srfawp0013:9090'

export const checkHU = async (Barcode: string) => {
  // return process.env.NODE_ENV === 'production' ?
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
  // : Promise.resolve({
  //     data: { abnahmebuchung: { datum: new Date().toISOString() } },
  //     // data: { abnahmebuchung: { datum: null } },
  //   })
}
