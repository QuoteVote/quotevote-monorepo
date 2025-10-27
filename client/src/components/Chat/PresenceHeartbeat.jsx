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
      console.error('Error sending heartbeat:', error);
    },
  });

  useEffect(() => {
    // Send initial heartbeat
    sendHeartbeat();

    // Set up interval to send heartbeat every 30 seconds
    const interval = setInterval(() => {
      sendHeartbeat();
    }, 30000);

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
    };
  }, [sendHeartbeat]);

  return null; // This component doesn't render anything
};

export default PresenceHeartbeat;
