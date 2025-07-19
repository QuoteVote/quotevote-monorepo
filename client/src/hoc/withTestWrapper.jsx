import React from 'react'
import { PersistGate } from 'redux-persist/integration/react'
import { ApolloProvider } from '@apollo/react-hooks'
import { Provider } from 'react-redux'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import store, { persistor } from '../store/store'
import client from '../config/apollo'
import customTheme from '../theme'
const hist = createBrowserHistory()
const theme = createTheme(customTheme)

const withTestWrapper = (Component) => (props) => (
  <ApolloProvider client={client}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <Router history={hist}>
            <Component {...props} />
          </Router>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </ApolloProvider>
)
export default withTestWrapper
