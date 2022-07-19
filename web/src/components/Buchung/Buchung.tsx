import { useState } from 'react'

import type {
  CreateBuchungMutation,
  CreateBuchungMutationVariables,
} from 'types/graphql'

import { FormError } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast'

import BuchungLog, { Logs } from 'src/components/BuchungLog'
import ScannerHandler from 'src/components/ScannerHandler'

const CREATE_BUCHUNG_MUTATION = gql`
  mutation CreateBuchungMutation($input: CreateBuchungInput!) {
    createBuchung(input: $input) {
      code
      type
      message
    }
  }
`

type BuchungProps = {
  terminal: string
}

const Buchung = ({ terminal }: BuchungProps) => {
  const [logs, setLogs] = useState<Logs[]>([])

  const [createBuchung, { loading, error }] = useMutation<
    CreateBuchungMutation,
    CreateBuchungMutationVariables
  >(CREATE_BUCHUNG_MUTATION, {
    onCompleted: ({ createBuchung }) => {
      setLogs(
        [
          ...logs,
          {
            timestamp: new Date(),
            code: createBuchung.code,
            message: createBuchung.message,
            type: createBuchung.type,
          },
        ]
          // @ts-expect-error: timestamp is Date
          .sort((a, b) => b.timestamp.valueOf() - a.timestamp.valueOf())
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
      navigate(routes.buchen({ terminal }))
    },
  })

  const onSave = (input) => {
    input = { ...input, terminal }
    createBuchung({ variables: { input } })
  }

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
        onFire={(code) => onSave({ code })}
      />

      <BuchungLog logs={logs} />
    </div>
  )
}

export default Buchung
