import { useRef, useCallback, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_TYPING } from '../graphql/mutations';

/**
 * Custom hook to manage typing indicators with debouncing
 * @param {string} messageRoomId - The message room ID
 */
export const useTypingIndicator = (messageRoomId) => {
  const [updateTyping] = useMutation(UPDATE_TYPING);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  // Clear typing indicator when component unmounts or room changes
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // Send stop typing when unmounting
      if (isTypingRef.current && messageRoomId) {
        updateTyping({
          variables: {
            typing: {
              messageRoomId,
              isTyping: false,
            },
          },
        }).catch((err) => {
          console.error('Failed to stop typing indicator:', err);
        });
      }
    };
  }, [messageRoomId, updateTyping]);

  const stopTyping = useCallback(() => {
    if (!messageRoomId || !isTypingRef.current) return;

    // Clear timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    // Send stop typing
    isTypingRef.current = false;
    updateTyping({
      variables: {
        typing: {
          messageRoomId,
          isTyping: false,
        },
      },
    }).catch((err) => {
      console.error('Failed to stop typing indicator:', err);
    });
  }, [messageRoomId, updateTyping]);

  const handleTyping = useCallback(() => {
    if (!messageRoomId) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // If not already typing, send typing indicator
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      updateTyping({
        variables: {
          typing: {
            messageRoomId,
            isTyping: true,
          },
        },
      }).catch((err) => {
        console.error('Failed to send typing indicator:', err);
        isTypingRef.current = false;
      });
    }

    // Set timeout to stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  }, [messageRoomId, updateTyping, stopTyping]);

  return {
    handleTyping,
    stopTyping,
  };
};

export default useTypingIndicator;
