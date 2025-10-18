// No per-test Apollo mock here — rely on the centralized partial mock
// in src/test-setup-mocks.js which returns [fn, {loading:false}] by default.

import React from 'react'
import { render, act } from '@testing-library/react'
import { vi } from 'vitest'

// Stabilize moment formatting in tests to avoid timezone-dependent snapshots
vi.mock('moment', () => {
  return {
    __esModule: true,
    default: (input) => ({ format: () => 'November 6, 2018 11:00 AM' }),
  }
})

// Component being tested
import Post from './Post'
import withTestWrapper from '../../hoc/withTestWrapper'
const post = {
  creator: {
    name: 'John Doe',
    avatar: 'J',
  },
  created: '2018-11-06T11:00:00Z',
  _id: 'post-1',
  userId: 'user-1',
  title: 'Title of a post',
  text: 'What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
  upvotes: 100,
  downvotes: 200,
  approvedBy: [],
  rejectedBy: [],
}

const user = {
  name: 'John Doe',
  avatar: 'J',
  _id: 'user-1',
}

function PostData() {
  return (<Post post={post} user={user} />)
}

const SubmitPostWrapper = withTestWrapper(PostData)

describe('Post test -', () => {
  it('renders correctly', async () => {
    let container
    await act(async () => {
      const res = render(
        <SubmitPostWrapper />,
      )
      container = res.container
    })
    expect(container.firstChild).toMatchSnapshot()
  })
})
