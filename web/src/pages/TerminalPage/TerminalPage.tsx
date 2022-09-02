import { useEffect } from 'react'

import type {
  ClaimTerminalMutation,
  ClaimTerminalMutationVariables,
  ReleaseTerminalMutation,
  ReleaseTerminalMutationVariables,
} from 'types/graphql'

import { useAuth } from '@redwoodjs/auth'
import { Link, routes, useParams } from '@redwoodjs/router'
import { MetaTags, useMutation } from '@redwoodjs/web'

import Buchung from 'src/components/Buchung'

const CLAIM_TERMINAL = gql`
  mutation ClaimTerminalMutation($id: Int!, $userId: Int!) {
    claimTerminal(id: $id, userId: $userId) {
      id
      name
      user {
        name
      }
    }
  }
`
const RELEASE_TERMINAL = gql`
  mutation ReleaseTerminalMutation($id: Int!) {
    unclaimTerminal(id: $id) {
      id
      user {
        name
      }
    }
  }
`

const TerminalPage = () => {
  const { currentUser } = useAuth()
  const { terminal } = useParams()
  const [claim, { data, loading }] = useMutation<
    ClaimTerminalMutation,
    ClaimTerminalMutationVariables
  >(CLAIM_TERMINAL, {
    variables: { id: +terminal, userId: currentUser.id },
  })

  const [free] = useMutation<
    ReleaseTerminalMutation,
    ReleaseTerminalMutationVariables
  >(RELEASE_TERMINAL, {
    variables: { id: +terminal },
  })

  useEffect(() => {
    if (!terminal || !currentUser || data || loading) return
    claim()
  }, [claim, currentUser, data, loading, terminal])

  useEffect(() => {
    return () => {
      free()
    }
  }, [free])

  return (
    <>
      <MetaTags
        title={`Terminal ${terminal}`}
        description={`Terminal ${terminal}`}
      />

      <div className="container mx-auto">
        <h1>
          Terminal {terminal}{' '}
          <span className="text-sm text-gray-600 underline">
            <Link to={routes.terminals()}>ändern</Link>
          </span>
        </h1>
        <div>
          <Buchung terminalId={+terminal} username={currentUser.name} />
        </div>
      </div>
    </>
  )
}

export default TerminalPage
