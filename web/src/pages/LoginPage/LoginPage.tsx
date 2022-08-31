import { useEffect, useRef } from 'react'

import { useLocalStorage } from 'usehooks-ts'

import { useAuth } from '@redwoodjs/auth'
import {
  FieldError,
  Form,
  Label,
  PasswordField,
  Submit,
  TextField,
} from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'

const LoginPage = () => {
  const { isAuthenticated, logIn, loading, hasRole } = useAuth()
  const [terminal] = useLocalStorage<string>('terminal', '')

  useEffect(() => {
    if (isAuthenticated) {
      hasRole('admin')
        ? navigate(routes.home())
        : terminal.length > 0
        ? navigate(routes.terminal({ terminal }))
        : navigate(routes.terminals())
    }
  }, [hasRole, isAuthenticated, terminal])

  const usernameRef = useRef<HTMLInputElement>()
  useEffect(() => {
    usernameRef.current.focus()
  }, [])

  const onSubmit = async (data) => {
    const response = await logIn({ ...data })

    if (response.message) {
      toast(response.message)
    } else if (response.error) {
      toast.error(response.error)
    } else {
      toast.success('Welcome back!')
    }
  }

  return (
    <>
      <MetaTags title="Login" />

      <main className="rw-main">
        <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
        <div className="rw-scaffold rw-login-container">
          <div className="rw-segment">
            <header className="rw-segment-header">
              <h2 className="rw-heading rw-heading-primary">Anmeldung</h2>
            </header>

            <div className="rw-segment-main">
              <div className="rw-form-wrapper">
                <Form
                  onSubmit={onSubmit}
                  className="rw-form-wrapper"
                  autoComplete="off"
                >
                  <Label
                    name="username"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Benutzername
                  </Label>
                  <TextField
                    name="username"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    ref={usernameRef}
                    readOnly={loading}
                    validation={{
                      required: {
                        value: true,
                        message: 'Username is required',
                      },
                    }}
                  />

                  <FieldError name="username" className="rw-field-error" />

                  <Label
                    name="password"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Passwort
                  </Label>
                  <PasswordField
                    name="password"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    autoComplete="one-time-code"
                    readOnly={loading}
                    validation={{
                      required: {
                        value: true,
                        message: 'Password is required',
                      },
                    }}
                  />

                  <FieldError name="password" className="rw-field-error" />

                  <div className="rw-button-group">
                    <Submit
                      disabled={loading}
                      className="rw-button rw-button-green"
                    >
                      {loading ? 'anmeldung läuft' : 'anmelden'}
                    </Submit>

                    <Link to={routes.forgotPassword()} className="rw-button ">
                      neues Passwort
                    </Link>
                  </div>
                </Form>
              </div>
            </div>
          </div>
          <div className="rw-login-link">
            <Link to={routes.signup()} className="rw-button rw-button-blue">
              neuen Benutzer anlegen
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

export default LoginPage

// https://support.mozilla.org/en-US/questions/1159231
