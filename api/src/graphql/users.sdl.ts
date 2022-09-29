export const schema = gql`
  type User {
    id: Int!
    name: String!
    password: String!
    showSuccessCounter: Boolean!
  }

  type Query {
    users: [User!]! @requireAuth
    user(id: Int!): User @requireAuth
  }

  input UpdateUserInput {
    name: String
    showSuccessCounter: Boolean
    password: String
  }

  type Mutation {
    updateUser(id: Int!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: Int!): User! @requireAuth(roles: "admin")
  }
`
