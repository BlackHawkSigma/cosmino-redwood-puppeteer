import type { QueryResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const terminals: QueryResolvers['terminals'] = async () => {
  return db.terminal
    .findMany({ orderBy: { name: 'asc' } })
    .then((terminals) =>
      terminals.map((terminal) => ({ ...terminal, id: terminal.name }))
    )
}

// export const terminal: QueryResolvers['terminal'] = ({ name }) => {
//   return db.terminal.findUnique({
//     where: { name },
//   })
// }

// export const createTerminal: MutationResolvers['createTerminal'] = ({
//   input,
// }) => {
//   return db.terminal.create({
//     data: input,
//   })
// }

// export const updateTerminal: MutationResolvers['updateTerminal'] = ({
//   name,
//   input,
// }) => {
//   return db.terminal.update({
//     data: input,
//     where: { name },
//   })
// }

// export const deleteTerminal: MutationResolvers['deleteTerminal'] = ({
//   name,
// }) => {
//   return db.terminal.delete({
//     where: { name },
//   })
// }
