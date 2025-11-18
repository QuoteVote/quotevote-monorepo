import React from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import theme from 'themes/SecondTheme'
import { render } from '@testing-library/react'

import { Dialog } from '..'

describe('<Dialog  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(
      <ThemeProvider theme={theme}>
        <Dialog />
      </ThemeProvider>,
    )
    expect(loadingIndicator.container.firstChild).toBeTruthy()
  })
})
