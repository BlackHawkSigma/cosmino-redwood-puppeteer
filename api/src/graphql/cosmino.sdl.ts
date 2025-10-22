export const schema = gql`
  type CosminoSession {
    id: String!
    user: String!
    transactions: Int!
    busy: Boolean
    focused: Boolean
  }

  type BuchungResult {
    id: Int!
    timestamp: DateTime!
    code: String!
    type: String!
    message: String!
    imageUrl: String
  }

  type LockStatistics {
    totalAcquired: Int!
    totalReleased: Int!
    totalTimeouts: Int!
    totalErrors: Int!
    activeLocks: Int!
    activeUsers: [ActiveLockUser!]!
  }

  type ActiveLockUser {
    username: String!
    waitingFor: Int!
  }

  type Query {
    cosminoSessions: [CosminoSession!]! @skipAuth
    lockStatistics: LockStatistics! @skipAuth
  }

  input CreateSessionInput {
    username: String!
    userpwd: String!
  }

  input CreateBuchungInput {
    terminalId: Int!
    username: String!
    code: String!
  }

  type Mutation {
    createSession(input: CreateSessionInput!): Boolean!
      @requireAuth(roles: "user")
    killSession(username: String!): Boolean! @skipAuth
    refreshSession(username: String!): Boolean!
      @requireAuth(roles: "user")
      @deprecated(reason: "Refreshs are handeld on the server")
    createBuchung(input: CreateBuchungInput!): BuchungResult!
      @requireAuth(roles: "user")
  }
`
