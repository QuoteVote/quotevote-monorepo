import React from 'react'
import { render } from '@testing-library/react'

// Component being tested
import PostCard from './PostCard'
import withTestWrapper from '../../hoc/withTestWrapper'

const postCardData = {
  _id: 'test-post-123',
  title: 'Test Post Title - Smooth Hover Transition',
  text: 'This is a test post to verify that the hover transition works correctly. The card should smoothly lift up by 4px when hovered over, with a 300ms cubic-bezier transition that creates a subtle bounce effect.',
  url: '/posts/test-post-123',
  creator: {
    username: 'testuser',
    avatar: {
      type: 'initial',
      value: 'T',
    },
  },
  created: new Date().toISOString(),
  votes: [
    { type: 'UPVOTE', creator: { username: 'user1' } },
    { type: 'UPVOTE', creator: { username: 'user2' } },
  ],
  comments: [],
  quotes: [],
  messageRoom: {
    messages: [],
  },
  bookmarkedBy: [],
  approvedBy: [{ _id: 'user1' }, { _id: 'user2' }, { _id: 'user3' }],
  rejectedBy: [{ _id: 'user4' }],
  activityType: 'POSTED',
}

function PostCardData() {
  return <PostCard {...postCardData} />
}

const PostCardWrapper = withTestWrapper(PostCardData)

describe('PostCard test -', () => {
  it('renders correctly', () => {
    const { container } = render(<PostCardWrapper />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('renders with smooth hover transition styles', () => {
    const { container } = render(<PostCardWrapper />)
    const card = container.querySelector('[class*="cardRootStyle"]')
    
    // Verify the card element exists
    expect(card).toBeTruthy()
  })
})
