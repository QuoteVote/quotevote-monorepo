// Important stuff, must always be imported on a storybook file
import React from 'react'
import { withKnobs } from '@storybook/addon-knobs/react'
import { withA11y } from '@storybook/addon-a11y'

// If you want to apply theme
import { as ThemeProvider, ThemeProvider as MuiThemeProvider } from '@mui/material/styles'

// The component
import ControlPanel from './ControlPanel'

import theme from '../../themes/MainTheme'

// Story config
export default {
  title: 'ControlPanel',
  argTypes: { onClick: { action: 'clicked' }, onChange: { action: 'typing' } },
  component: ControlPanel,
  decorators: [withKnobs, withA11y],
}

function Wrapper() {
  return (
    <ThemeProvider theme={theme}>
      <ControlPanel />
    </ThemeProvider>
  )
}

export const base = () => <Wrapper />

base.story = {
  parameters: {
    jest: ['ControlPanel.test.js'],
  },
}
