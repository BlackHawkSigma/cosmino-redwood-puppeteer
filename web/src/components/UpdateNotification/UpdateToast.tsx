const UpdateToast = () => (
  <div className="rounded border-l-4 border-l-orange-500 bg-orange-300 p-2">
    neue Version verfügbar!{' '}
    <button className="underline" onClick={() => window.location.reload()}>
      aktualisieren
    </button>
  </div>
)

export default UpdateToast
