import type { MutationResolvers, QueryResolvers } from 'types/graphql'

import { emitter } from 'src/functions/graphql'
import { db } from 'src/lib/db'

export const terminals: QueryResolvers['terminals'] = () => {
  return db.terminal.findMany({
    include: { user: true },
    orderBy: { name: 'asc' },
  })
}

export const terminalById: QueryResolvers['terminalById'] = ({ id }) => {
  return db.terminal.findUnique({
    where: { id },
  })
}

export const terminalByUserId: QueryResolvers['terminalByUserId'] = ({
  userId,
}) => {
  return db.terminal.findUnique({
    where: { userId },
  })
}

export const claimTerminal: MutationResolvers['claimTerminal'] = async ({
  id,
  userId,
}) => {
  const terminal = await db.terminal.update({
    where: { id },
    data: { user: { connect: { id: userId } }, loggedInAt: new Date() },
  })
  emitter.emit('invalidate', { type: 'Terminal', id })
  return terminal
}

export const updateTerminal: MutationResolvers['updateTerminal'] = async ({
  id,
  input,
}) => {
  const terminal = await db.terminal.update({ where: { id }, data: input })
  emitter.emit('invalidate', { type: 'Terminal', id })
  return terminal
}

export const unclaimTerminal: MutationResolvers['unclaimTerminal'] = async ({
  id,
}) => {
  const terminal = await db.terminal.update({
    where: { id },
    data: {
      user: { disconnect: true },
      busy: false,
      focused: false,
      lastSuccessImgUrl: null,
      loggedInAt: null,
    },
  })
  emitter.emit('invalidate', { type: 'Terminal', id })
  return terminal
}

// export const createTerminal: MutationResolvers['createTerminal'] = ({
//   input,
// }) => {
//   return db.terminal.create({
//     data: input,
//   })
// }

// export const deleteTerminal: MutationResolvers['deleteTerminal'] = ({
//   name,
// }) => {
//   return db.terminal.delete({
//     where: { name },
//   })
// }
