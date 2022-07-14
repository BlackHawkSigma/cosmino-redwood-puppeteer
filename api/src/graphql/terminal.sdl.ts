export const schema = gql`
  type Terminal {
    name: String!
  }

  type Query {
    terminals: [Terminal!]! @skipAuth
  }
`
