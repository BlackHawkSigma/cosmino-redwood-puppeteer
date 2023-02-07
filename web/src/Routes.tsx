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

import { useAuth } from './auth'

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <Route path="/fehlende-buchungen" page={MissingDataPage} name="missingData" />
      <Route path="/dashboard/{type:string}" page={DashboardPage} name="dashboard" />
      <Route path="/sessions" page={SessionsPage} name="sessions" />

      <Private unauthenticated="login" whileLoadingAuth={() => <WhileLoadingAuth />} wrap={MainLayout}>
        <Route path="/settings" page={SettingsPage} name="settings" />
        <Route path="/terminals" page={TerminalsPage} name="terminals" />
        <Route path="/terminal/{terminal:int}" page={TerminalPage} name="terminal" />
        <Route path="/" page={HomePage} name="home" />
      </Private>

      <Route path="/login" page={LoginPage} name="login" />
      <Route path="/signup" page={SignupPage} name="signup" />
      <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
      <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />

      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
