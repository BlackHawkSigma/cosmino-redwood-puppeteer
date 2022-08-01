import { actions } from '@storybook/addon-actions'

import ScannerHandler from './ScannerHandler'

const eventsFromNames = actions('onFire', 'onFocusChange')

export const generated = () => {
  return <ScannerHandler {...eventsFromNames} />
}

export const loading = () => {
  return <ScannerHandler loading={'lade'} {...eventsFromNames} />
}

export default { title: 'Components/ScannerHandler' }
