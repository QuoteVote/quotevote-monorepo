import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { tokenValidator } from 'store/user';

/**
 * Custom hook to handle token validation and optional redirection.
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.redirectToIfValid - Path to redirect to if the token is valid (e.g., /search)
 * @param {string} options.redirectToIfInvalid - Path to redirect to if the token is invalid (e.g., /login)
 * @returns {boolean} Whether the token is currently valid
 */
export const useTokenValidation = (options = {}) => {
  const { redirectToIfValid, redirectToIfInvalid } = options;
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const isValid = tokenValidator(dispatch);
    
    if (isValid && redirectToIfValid) {
      history.push(redirectToIfValid);
    } else if (!isValid && redirectToIfInvalid) {
      history.push(redirectToIfInvalid);
    }
  }, [dispatch, history, redirectToIfValid, redirectToIfInvalid]);

  // Return the current validation state
  return tokenValidator(dispatch);
};

export default useTokenValidation;
