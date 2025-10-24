// Important stuff, must always be imported on a storybook file
import React from 'react'
import { withKnobs } from '@storybook/addon-knobs/react'
import { withA11y } from '@storybook/addon-a11y'

// If you want to apply theme
import { ThemeProvider } from '@mui/material/styles'

// The component
import Unauthorized from './Unauthorized'

import theme from '../../themes/MainTheme'

// Story config
export default {
  title: 'Unauthorized',
  argTypes: { onClick: { action: 'clicked' }, onChange: { action: 'typing' } },
  component: Unauthorized,
  decorators: [withKnobs, withA11y],
}

function Wrapper() {
  return (
    <ThemeProvider theme={theme}>
      <Unauthorized />
    </ThemeProvider>
  )
}

export const base = () => <Wrapper />

base.story = {
  parameters: {
    jest: ['Unauthorized.test.js'],
  },
}
