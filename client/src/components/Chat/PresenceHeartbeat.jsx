import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { SEND_HEARTBEAT } from '../../graphql/mutations';

/**
 * Component that sends presence heartbeat every 30 seconds
 * to keep the user's online status active
 */
const PresenceHeartbeat = () => {
  const [sendHeartbeat] = useMutation(SEND_HEARTBEAT, {
    onError: (error) => {
      // Silently log error without crashing the app
      console.warn('Heartbeat error (non-critical):', error.message);
    },
  });

  useEffect(() => {
    // Wrap in try-catch to prevent crashes
    const sendHeartbeatSafely = async () => {
      try {
        await sendHeartbeat();
      } catch (error) {
        // Silently handle error
        console.warn('Heartbeat failed (non-critical):', error.message);
      }
    };

    // Send initial heartbeat after a small delay to ensure auth is ready
    const initialTimeout = setTimeout(() => {
      sendHeartbeatSafely();
    }, 1000);

    // Set up interval to send heartbeat every 30 seconds
    const interval = setInterval(() => {
      sendHeartbeatSafely();
    }, 30000);

    // Cleanup on unmount
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [sendHeartbeat]);

  return null; // This component doesn't render anything
};

export default PresenceHeartbeat;
