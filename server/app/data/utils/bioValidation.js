/**
 * Shared validation for user About / bio text.
 *
 * Plain text only. BIO_MAX_LENGTH matches the frontend's
 * PROFILE_BIO_MAX_LENGTH so the client and server agree on what is accepted.
 */

export const BIO_MAX_LENGTH = 500;

/** Detects HTML / markup that should not be stored as plain-text bio. */
const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i;

/**
 * Normalize and validate bio input for updateUser.
 *
 * Returns trimmed plain text, or an empty string when cleared.
 * Throws with a user-facing message on invalid input.
 */
export const normalizeBio = (raw) => {
  if (raw === null || raw === undefined) {
    return '';
  }

  if (typeof raw !== 'string') {
    throw new Error('About must be text');
  }

  const trimmed = raw.trim();

  if (trimmed.length > BIO_MAX_LENGTH) {
    throw new Error(`About must be ${BIO_MAX_LENGTH} characters or fewer`);
  }

  if (HTML_TAG_PATTERN.test(trimmed)) {
    throw new Error('About must be plain text without HTML');
  }

  return trimmed;
};

export default { BIO_MAX_LENGTH, normalizeBio };
