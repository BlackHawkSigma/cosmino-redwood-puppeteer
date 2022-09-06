import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const MissingDataPage = () => {
  return (
    <>
      <MetaTags title="MissingData" description="MissingData page" />

      <h1>MissingDataPage</h1>
      <p>
        Find me in <code>./web/src/pages/MissingDataPage/MissingDataPage.tsx</code>
      </p>
      <p>
        My default route is named <code>missingData</code>, link to me with `
        <Link to={routes.missingData()}>MissingData</Link>`
      </p>
    </>
  )
}

export default MissingDataPage
