import { useEffect, useRef } from 'react'

import {
  FieldError,
  Form,
  FormError,
  Label,
  Submit,
  TextField,
  useForm,
} from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'

const BuchungForm = (props) => {
  const formMethods = useForm()
  const codeRef = useRef<HTMLInputElement>()
  useEffect(() => {
    codeRef.current.focus()
  }, [])

  const onSubmit = (data) => {
    props.onSave(data)
    formMethods.reset()
    codeRef.current.focus()
  }

  const onBlur = () => {
    const { code } = formMethods.getValues()

    if (code) {
      onSubmit({ code })
    }
  }

  return (
    <div className="rw-form-wrapper">
      <Form formMethods={formMethods} onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="code"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Barcode
        </Label>
        <TextField
          name="code"
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          ref={codeRef}
          validation={{ required: 'Bitte Barcode eingeben' }}
          autoComplete="off"
          autoFocus // eslint-disable-line
          onBlur={() => onBlur()}
        />
        <FieldError name="code" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            buchen
          </Submit>
          <button
            className="rw-button rw-button-red"
            onClick={() => navigate(routes.home())}
          >
            abbrechen
          </button>
        </div>
      </Form>
    </div>
  )
}

export default BuchungForm
