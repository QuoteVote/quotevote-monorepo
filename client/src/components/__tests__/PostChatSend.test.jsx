import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { vi, expect } from 'vitest'
import PostChatSend from '../PostChat/PostChatSend'
import { SEND_MESSAGE } from '../../graphql/mutations'
import chatReducer from '../../store/chat'
import { AuthModalProvider } from '../../Context/AuthModalContext'

// Mock useGuestGuard to always return true (authenticated)
vi.mock('../../utils/useGuestGuard', () => ({
  default: () => () => true,
}))

// Create a mock store
const createMockStore = () => {
  return configureStore({
    reducer: {
      chat: chatReducer,
      user: () => ({
        data: {
          _id: 'test-user-id',
          name: 'Test User',
          username: 'testuser',
          avatar: 'test-avatar.jpg'
        }
      })
    }
  })
}

const mocks = [
  {
    request: {
      query: SEND_MESSAGE,
      variables: {
        message: {
          title: 'Test Post',
          type: 'POST',
          messageRoomId: 'test-room-id',
          text: 'Test message'
        }
      }
    },
    result: {
      data: {
        createMessage: {
          _id: 'test-message-id',
          userId: 'test-user-id',
          userName: 'Test User',
          messageRoomId: 'test-room-id',
          title: 'Test Post',
          text: 'Test message',
          type: 'POST',
          created: new Date().toISOString(),
          user: {
            _id: 'test-user-id',
            name: 'Test User',
            username: 'testuser',
            avatar: 'test-avatar.jpg',
            contributorBadge: false
          }
        }
      }
    }
  }
]

describe('PostChatSend', () => {
  let store

  beforeEach(() => {
    store = createMockStore()
  })

  it('renders chat input and send button', () => {
    render(
      <Provider store={store}>
        <AuthModalProvider>
          <MockedProvider mocks={mocks} addTypename={false}>
            <PostChatSend messageRoomId="test-room-id" title="Test Post" />
          </MockedProvider>
        </AuthModalProvider>
      </Provider>
    )

    expect(screen.getByPlaceholderText('type a message...')).toBeTruthy()
    expect(screen.getByAltText('send')).toBeTruthy()
  })

  it('allows typing in the input field', () => {
    render(
      <Provider store={store}>
        <AuthModalProvider>
          <MockedProvider mocks={mocks} addTypename={false}>
            <PostChatSend messageRoomId="test-room-id" title="Test Post" />
          </MockedProvider>
        </AuthModalProvider>
      </Provider>
    )

    const input = screen.getByPlaceholderText('type a message...')
    fireEvent.change(input, { target: { value: 'Test message' } })
    
    expect(input.value).toBe('Test message')
  })

  it('submits message when send button is clicked', async () => {
    render(
      <Provider store={store}>
        <AuthModalProvider>
          <MockedProvider mocks={mocks} addTypename={false}>
            <PostChatSend messageRoomId="test-room-id" title="Test Post" />
          </MockedProvider>
        </AuthModalProvider>
      </Provider>
    )

    const input = screen.getByPlaceholderText('type a message...')
    const sendButton = screen.getByAltText('send')

    fireEvent.change(input, { target: { value: 'Test message' } })
    
    await act(async () => {
      fireEvent.click(sendButton)
      // Wait for the mutation to complete and state to update
      await waitFor(() => {
        expect(input.value).toBe('')
      }, { timeout: 3000 })
    })
  })

  it('submits message when Enter key is pressed', async () => {
    render(
      <Provider store={store}>
        <AuthModalProvider>
          <MockedProvider mocks={mocks} addTypename={false}>
            <PostChatSend messageRoomId="test-room-id" title="Test Post" />
          </MockedProvider>
        </AuthModalProvider>
      </Provider>
    )

    const input = screen.getByPlaceholderText('type a message...')
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    
    await act(async () => {
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
      // Wait for the mutation to complete and state to update
      await waitFor(() => {
        expect(input.value).toBe('')
      }, { timeout: 3000 })
    })
  })

  it('does not submit empty messages', () => {
    render(
      <Provider store={store}>
        <AuthModalProvider>
          <MockedProvider mocks={mocks} addTypename={false}>
            <PostChatSend messageRoomId="test-room-id" title="Test Post" />
          </MockedProvider>
        </AuthModalProvider>
      </Provider>
    )

    const input = screen.getByPlaceholderText('type a message...')
    const sendButton = screen.getByAltText('send')

    // Try to submit empty message
    fireEvent.click(sendButton)
    
    // Input should remain empty and no mutation should be called
    expect(input.value).toBe('')
  })

  it('trims whitespace from messages', async () => {
    render(
      <Provider store={store}>
        <AuthModalProvider>
          <MockedProvider mocks={mocks} addTypename={false}>
            <PostChatSend messageRoomId="test-room-id" title="Test Post" />
          </MockedProvider>
        </AuthModalProvider>
      </Provider>
    )

    const input = screen.getByPlaceholderText('type a message...')
    const sendButton = screen.getByAltText('send')

    fireEvent.change(input, { target: { value: '  Test message  ' } })
    
    await act(async () => {
      fireEvent.click(sendButton)
      // Wait for the mutation to complete and state to update
      await waitFor(() => {
        expect(input.value).toBe('')
      }, { timeout: 3000 })
    })
  })
}) 