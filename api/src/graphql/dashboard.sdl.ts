export const schema = gql`
  type Dashboard {
    Terminal: Terminal!
    Logs: [BuchungsLog!]!
    successCount: Int
  }

  type Query {
    dashboard: [Dashboard!]! @skipAuth
  }
`
