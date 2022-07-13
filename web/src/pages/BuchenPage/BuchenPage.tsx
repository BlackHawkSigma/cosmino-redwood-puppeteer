import { useParams } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import Buchung from 'src/components/Buchung'

const BuchenPage = () => {
  const { terminal } = useParams()
  return (
    <>
      <MetaTags title="Buchen" description="Buchen page" />

      <div className="container mx-auto">
        <h1>Terminal {terminal}</h1>
        <div>
          <Buchung terminal={terminal} />
        </div>
      </div>
    </>
  )
}

export default BuchenPage
