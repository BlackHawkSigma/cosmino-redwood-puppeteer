import type { MutationResolvers, QueryResolvers } from 'types/graphql'

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

export const claimTerminal: MutationResolvers['claimTerminal'] = ({
  id,
  userId,
}) => {
  return db.terminal.update({
    where: { id },
    data: { user: { connect: { id: userId } }, loggedInAt: new Date() },
  })
}

export const updateTerminal: MutationResolvers['updateTerminal'] = async ({
  id,
  input,
}) => {
  const terminal = await db.terminal.update({ where: { id }, data: input })
  return terminal
}

export const unclaimTerminal: MutationResolvers['unclaimTerminal'] = ({
  id,
}) => {
  return db.terminal.update({
    where: { id },
    data: {
      user: { disconnect: true },
      busy: false,
      focused: false,
      lastSuccessImgUrl: null,
      loggedInAt: null,
    },
  })
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
