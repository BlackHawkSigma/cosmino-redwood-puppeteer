export const schema = gql`
  type ActiveSession {
    id: String!
    username: String!
    terminal: String!
    busy: Boolean
    focused: Boolean
    lastSuccessImgUrl: String
  }

  type Query {
    activeSessions: [ActiveSession!]! @skipAuth
  }

  input CreateActiveSessionInput {
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
