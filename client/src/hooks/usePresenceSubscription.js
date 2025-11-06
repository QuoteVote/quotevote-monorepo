import { useEffect } from 'react';
import { useSubscription } from '@apollo/react-hooks';
import { useDispatch, useSelector } from 'react-redux';
import { PRESENCE_SUBSCRIPTION } from '../graphql/subscription';
import { UPDATE_PRESENCE } from '../store/chat';

/**
 * Custom hook to subscribe to presence updates
 * Automatically updates Redux store when presence changes
 */
export const usePresenceSubscription = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.data);

  // Subscribe to all presence updates (userId: null means all users)
  const { data, error } = useSubscription(PRESENCE_SUBSCRIPTION, {
    variables: { userId: null },
    skip: !user, // Only skip if user is not logged in
  });

  useEffect(() => {
    if (data?.presence) {
      dispatch(UPDATE_PRESENCE(data.presence));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (error) {
      console.error('Presence subscription error:', error);
      // Don't throw - just log
    }
  }, [error]);
};

export default usePresenceSubscription;

