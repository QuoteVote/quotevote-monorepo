import { useEffect, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { SET_PRESENCE } from '../graphql/presence';

const HEARTBEAT_INTERVAL = 45000; // 45 seconds

/**
 * Custom hook to manage user presence
 * Automatically sets presence to online on mount, offline on unmount
 * and sends heartbeat every 45 seconds
 */
export function usePresence() {
  const heartbeatRef = useRef(null);
  const [setPresence] = useMutation(SET_PRESENCE);

  useEffect(() => {
    // Set presence to online when hook is initialized
    setPresence({
      variables: {
        status: 'online',
        text: null,
      },
    }).catch((err) => {
      console.error('Error setting presence to online:', err);
    });

    // Set up heartbeat to keep presence alive
    heartbeatRef.current = setInterval(() => {
      setPresence({
        variables: {
          status: 'online',
          text: null,
        },
      }).catch((err) => {
        console.error('Error sending heartbeat:', err);
      });
    }, HEARTBEAT_INTERVAL);

    // Cleanup: set presence to offline when hook is destroyed
    return () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }
      setPresence({
        variables: {
          status: 'offline',
          text: null,
        },
      }).catch((err) => {
        console.error('Error setting presence to offline:', err);
      });
    };
  }, [setPresence]);

  return { setPresence };
}
