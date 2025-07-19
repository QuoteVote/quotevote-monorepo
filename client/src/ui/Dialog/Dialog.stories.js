import React from 'react'
import { action } from '@storybook/addon-actions'
import { withKnobs, text, number } from '@storybook/addon-knobs'

import { ThemeProvider } from '@mui/material/styles'
import theme from '../../themes/SecondTheme'

import { Dialog } from './index'

export default {
  title: 'Components/Dialog',
  component: Dialog,
  decorators: [withKnobs],
}

export const Default = () => {
  const title = text('Title', 'Title')
  const body = text('Body', 'Body')
  const width = number('Width', null)
  const confirmText = text('Confirm Text', 'Confirm')
  const onCancel = action('cancelled')
  const onConfirm = action('confirmed')

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        title={title}
        body={body}
        width={width}
        confirmText={confirmText}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    </ThemeProvider>
  )
}

export const Mock = () => {
  const title = text('Title', 'Do you want to discard this post?')
  const body = text(
    'Body',
    'If you prefer continue later you can save the content and write when you have time.',
  )
  const width = number('Width', null)
  const confirmText = text('Confirm Text', 'Decline')
  const onCancel = action('cancelled')
  const onConfirm = action('confirmed')

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        title={title}
        body={body}
        width={width}
        confirmText={confirmText}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    </ThemeProvider>
  )
}
