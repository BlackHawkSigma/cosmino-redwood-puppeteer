export const schema = gql`
  type ActiveSession {
    username: String!
    terminal: String!
    busy: Boolean
    focused: Boolean
  }

  type Query {
    activeSessions: [ActiveSession!]! @skipAuth
  }

  input CreateActiveSessionInput {
    username: String!
    terminal: String!
  }

  input UpdateActiveSessionInput {
    focused: Boolean
    busy: Boolean
  }

  type Mutation {
    createActiveSession(input: CreateActiveSessionInput!): ActiveSession!
      @requireAuth(roles: "user")
    updateActiveSession(input: UpdateActiveSessionInput!): ActiveSession
      @requireAuth(roles: "user")
    deleteActiveSession(username: String!): ActiveSession
      @requireAuth(roles: "user")
  }
`
