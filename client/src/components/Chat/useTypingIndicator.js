import { useState, useEffect, useRef } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { MSG_TYPING } from '../../graphql/mutations';

/**
 * Custom hook for handling typing indicator functionality
 * @param {string} conversationId - The ID of the conversation
 * @param {number} idleTimeout - Timeout in milliseconds before sending false (default: 2000)
 */
const useTypingIndicator = (conversationId, idleTimeout = 2000) => {
  const [isTyping, setIsTyping] = useState(false);
  const [msgTyping] = useMutation(MSG_TYPING);
  const typingTimeoutRef = useRef(null);
  const hasSentTypingRef = useRef(false);

  /**
   * Send typing status to server
   * @param {boolean} typing - Whether user is typing or not
   */
  const sendTypingStatus = (typing) => {
    if (!conversationId) return;

    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Send typing status immediately
    msgTyping({
      variables: {
        conversationId,
        isTyping: typing
      }
    }).catch((error) => {
      console.error('Error sending typing status:', error);
    });

    // If typing is true, set a timeout to send false after idleTimeout
    if (typing) {
      typingTimeoutRef.current = setTimeout(() => {
        msgTyping({
          variables: {
            conversationId,
            isTyping: false
          }
        }).catch((error) => {
          console.error('Error sending typing status (false):', error);
        });
      }, idleTimeout);
    }
  };

  /**
   * Handle input focus event
   */
  const handleInputFocus = () => {
    if (!isTyping) {
      setIsTyping(true);
      sendTypingStatus(true);
    }
  };

  /**
   * Handle input blur event
   */
  const handleInputBlur = () => {
    if (isTyping) {
      setIsTyping(false);
      sendTypingStatus(false);
    }
  };

  /**
   * Handle input change event
   */
  const handleInputChange = () => {
    // If user is already typing, reset the timeout
    if (isTyping) {
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        sendTypingStatus(false);
      }, idleTimeout);
    } else {
      // If user wasn't typing, start typing
      setIsTyping(true);
      sendTypingStatus(true);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    isTyping,
    handleInputFocus,
    handleInputBlur,
    handleInputChange
  };
};

export default useTypingIndicator;