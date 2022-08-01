import { useEffect } from 'react'

import type {
  CreateSessionMutation,
  CreateSessionMutationVariables,
  KillSessionMutation,
  KillSessionMutationVariables,
} from 'types/graphql'

import { useAuth } from '@redwoodjs/auth'
import { Link, routes, useParams } from '@redwoodjs/router'
import { MetaTags, useMutation } from '@redwoodjs/web'

import Buchung from 'src/components/Buchung'

const CREATE_SESSION = gql`
  mutation CreateSessionMutation($input: CreateActiveSessionInput!) {
    createActiveSession(input: $input) {
      username
    }
  }
`
const KILL_SESSION = gql`
  mutation KillSessionMutation($username: String!) {
    deleteActiveSession(username: $username) {
      username
    }
  }
`

const BuchenPage = () => {
  const { currentUser } = useAuth()
  const { terminal } = useParams()
  const [createSession, { data, loading }] = useMutation<
    CreateSessionMutation,
    CreateSessionMutationVariables
  >(CREATE_SESSION, {
    variables: { input: { username: currentUser?.name, terminal } },
  })

  const [killSession] = useMutation<
    KillSessionMutation,
    KillSessionMutationVariables
  >(KILL_SESSION, {
    variables: { username: currentUser?.name },
  })

  useEffect(() => {
    if (!terminal || !currentUser || data || loading) return
    createSession()
  }, [createSession, currentUser, data, loading, terminal])

  useEffect(() => {
    return () => {
      killSession()
    }
  }, [killSession])

  return (
    <>
      <MetaTags title="Buchen" description="Buchen page" />

      <div className="container mx-auto">
        <h1>
          Terminal {terminal}{' '}
          <span className="text-sm text-gray-600 underline">
            <Link to={routes.terminal()}>ändern</Link>
          </span>
        </h1>
        <div>
          <Buchung terminal={terminal} />
        </div>
      </div>
    </>
  )
}

export default BuchenPage
