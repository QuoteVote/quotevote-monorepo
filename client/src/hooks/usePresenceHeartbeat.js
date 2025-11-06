import { useEffect, useRef } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { HEARTBEAT } from '../graphql/mutations';

/**
 * Custom hook to send periodic heartbeat to keep presence alive
 * @param {number} interval - Heartbeat interval in milliseconds (default: 45000 = 45 seconds)
 */
export const usePresenceHeartbeat = (interval = 45000) => {
  const [heartbeat, { error }] = useMutation(HEARTBEAT);
  const retryCountRef = useRef(0);
  const maxRetries = 3;
  const backoffMultiplier = 2;

  useEffect(() => {
    // Exponential backoff for retries
    const getRetryDelay = (attempt) => {
      return Math.min(interval * Math.pow(backoffMultiplier, attempt), 300000); // Max 5 minutes
    };

    const sendHeartbeat = async () => {
      try {
        await heartbeat();
        // Reset retry count on success
        retryCountRef.current = 0;
      } catch (err) {
        console.error('Heartbeat failed:', err);
        
        // Retry with exponential backoff
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current += 1;
          const delay = getRetryDelay(retryCountRef.current);
          setTimeout(() => {
            sendHeartbeat();
          }, delay);
        } else {
          console.error('Max heartbeat retries reached. Giving up.');
          // Reset after a longer delay
          setTimeout(() => {
            retryCountRef.current = 0;
          }, interval * 5);
        }
      }
    };

    // Send initial heartbeat immediately
    sendHeartbeat();

    // Set up interval for periodic heartbeats
    const timer = setInterval(() => {
      sendHeartbeat();
    }, interval);

    // Cleanup on unmount
    return () => clearInterval(timer);
  }, [heartbeat, interval]);

  return { error };
};

export default usePresenceHeartbeat;

