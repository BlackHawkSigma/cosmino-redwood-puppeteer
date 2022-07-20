// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route, Private } from '@redwoodjs/router'

import MainLayout from 'src/layouts/MainLayout'

const Routes = () => {
  return (
    <Router>
      <Private unauthenticated="login" wrap={MainLayout}>
        <Route path="/terminal" page={TerminalPage} name="terminal" />
        <Route path="/buchen/{terminal}" page={BuchenPage} name="buchen" />
        <Route path="/sessions" page={SessionsPage} name="sessions" />
        <Route path="/" page={HomePage} name="home" />
      </Private>

      <Route path="/login" page={LoginPage} name="login" />
      <Route path="/signup" page={SignupPage} name="signup" />

      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
