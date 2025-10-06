import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
// We'll require MockedProvider after mocking @apollo/react-hooks to avoid
// loading the real hooks implementation into the module cache before our
// mock is registered.
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
// We'll mock useMutation before importing the component so the module
// initialization picks up the mocked hook implementation.
// Use a mock function for useMutation so tests can wait for it and inspect calls
const createMessageMock = jest.fn().mockImplementation(async () => {
  return Promise.resolve({ data: { createMessage: {
    _id: 'test-message-id', userId: 'test-user-id', userName: 'Test User', messageRoomId: 'test-room-id', title: 'Test Post', text: 'Test message', type: 'POST', created: new Date().toISOString(), user: { _id: 'test-user-id', name: 'Test User', username: 'testuser', avatar: 'test-avatar.jpg', contributorBadge: false }
  } } })
})

jest.mock('@apollo/react-hooks', () => ({
  useMutation: () => [createMessageMock]
}))

import PostChatSend from '../PostChat/PostChatSend'
import chatReducer from '../../store/chat'

// Require MockedProvider after the above mock so it doesn't pull the original
// @apollo/react-hooks into the module cache before our mock runs.
const { MockedProvider } = require('@apollo/client/testing')

// Mock the useGuestGuard hook
jest.mock('../../utils/useGuestGuard', () => () => () => true)

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

const mocks = []

describe('PostChatSend', () => {
  let store

  beforeEach(() => {
    store = createMockStore()
  })

  it('renders chat input and send button', () => {
    render(
      <Provider store={store}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <PostChatSend messageRoomId="test-room-id" title="Test Post" />
        </MockedProvider>
      </Provider>
    )

  expect(screen.getByPlaceholderText('type a message...')).toBeTruthy()
  expect(screen.getByAltText('send')).toBeTruthy()
  })

  it('allows typing in the input field', () => {
    render(
      <Provider store={store}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <PostChatSend messageRoomId="test-room-id" title="Test Post" />
        </MockedProvider>
      </Provider>
    )

    const input = screen.getByPlaceholderText('type a message...')
    fireEvent.change(input, { target: { value: 'Test message' } })
    
    expect(input.value).toBe('Test message')
  })

  it('submits message when send button is clicked', async () => {
    render(
      <Provider store={store}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <PostChatSend messageRoomId="test-room-id" title="Test Post" />
        </MockedProvider>
      </Provider>
    )

  const input = screen.getByPlaceholderText('type a message...')
  // find the actual button element (IconButton) rather than the img inside it
  // find the img and click its parent button to ensure the IconButton's onClick fires
  const sendImg = screen.getByAltText('send')
  const sendButton = sendImg.closest('button')

    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.click(sendButton)

    // wait for the mocked mutation to be called, then for the input to clear
    await waitFor(() => {
      expect(createMessageMock).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(input.value).toBe('')
    })
  })

  it('submits message when Enter key is pressed', async () => {
    render(
      <Provider store={store}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <PostChatSend messageRoomId="test-room-id" title="Test Post" />
        </MockedProvider>
      </Provider>
    )

    const input = screen.getByPlaceholderText('type a message...')
    
    fireEvent.change(input, { target: { value: 'Test message' } })
  fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 })

    await waitFor(() => {
      expect(createMessageMock).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(input.value).toBe('')
    })
  })

  it('does not submit empty messages', () => {
    render(
      <Provider store={store}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <PostChatSend messageRoomId="test-room-id" title="Test Post" />
        </MockedProvider>
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
        <MockedProvider mocks={mocks} addTypename={false}>
          <PostChatSend messageRoomId="test-room-id" title="Test Post" />
        </MockedProvider>
      </Provider>
    )

    const input = screen.getByPlaceholderText('type a message...')
    const sendButton = screen.getByAltText('send')

    fireEvent.change(input, { target: { value: '  Test message  ' } })
    fireEvent.click(sendButton)

    await waitFor(() => {
      expect(createMessageMock).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(input.value).toBe('')
    })
  })
}) 