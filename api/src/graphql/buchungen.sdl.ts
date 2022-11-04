export const schema = gql`
  type BuchungsLog {
    id: Int!
    timestamp: DateTime!
    code: String!
    type: String!
    message: String!
  }

  type MissingTransaction {
    id: Int!
    code: String!
    personalnummer: String!
    createdAt: DateTime!
  }

  type Query {
    lastLogsByUser(userId: Int!, count: Int!): [BuchungsLog!]! @skipAuth
    missingTransactions(
      startTime: DateTime!
      endTime: DateTime!
    ): [MissingTransaction!]! @skipAuth
    successCount(userId: Int!): Int @skipAuth
  }

  type Mutation {
    rerunMissingTransactions(startTime: DateTime!, endTime: DateTime!): Int!
      @requireAuth(roles: "admin")
    recheckMissingTransactions(
      startTime: DateTime!
      endTime: DateTime!
    ): Boolean! @skipAuth
  }
`
