export const schema = gql`
  type CosminoSession {
    user: String!
    busy: Boolean!
    focused: Boolean
  }

  type BuchungResult {
    timestamp: DateTime
    code: String!
    type: String!
    message: String!
  }

  type Query {
    sessions: [CosminoSession!]! @skipAuth
  }

  input CreateSessionInput {
    username: String!
    userpwd: String!
  }

  input CreateBuchungInput {
    terminal: String!
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
