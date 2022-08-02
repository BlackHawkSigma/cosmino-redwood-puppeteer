import { useEffect } from 'react'

import { useLocalStorage } from 'usehooks-ts'

import { toast } from '@redwoodjs/web/dist/toast'

import { useHasNewDeploy } from 'src/hooks/useHasNewDeploy'

import UpdateToast from './UpdateToast'

const UpdateNotification = () => {
  const hasNewDeploy = useHasNewDeploy()
  const [autoUpdate] = useLocalStorage('auto-update', '')

  const doAutoUpdate = autoUpdate === 'auto'

  useEffect(() => {
    hasNewDeploy && doAutoUpdate && window.location.reload()

    hasNewDeploy &&
      !doAutoUpdate &&
      toast.custom(<UpdateToast />, {
        duration: Infinity,
        position: 'bottom-left',
        id: 'updateNotification',
      })
  }, [doAutoUpdate, hasNewDeploy])

  return <></>
}

export default UpdateNotification
