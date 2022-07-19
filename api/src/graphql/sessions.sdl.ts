export const schema = gql`
  type Session {
    username: String!
    terminal: String!
    busy: Boolean
    focused: Boolean
  }

  type Query {
    activeSessions: [Session!]! @skipAuth
  }

  input CreateActiveSessionInput {
    username: String!
    terminal: String!
  }

  type Mutation {
    createActiveSession(input: CreateActiveSessionInput!): Session!
      @requireAuth(roles: "user")
    deleteActiveSession(username: String!): Session @requireAuth(roles: "user")
  }
`
