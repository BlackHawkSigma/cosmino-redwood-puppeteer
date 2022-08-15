import { checkHU } from 'api/src/services/checkHU/checkHU'

const barcode = process.argv[4]

export default async () => {
  const result = await checkHU(barcode)

  console.log(JSON.stringify(result))
}
