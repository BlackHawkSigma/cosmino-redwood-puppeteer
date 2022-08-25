import { freemem, totalmem } from 'os'

export const getUsedMemory = () => {
  const systemMemory = totalmem()
  const freeMemory = freemem()

  return (systemMemory - freeMemory) / systemMemory
}
