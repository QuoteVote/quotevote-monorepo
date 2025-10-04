import React from 'react'
import { render } from '@testing-library/react'

// Component being tested
import PostPage from './PostPage'
import withTestWrapper from '../../hoc/withTestWrapper'

const PostPageWrapper = withTestWrapper(PostPage)

describe('Post Page test -', () => {
  it('renders correctly', () => {
    const { container } = render(
      <PostPageWrapper />,
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  test.todo('should render Open Graph and Twitter meta tags for static content');
  test.todo('should render Open Graph and Twitter meta tags for dynamic post content');
})
