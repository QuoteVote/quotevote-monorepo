/* eslint-disable no-param-reassign */
import React from 'react'
import { action } from '@storybook/addon-actions'
import {
  withKnobs,
  color,
  text,
  number,
  boolean,
  files,
} from '@storybook/addon-knobs'

import { ThemeProvider } from '@mui/material/styles'
import theme from '../../themes/SecondTheme'

import { ActivityCard } from './index'

const label = 'Images'
const accept = '.xlsx, .pdf'
const defaultValue = []

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}

export default {
  title: 'Components/ActivityCard',
  component: ActivityCard,
  decorators: [withKnobs],
}

export const Default = () => {
  const name = text('Name', 'Username')
  const date = text('Date', 'Today @ 3:30PM')
  const content = text(
    'Content',
    'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.',
  )
  const cardColor = color('Card Color', '#FFF')
  const upvotes = number('Upvotes', getRandomInt(0, 9999))
  const downvotes = number('Downvotes', getRandomInt(0, 9999))
  const liked = boolean('Liked', false)
  // const avatar = text('Avatar', 'https://i.pravatar.cc/300')
  const width = number('Width', null)
  const onLike = action('liked click')
  const avatar = files(label, accept, defaultValue)

  return (
    <ThemeProvider theme={theme}>
      <ActivityCard
        avatar={avatar}
        cardColor={cardColor}
        name={name}
        date={date}
        upvotes={upvotes}
        downvotes={downvotes}
        liked={liked}
        content={content}
        width={width}
        onLike={onLike}
      />
    </ThemeProvider>
  )
}

export const MinWidth = () => {
  const name = text('Name', 'Username')
  const date = text('Date', 'Today @ 3:30PM')
  const content = text(
    'Content',
    'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.',
  )
  const cardColor = color('Card Color', '#FFF')
  const upvotes = number('Upvotes', getRandomInt(0, 9999))
  const downvotes = number('Downvotes', getRandomInt(0, 9999))
  const liked = boolean('Liked', false)
  const avatar = text('Avatar', 'https://i.pravatar.cc/300')
  const width = number('Width', null)
  const onLike = action('liked click')
  return (
    <ThemeProvider theme={theme}>
      <ActivityCard
        avatar={avatar}
        cardColor={cardColor}
        name={name}
        date={date}
        upvotes={upvotes}
        downvotes={downvotes}
        liked={liked}
        content={content}
        width={width}
        onLike={onLike}
      />
    </ThemeProvider>
  )
}

export const Mock = () => {
  const name = text('Name', 'Username')
  const date = text('Date', 'Today @ 3:30PM')
  const content = text(
    'Content',
    'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.',
  )
  const upvotes = number('Upvotes', getRandomInt(0, 9999))
  const downvotes = number('Downvotes', getRandomInt(0, 9999))
  const liked = boolean('Liked', false)
  const onLike = action('liked click')
  const width = number('Width', null)
  const avatar = text('Avatar', 'https://i.pravatar.cc/300')
  const mockColor = color('Card Color', '#ff6060')

  return (
    <ThemeProvider theme={theme}>
      <ActivityCard
        avatar={avatar}
        cardColor={mockColor}
        name={name}
        date={date}
        upvotes={upvotes}
        downvotes={downvotes}
        liked={liked}
        content={content}
        width={width}
        onLike={onLike}
      />
    </ThemeProvider>
  )
}
