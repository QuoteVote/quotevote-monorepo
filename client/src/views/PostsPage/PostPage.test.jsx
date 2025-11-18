import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MockedProvider } from '@apollo/client/testing'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import { AuthModalProvider } from '../../Context/AuthModalContext'
import PostPage from './PostPage'
import { GET_POST, GET_ROOM_MESSAGES } from '../../graphql/query'

const mockStore = configureStore([])

const mockPostData = {
  post: {
    _id: 'test-post-id',
    title: 'Test Post',
    text: 'Test post content',
    comments: [],
    votes: [],
    quotes: [],
    messageRoom: null,
  },
}

const mocks = [
  {
    request: {
      query: GET_POST,
      variables: { postId: 'test-post-id' },
    },
    result: {
      data: mockPostData,
    },
  },
  {
    request: {
      query: GET_ROOM_MESSAGES,
      variables: { messageRoomId: null },
    },
    result: {
      data: { messages: [] },
    },
  },
]

describe('Post Page test -', () => {
  let store

  beforeEach(() => {
    store = mockStore({
      user: {
        data: {
          _id: 'test-user',
        },
      },
      ui: {
        selectedPost: {
          id: 'test-post-id',
        },
      },
    })
  })

  it('renders correctly', async () => {
    const { container } = render(
      <HelmetProvider>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Provider store={store}>
            <AuthModalProvider>
              <BrowserRouter>
                <PostPage postId="test-post-id" />
              </BrowserRouter>
            </AuthModalProvider>
          </Provider>
        </MockedProvider>
      </HelmetProvider>
    )
    
    await waitFor(() => {
      expect(container.firstChild).toBeTruthy()
    }, { timeout: 3000 })
  })

  test.todo('should render Open Graph and Twitter meta tags for static content')
  test.todo('should render Open Graph and Twitter meta tags for dynamic post content')
})
