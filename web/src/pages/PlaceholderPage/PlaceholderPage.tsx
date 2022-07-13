import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const PlaceholderPage = () => {
  return (
    <>
      <MetaTags title="Placeholder" description="Placeholder page" />

      <h1>PlaceholderPage</h1>
      <p>
        Find me in <code>./web/src/pages/PlaceholderPage/PlaceholderPage.tsx</code>
      </p>
      <p>
        My default route is named <code>placeholder</code>, link to me with `
        <Link to={routes.placeholder()}>Placeholder</Link>`
      </p>
    </>
  )
}

export default PlaceholderPage
