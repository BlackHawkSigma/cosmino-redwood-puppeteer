export const schema = gql`
  type Terminal {
    id: String!
    name: String!
  }

  type Query {
    terminals: [Terminal!]! @skipAuth
  }
`
