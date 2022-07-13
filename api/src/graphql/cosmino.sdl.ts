export const schema = gql`
  type Session {
    terminal: String!
    user: String!
    busy: Boolean!
  }

  type Query {
    sessions: [Session!]! @skipAuth
  }

  input CreateSessionInput {
    terminal: String!
    username: String!
    userpwd: String!
  }

  input CreateBuchungInput {
    terminal: String!
    code: String!
  }
  type Mutation {
    createSession(input: CreateSessionInput!): String!
      @requireAuth(roles: "user")
    killSession(terminal: String!): Boolean! @skipAuth
    createBuchung(input: CreateBuchungInput!): String!
      @requireAuth(roles: "user")
  }
`
