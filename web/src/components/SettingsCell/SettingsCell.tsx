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
  PasswordField,
  Submit,
} from '@redwoodjs/forms'
import { CellSuccessProps, CellFailureProps, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

export const QUERY = gql`
  query SettingsQuery($userId: Int!) {
    user(id: $userId) {
      id
      name
      password
      showSuccessCounter
      directMode
    }
  }
`

const UPDATE_SETTINGS_MUTATION = gql`
  mutation UpdateSettings($userId: Int!, $input: UpdateUserInput!) {
    updateUser(id: $userId, input: $input) {
      id
      showSuccessCounter
      directMode
    }
  }
`

export const Loading = () => <div>Lade Einstellungen...</div>

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

              <div className="flex items-baseline justify-start gap-4 ">
                <CheckboxField
                  name="showSuccessCounter"
                  className="rw-input"
                  errorClassName="rw-input rw-input-error"
                  defaultChecked={user.showSuccessCounter}
                  disabled={loading}
                />
                <FieldError
                  name="showSuccessCounter"
                  className="rw-field-error"
                />
                <Label
                  name="showSuccessCounter"
                  className="rw-label"
                  errorClassName="rw-label p-4 rw-label-error"
                >
                  Zähler auf Monitor anzeigen
                </Label>
              </div>

              <div className="flex items-baseline justify-start gap-4 ">
                <CheckboxField
                  name="directMode"
                  className="rw-input"
                  errorClassName="rw-input rw-input-error"
                  defaultChecked={user.directMode}
                  disabled={loading}
                />
                <FieldError name="directMode" className="rw-field-error" />
                <Label
                  name="directMode"
                  className="rw-label"
                  errorClassName="rw-label rw-label-error"
                >
                  Direkter Modus
                </Label>
              </div>

              <Label
                name="password"
                className="rw-label"
                errorClassName="rw-label rw-label-error"
              >
                Cosmino Passwort
              </Label>
              <PasswordField
                name="password"
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                defaultValue={user.password}
                disabled={loading}
              />

              <FieldError name="password" className="rw-field-error" />

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
