import ScannerHandler from './ScannerHandler'

export const generated = () => {
  return <ScannerHandler onFire={() => {}} />
}

export const loading = () => {
  return <ScannerHandler loading={'lade'} onFire={() => {}} />
}

export default { title: 'Components/ScannerHandler' }
