/*!

=========================================================
* Material Dashboard PRO React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import { ApolloProvider } from '@apollo/react-hooks'
import { createBrowserHistory } from 'history'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import {
  Redirect, Route, Router, Switch,
} from 'react-router-dom'
import AuthLayout from 'layouts/Auth'
import client from 'config/apollo'
import React from 'react'
import { HelmetProvider } from 'react-helmet-async';
import ReactDOM from 'react-dom'
import Scoreboard from 'layouts/Scoreboard'
import TokenExpired from 'layouts/TokenExpired'
import store, { persistor } from 'store/store'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import customTheme from './theme'
import 'assets/scss/material-dashboard-pro-react.scss'
import LogoutPage from './components/LogoutPage'

import { AuthModalProvider } from './Context/AuthModalContext'

import 'fontsource-montserrat'
import ErrorPage from './mui-pro/views/Pages/ErrorPage'

Bugsnag.start({
  apiKey: '8abc6ef921198b96692efde8ec89b695',
  plugins: [new BugsnagPluginReact()],
})

const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React)

const hist = createBrowserHistory()
hist.listen(() => {
  window.scrollTo(0, 0)
})

const theme = createTheme(customTheme)

ReactDOM.render(
  <ErrorBoundary>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <HelmetProvider>
              <AuthModalProvider>
                <Router history={hist}>
                  <Switch>
                    <Route path="/auth" component={AuthLayout} />
                    <Route path="/unauth" component={TokenExpired} />
                    <Route path="/logout" component={LogoutPage} />
                    <Route path="/error" component={ErrorPage} />
                    <Route path="/" component={Scoreboard} />
                    <Redirect from="*" to="/search" />
                  </Switch>
                </Router>
              </AuthModalProvider>
            </HelmetProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </ApolloProvider>
  </ErrorBoundary>,
  document.getElementById('root'),
)