export const schema = gql`
  type BuchungsLog {
    id: Int!
    timestamp: DateTime!
    code: String!
    type: String!
    message: String!
  }

  type Query {
    lastFiveLogsByUser(username: String!): [BuchungsLog!]! @skipAuth
  }
`
