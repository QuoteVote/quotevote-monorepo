import { vi } from 'vitest'

vi.mock('store/user', () => ({
  tokenValidator: vi.fn(),
}))

import React from 'react'
// Rely on centralized Apollo mock in src/test-setup-mocks.js
import { render, act } from '@testing-library/react'

// Component being tested
import PostActionCard from './PostActionCard'
import withTestWrapper from '../../hoc/withTestWrapper'

const postAction = {
  _id: '1234',
  user: {
    name: 'John',
    avatar: 'J',
    username: 'jdoe',
  },
  content: 'TEST',
  created: '2020-11-01',
}

function PostActionCardWithProps() {
  return (<PostActionCard postAction={postAction} postUrl="" selected />)
}

const PostActionCardWrapper = withTestWrapper(PostActionCardWithProps)

describe('PostActionCard test -', () => {
  it('renders correctly', async () => {
    let container
    await act(async () => {
      const res = render(
        <PostActionCardWrapper />
      )
      container = res.container
    })
    expect(container.firstChild).toMatchSnapshot()
  })
})
