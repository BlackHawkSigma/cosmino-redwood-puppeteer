import { useEffect, useReducer, useState } from 'react'

type TextAction =
  | { type: 'add'; character: string }
  | { type: 'fire' }
  | { type: 'reset' }

type ScannerHandlerProps = {
  loading?: string
  onFire: (text: string) => void
}

const ScannerHandler = ({ loading, onFire }: ScannerHandlerProps) => {
  const [windowIsFocused, setWindowIsFocused] = useState<boolean>(() =>
    document.hasFocus()
  )

  const [text, dispatch] = useReducer(
    (state: string, action: TextAction): string => {
      switch (action.type) {
        case 'add':
          return `${state}${action.character}`
        case 'fire':
          onFire(state)
          return ''
        case 'reset':
          return ''
        default:
          throw new Error(`Unknown action type`)
      }
    },
    ''
  )

  useEffect(() => {
    const onFocus = () => setWindowIsFocused(true)
    const onBlur = () => setWindowIsFocused(false)

    const onKeyUp = (ev: KeyboardEvent) => {
      const { key } = ev

      switch (key) {
        case 'Tab':
          ev.preventDefault()
          return dispatch({ type: 'fire' })
        case 'Escape':
          return dispatch({ type: 'reset' })
        default:
          return dispatch({ type: 'add', character: ev.key })
      }
    }

    window.addEventListener('focus', onFocus)
    window.addEventListener('blur', onBlur)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  return (
    <div
      className={`h-32 border-8 rounded-2xl p-4 flex flex-col justify-between ${
        windowIsFocused ? 'border-lime-500' : 'border-red-600'
      }`}
    >
      <p>
        <code className="font-semibold font-mono text-3xl">
          {loading ? (
            <span className="animate-pulse text-gray-500">{loading}</span>
          ) : (
            <span>{text}</span>
          )}
        </code>
      </p>
      <button
        className="self-end rounded bg-slate-200 py-1 px-2 shadow border-slate-300 active:scale-90"
        onClick={() => dispatch({ type: 'reset' })}
      >
        Reset
      </button>
    </div>
  )
}

export default ScannerHandler