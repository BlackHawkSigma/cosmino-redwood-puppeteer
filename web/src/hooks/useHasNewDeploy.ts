import { useRef, useState } from 'react'

import { useInterval } from 'usehooks-ts'

export const useHasNewDeploy = () => {
  const versionRef = useRef()
  const [hasNewDeploy, setHasNewDeploy] = useState(false)

  useInterval(async () => {
    const { version, errors } = await fetch(
      `${global.RWJS_API_URL}/hasNewDeploy`
    ).then((res) => res.json())

    if (errors) {
      return
    }

    // console.log({ last: versionRef.current, current: version })

    if (versionRef.current && version !== versionRef.current) {
      setHasNewDeploy(true)
    }

    versionRef.current = version
  }, 60_000)

  return hasNewDeploy
}
