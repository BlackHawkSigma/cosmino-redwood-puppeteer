import { useRef } from 'react'
import { useEffect } from 'react'

import {
  Form,
  Label,
  TextField,
  PasswordField,
  FieldError,
  Submit,
  useForm,
} from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'

const SignupPage = () => {
  const { isAuthenticated, signUp } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home())
    }
  }, [isAuthenticated])

  // focus on email box on page load
  const usernameRef = useRef<HTMLInputElement>()
  useEffect(() => {
    usernameRef.current.focus()
  }, [])

  const formMethods = useForm()

  const onSubmit = async (data) => {
    const response = await signUp({ ...data, ...{ cosminopwd: data.password } })

    if (response.message) {
      toast.success(response.message)
      formMethods.reset()
    } else if (response.error) {
      toast.error(response.error)
    } else {
      // user is signed in automatically
      toast.success('Welcome!')
    }
  }

  return (
    <>
      <MetaTags title="Signup" />

      <main className="rw-main">
        <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
        <div className="rw-scaffold rw-login-container">
          <div className="rw-segment">
            <header className="rw-segment-header">
              <h2 className="rw-heading rw-heading-primary">
                neuen Benutzer anlegen
              </h2>
            </header>

            <div className="rw-segment-main">
              <div className="rw-form-wrapper">
                <Form
                  formMethods={formMethods}
                  onSubmit={onSubmit}
                  className="rw-form-wrapper"
                  autoComplete="off"
                >
                  {/* username */}
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
                    validation={{
                      required: {
                        value: true,
                        message: 'Username is required',
                      },
                    }}
                  />
                  <FieldError name="username" className="rw-field-error" />

                  {/* password */}
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
                    validation={{
                      required: {
                        value: true,
                        message: 'Password is required',
                      },
                    }}
                  />
                  <FieldError name="password" className="rw-field-error" />

                  {/* cosmino password */}
                  {/*  <Label
                    name="cosminopwd"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Cosmiono Passwort
                  </Label>
                  <PasswordField
                    name="cosminopwd"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    autoComplete="current-password"
                    validation={{
                      required: {
                        value: true,
                        message: 'Password is required',
                      },
                    }}
                  />
                  <FieldError name="cosminopwd" className="rw-field-error" />  */}

                  <div className="rw-button-group">
                    <Submit className="rw-button rw-button-green">
                      anlegen
                    </Submit>
                  </div>
                </Form>
              </div>
            </div>
          </div>
          <div className="rw-login-link">
            <Link to={routes.login()} className="rw-button rw-button-blue">
              zur Anmeldung
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

export default SignupPage
