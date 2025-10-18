// Provide a default mock for useMutation to avoid importing the real
// Apollo hooks during test import analysis.
if (typeof vi !== 'undefined' && typeof vi.mock === 'function') {
  vi.mock('@apollo/react-hooks', async (importOriginal) => {
    const actual = await importOriginal()
    return { ...actual, useMutation: () => [vi.fn()] }
  })
}

import React from 'react'
import { render } from '@testing-library/react'

// Component being tested
import Comment from './Comment'
import withTestWrapper from '../../hoc/withTestWrapper'

const comment = {
  user: {
    name: 'John',
    avatar: 'J',
    username: 'jdoe',
  },
  content: 'TEST',
  created: '2020-11-01',
}

function CommentData() {
  return (<Comment comment={comment} />)
}

const CommentPostWrapper = withTestWrapper(CommentData)

describe('Comment test -', () => {
  it('renders correctly', () => {
    const { container } = render(
      <CommentPostWrapper />
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})
