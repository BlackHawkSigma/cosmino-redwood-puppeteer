export const schema = gql`
  type Terminal {
    id: Int!
    name: String!
    user: User
    busy: Boolean
    focused: Boolean
    lastSuccessImgUrl: String
    loggedInAt: DateTime
  }

  type Query {
    terminals: [Terminal!]! @skipAuth
    terminalById(id: Int!): Terminal! @requireAuth(roles: "user")
    terminalByUserId(userId: Int!): Terminal! @requireAuth(roles: "user")
  }

  input UpdateTerminalInput {
    focused: Boolean
    busy: Boolean
    lastSuccessImgUrl: String
  }

  type Mutation {
    claimTerminal(id: Int!, userId: Int!): Terminal! @requireAuth(roles: "user")
    updateTerminal(id: Int!, input: UpdateTerminalInput!): Terminal!
      @requireAuth(roles: "user")
    unclaimTerminal(id: Int!): Terminal! @skipAuth
  }
`
