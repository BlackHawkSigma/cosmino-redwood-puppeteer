import { useEffect, useState } from 'react'

type ScannerHandlerProps = {
  loading?: string
  onFocusChange: (focused: boolean) => void
  onFire: (text: string) => void
}

const ScannerHandler = ({
  loading,
  onFocusChange,
  onFire,
}: ScannerHandlerProps) => {
  const [windowIsFocused, setWindowIsFocused] = useState<boolean>(() =>
    document.hasFocus()
  )

  const [pressedKey, setPressedKey] = useState<string>('')
  const [text, setText] = useState<string>('')

  useEffect(() => {
    const onFocus = () => setWindowIsFocused(true)
    const onBlur = () => setWindowIsFocused(false)

    const onKeyDown = (ev: KeyboardEvent) => {
      const { key } = ev
      ev.preventDefault()
      setPressedKey(key)
    }

    window.addEventListener('focus', onFocus)
    window.addEventListener('blur', onBlur)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  useEffect(() => {
    onFocusChange(windowIsFocused)
  }, [windowIsFocused, onFocusChange])

  useEffect(() => {
    switch (pressedKey) {
      case 'Tab':
      case 'Enter':
        onFire(text)
        setText('')
        break
      case 'Escape':
        setText('')
        break
      default:
        setText((text) => text + pressedKey)
    }
    setPressedKey('')
  }, [onFire, pressedKey, text])

  return (
    <div
      className={`flex h-32 flex-col justify-between rounded-2xl border-8 p-4 ${
        windowIsFocused ? 'border-lime-500' : 'border-red-600'
      }`}
    >
      <p>
        <code className="font-mono text-3xl font-semibold">
          {loading ? (
            <span className="animate-pulse text-gray-500">{loading}</span>
          ) : (
            <span>{text}</span>
          )}
        </code>
      </p>
      <button
        className="self-end rounded border-slate-300 bg-slate-200 py-1 px-2 shadow active:scale-90"
        onClick={() => setText('')}
      >
        Reset
      </button>
    </div>
  )
}

export default ScannerHandler
