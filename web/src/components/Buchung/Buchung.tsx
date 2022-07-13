import type {
  CreateBuchungMutation,
  CreateBuchungMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast'

import BuchungForm from 'src/components/BuchungForm/BuchungForm'

const CREATE_BUCHUNG_MUTATION = gql`
  mutation CreateBuchungMutation($input: CreateBuchungInput!) {
    createBuchung(input: $input)
  }
`

type BuchungProps = {
  terminal: string
}

const Buchung = ({ terminal }: BuchungProps) => {
  const [createBuchung, { loading, error }] = useMutation<
    CreateBuchungMutation,
    CreateBuchungMutationVariables
  >(CREATE_BUCHUNG_MUTATION, {
    onCompleted: (data) => {
      toast.success(data.createBuchung)
      navigate(routes.buchen({ terminal: '1' }))
    },
  })

  const onSave = (input) => {
    input = { ...input, terminal }
    createBuchung({ variables: { input } })
  }

  return (
    <div>
      <h2>{'Buchung'}</h2>
      <BuchungForm onSave={onSave} loading={loading} error={error} />
    </div>
  )
}

export default Buchung
