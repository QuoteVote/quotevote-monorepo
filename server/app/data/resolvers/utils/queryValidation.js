/**
 * Query Validation Utilities
 * Shared validation functions for GraphQL query parameters
 */

// Constants for pagination
export const DEFAULT_LIMIT = 50;
export const MAX_LIMIT = 100;
export const DEFAULT_OFFSET = 0;

/**
 * Sanitize and validate limit parameter
 * @param {any} limit - User-provided limit value
 * @returns {number} - Sanitized limit value (between 1 and MAX_LIMIT)
 */
export const sanitizeLimit = (limit) => {
  // Convert to number and floor it
  const floorLimit = Math.floor(Number(limit));
  
  // Handle NaN or null - use default
  if (isNaN(floorLimit) || limit === null) {
    return DEFAULT_LIMIT;
  }
  
  // Enforce: minimum 1, maximum MAX_LIMIT
  return Math.min(MAX_LIMIT, Math.max(1, floorLimit));
};

/**
 * Sanitize and validate offset parameter
 * @param {any} offset - User-provided offset value
 * @returns {number} - Sanitized offset value (non-negative integer)
 */
export const sanitizeOffset = (offset) => {
  // Convert to number and floor it
  const floorOffset = Math.floor(Number(offset));
  
  // Handle NaN or null - use default
  if (isNaN(floorOffset) || offset === null) {
    return DEFAULT_OFFSET;
  }
  
  // Enforce: offset must be non-negative
  return Math.max(0, floorOffset);
};
