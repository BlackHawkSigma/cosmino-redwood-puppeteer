import { QueryResolvers } from 'types/graphql'

import { getUsedMemory } from 'src/utils/getUsedMemory'

export const serverStatus: QueryResolvers['serverStatus'] = () => {
  return {
    memoryUsage: getUsedMemory(),
  }
}
