export const schema = gql`
  type ServerStats {
    memoryUsage: Float!
  }

  type Query {
    serverStatus: ServerStats! @skipAuth
  }
`
