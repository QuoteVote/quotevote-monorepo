// Important stuff, must always be imported on a storybook file
import React from 'react'
import { withKnobs } from '@storybook/addon-knobs/react'
import { withA11y } from '@storybook/addon-a11y'

// If you want to apply theme
import { ThemeProvider } from '@mui/material/styles'

// The component
import Login from './Login'

import theme from '../../themes/MainTheme'

// Story config
export default {
  title: 'Login',
  argTypes: { onClick: { action: 'clicked' }, onChange: { action: 'typing' } },
  component: Login,
  decorators: [withKnobs, withA11y],
}

function Wrapper() {
  return (
    <ThemeProvider theme={theme}>
      <Login />
    </ThemeProvider>
  )
}

export const base = () => <Wrapper />

base.story = {
  parameters: {
    jest: ['Login.test.js'],
  },
}
