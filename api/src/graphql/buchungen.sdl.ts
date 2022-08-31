export const schema = gql`
  type BuchungsLog {
    id: Int!
    timestamp: DateTime!
    code: String!
    type: String!
    message: String!
  }

  type Query {
    lastLogsByUser(userId: Int!, count: Int!): [BuchungsLog!]! @skipAuth
    successCount(userId: Int!): Int @skipAuth
  }
`
