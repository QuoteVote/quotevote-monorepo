// Stub window.scrollTo for environments where setupTests may not yet run
if (typeof window !== 'undefined' && typeof window.scrollTo !== 'function') {
  // eslint-disable-next-line no-empty-function
  window.scrollTo = function () {}
}
import React from 'react'
import { render } from '@testing-library/react'
// Mock heavy children before importing the tested module to avoid side-effects
vi.mock('../../components/Post/Post', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-post" />,
}))
vi.mock('../../components/PostActions/PostActionList', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-postactions" />,
}))
vi.mock('../../components/PostChat/PostChatSend', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-postchatsend" />,
}))

// Mock Apollo hooks used inside PostPage so tests don't attempt network or
// subscription behavior during simple render checks.
vi.mock('@apollo/react-hooks', async () => {
  const actual = await vi.importActual('@apollo/react-hooks')
  return {
    ...actual,
    useQuery: () => ({ loading: false, data: { post: null }, refetch: () => {} }),
    useSubscription: () => ({}),
  }
})

import PostPage from './PostPage'
import withTestWrapper from '../../hoc/withTestWrapper'

const PostPageWrapper = withTestWrapper(PostPage)

describe('Post Page test -', () => {
  it('renders mocked children', () => {
    const { getByTestId } = render(
      <PostPageWrapper />,
    )
    // assert our mocked children are rendered
    expect(getByTestId('mock-post')).toBeTruthy()
    expect(getByTestId('mock-postactions')).toBeTruthy()
    expect(getByTestId('mock-postchatsend')).toBeTruthy()
  })
})
