import React from 'react'
import { ThemeProvider } from '@mui/material/styles'
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
    expect(loadingIndicator.container.firstChild).toMatchSnapshot()
  })
})
// No-op placeholder. Tests live in the .test.jsx file.
export {}
