import { useMutation } from '@apollo/react-hooks';
import { useDispatch } from 'react-redux';
import {
  ADD_BUDDY,
  ACCEPT_BUDDY,
  BLOCK_BUDDY,
  UNBLOCK_BUDDY,
  REMOVE_BUDDY,
} from '../graphql/mutations';
import { GET_BUDDY_LIST, GET_ROSTER } from '../graphql/query';
import {
  ADD_PENDING_REQUEST,
  REMOVE_PENDING_REQUEST,
  ADD_BLOCKED_USER,
  REMOVE_BLOCKED_USER,
} from '../store/chat';

/**
 * Custom hook for roster management (buddy list operations)
 * @returns {object} - Roster mutation functions
 */
export const useRosterManagement = () => {
  const dispatch = useDispatch();

  const [addBuddyMutation] = useMutation(ADD_BUDDY, {
    refetchQueries: [{ query: GET_ROSTER }],
  });

  const [acceptBuddyMutation] = useMutation(ACCEPT_BUDDY, {
    refetchQueries: [{ query: GET_BUDDY_LIST }, { query: GET_ROSTER }],
  });

  const [blockBuddyMutation] = useMutation(BLOCK_BUDDY, {
    refetchQueries: [{ query: GET_ROSTER }],
  });

  const [unblockBuddyMutation] = useMutation(UNBLOCK_BUDDY, {
    refetchQueries: [{ query: GET_ROSTER }],
  });

  const [removeBuddyMutation] = useMutation(REMOVE_BUDDY, {
    refetchQueries: [{ query: GET_BUDDY_LIST }, { query: GET_ROSTER }],
  });

  const addBuddy = async (buddyId) => {
    try {
      const result = await addBuddyMutation({
        variables: { roster: { buddyId } },
      });
      dispatch(ADD_PENDING_REQUEST(result.data.addBuddy));
      return result.data.addBuddy;
    } catch (error) {
      console.error('Add buddy error:', error);
      throw error;
    }
  };

  const acceptBuddy = async (rosterId) => {
    try {
      const result = await acceptBuddyMutation({
        variables: { rosterId },
      });
      dispatch(REMOVE_PENDING_REQUEST(rosterId));
      return result.data.acceptBuddy;
    } catch (error) {
      console.error('Accept buddy error:', error);
      throw error;
    }
  };

  const blockBuddy = async (buddyId) => {
    try {
      const result = await blockBuddyMutation({
        variables: { buddyId },
      });
      dispatch(ADD_BLOCKED_USER(buddyId));
      return result.data.blockBuddy;
    } catch (error) {
      console.error('Block buddy error:', error);
      throw error;
    }
  };

  const unblockBuddy = async (buddyId) => {
    try {
      const result = await unblockBuddyMutation({
        variables: { buddyId },
      });
      dispatch(REMOVE_BLOCKED_USER(buddyId));
      return result.data.unblockBuddy;
    } catch (error) {
      console.error('Unblock buddy error:', error);
      throw error;
    }
  };

  const removeBuddy = async (buddyId) => {
    try {
      const result = await removeBuddyMutation({
        variables: { buddyId },
      });
      return result.data.removeBuddy;
    } catch (error) {
      console.error('Remove buddy error:', error);
      throw error;
    }
  };

  return {
    addBuddy,
    acceptBuddy,
    blockBuddy,
    unblockBuddy,
    removeBuddy,
  };
};

export default useRosterManagement;

