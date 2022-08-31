export const schema = gql`
  type CosminoSession {
    user: String!
    busy: Boolean!
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

  type Query {
    sessions: [CosminoSession!]! @skipAuth
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
    createBuchung(input: CreateBuchungInput!): BuchungResult!
      @requireAuth(roles: "user")
  }
`
