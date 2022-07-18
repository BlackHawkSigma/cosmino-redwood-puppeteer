export const schema = gql`
  type Session {
    user: String!
    busy: Boolean!
    focused: Boolean
  }

  type BuchungResult {
    code: String!
    type: String!
    message: String!
  }

  type Query {
    sessions: [Session!]! @skipAuth
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
