import type {
  SettingsQuery,
  UpdateSettings,
  UpdateSettingsVariables,
} from 'types/graphql'

import {
  CheckboxField,
  FieldError,
  Form,
  FormError,
  Label,
  Submit,
} from '@redwoodjs/forms'
import { CellSuccessProps, CellFailureProps, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

export const QUERY = gql`
  query SettingsQuery($userId: Int!) {
    user(id: $userId) {
      id
      name
      settings {
        showSuccessCounter
      }
    }
  }
`

const UPDATE_SETTINGS_MUTATION = gql`
  mutation UpdateSettings($userId: Int!, $input: UpdateUserInput!) {
    updateUser(id: $userId, input: $input) {
      settings {
        showSuccessCounter
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ user }: CellSuccessProps<SettingsQuery>) => {
  const [update, { error, loading }] = useMutation<
    UpdateSettings,
    UpdateSettingsVariables
  >(UPDATE_SETTINGS_MUTATION, {
    onCompleted: () => {
      toast.success('Einstellungen aktualisiert')
    },
    refetchQueries: [{ query: QUERY, variables: { userId: user.id } }],
  })

  const onSubmit = (input) => {
    update({ variables: { userId: user.id, input } })
  }
  return (
    <div className="px-4">
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Einstellungen für <span className="font-mono">{user.name}</span>
          </h2>
        </header>
        <div className="rw-segment-main">
          <div className="rw-form-wrapper px-4">
            <Form onSubmit={onSubmit} error={error}>
              <FormError
                error={error}
                wrapperClassName="rw-form-error-wrapper"
                titleClassName="rw-form-error-title"
                listClassName="rw-form-error-list"
              />

              <div className="flex items-baseline justify-start gap-4 rounded bg-slate-100">
                <CheckboxField
                  name="showSuccessCounter"
                  className="rw-input"
                  errorClassName="rw-input rw-input-error"
                  defaultChecked={user.settings.showSuccessCounter}
                />
                <FieldError
                  name="showSuccessCounter"
                  className="rw-field-error"
                />
                <Label
                  name="showSuccessCounter"
                  className="rw-label rounded bg-slate-200 p-4"
                  errorClassName="rw-label p-4 rw-label-error"
                >
                  Zähler auf Monitor anzeigen
                </Label>
              </div>

              <Submit
                disabled={loading}
                className="rw-button rw-button-blue mt-4"
              >
                Speichern
              </Submit>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
