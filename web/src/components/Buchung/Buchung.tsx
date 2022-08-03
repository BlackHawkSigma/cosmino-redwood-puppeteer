import { useCallback, useState } from 'react'

import type {
  CreateBuchungMutation,
  CreateBuchungMutationVariables,
  UpdateActiveSessionMutation,
  UpdateActiveSessionMutationVariables,
} from 'types/graphql'

import { FormError } from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast'

import BuchungLog, { Logs } from 'src/components/BuchungLog'
import ScannerHandler from 'src/components/ScannerHandler'

const CREATE_BUCHUNG_MUTATION = gql`
  mutation CreateBuchungMutation($input: CreateBuchungInput!) {
    createBuchung(input: $input) {
      id
      timestamp
      code
      type
      message
      imageUrl
    }
  }
`

const UPDATE_ACTIVESESSION_MUTATION = gql`
  mutation UpdateActiveSessionMutation($input: UpdateActiveSessionInput!) {
    updateActiveSession(input: $input) {
      username
    }
  }
`

type BuchungProps = {
  terminal: string
}

const Buchung = ({ terminal }: BuchungProps) => {
  const [logs, setLogs] = useState<Logs[]>([])

  const [createBuchung, { loading, error, data }] = useMutation<
    CreateBuchungMutation,
    CreateBuchungMutationVariables
  >(CREATE_BUCHUNG_MUTATION, {
    onCompleted: ({ createBuchung }) => {
      setLogs(
        [...logs, createBuchung]
          .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
          .slice(0, 5)
      )
      switch (createBuchung.type) {
        case 'success':
          toast.success(createBuchung.message)
          break
        case 'error':
          toast.error(createBuchung.message)
          break
        default:
          toast(JSON.stringify(createBuchung))
      }
    },
  })

  const [updateActiveSession] = useMutation<
    UpdateActiveSessionMutation,
    UpdateActiveSessionMutationVariables
  >(UPDATE_ACTIVESESSION_MUTATION)

  const onSave = (input) => {
    input = { ...input, terminal }
    createBuchung({ variables: { input } })
  }

  const onFocusChange = useCallback(
    (focused) => updateActiveSession({ variables: { input: { focused } } }),
    [updateActiveSession]
  )

  return (
    <div>
      <h2>{'Buchung'}</h2>
      <FormError
        error={error}
        wrapperClassName="rw-form-error-wrapper"
        titleClassName="rw-form-error-title"
        listClassName="rw-form-error-list"
      />

      <ScannerHandler
        loading={loading && 'wird gesendet'}
        onFocusChange={onFocusChange}
        onFire={(code) => onSave({ code })}
      />

      {data?.createBuchung.imageUrl && (
        <img src={data.createBuchung.imageUrl} alt="letze scannung" />
      )}

      <div className="text-3xl">
        <BuchungLog logs={logs} />
      </div>
    </div>
  )
}

export default Buchung
