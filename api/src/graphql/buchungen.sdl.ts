export const schema = gql`
  type BuchungsLog {
    timestamp: DateTime!
    code: String!
    type: String!
    message: String!
  }

  type Query {
    lastFiveLogsByUser(username: String!): [BuchungsLog!]! @skipAuth
  }
`
