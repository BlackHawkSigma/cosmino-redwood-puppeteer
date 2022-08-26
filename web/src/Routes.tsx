// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route, Private } from '@redwoodjs/router'

import WhileLoadingAuth from 'src/components/WhileLoadingAuth/WhileLoadingAuth'
import MainLayout from 'src/layouts/MainLayout'

const Routes = () => {
  return (
    <Router>
      <Route path="/dashboard/{type:string}" page={DashboardPage} name="dashboard" />
      <Route path="/sessions" page={SessionsPage} name="sessions" />

      <Private unauthenticated="login" whileLoadingAuth={() => <WhileLoadingAuth />} wrap={MainLayout}>
        <Route path="/settings" page={SettingsPage} name="settings" />
        <Route path="/terminal" page={TerminalPage} name="terminal" />
        <Route path="/buchen/{terminal:string}" page={BuchenPage} name="buchen" />
        <Route path="/" page={HomePage} name="home" />
      </Private>

      <Route path="/login" page={LoginPage} name="login" prerender />
      <Route path="/signup" page={SignupPage} name="signup" prerender />
      <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
      <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />

      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
