/**
 * AgriMitra - Validation Module
 * Handles client-side validations for Farmer Login
 */

export const ValidationMessages = {
  PHONE_EMPTY: 'Please enter your phone number.',
  PHONE_INVALID: 'Please enter a valid phone number.',
  PASSWORD_EMPTY: 'Please enter your password.',
  CREDENTIALS_MISMATCH: 'Incorrect phone number or password.'
};

/**
 * Strips whitespace, hyphens, and optional +91 prefix from a phone string
 * @param {string} rawPhone
 * @returns {string} 10-digit clean string
 */
export function cleanPhoneNumber(rawPhone) {
  if (!rawPhone) return '';
  // Remove spaces, dashes, parentheses
  let cleaned = rawPhone.replace(/[\s\-\(\)]/g, '');
  // If the user typed +91 or 91 at the start, strip it out because the UI already handles +91
  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.substring(3);
  } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.substring(1);
  }
  return cleaned;
}

/**
 * Validates Indian mobile number format (10 digits, starts with 6, 7, 8, or 9)
 * @param {string} phone
 * @returns {{isValid: boolean, error?: string, cleanedPhone: string}}
 */
export function validatePhoneNumber(phone) {
  const cleaned = cleanPhoneNumber(phone);

  if (!cleaned || cleaned.trim().length === 0) {
    return {
      isValid: false,
      error: ValidationMessages.PHONE_EMPTY,
      cleanedPhone: ''
    };
  }

  // Check format: 10 digits starting with 6, 7, 8, or 9
  const indianMobileRegex = /^[6-9]\d{9}$/;
  if (!indianMobileRegex.test(cleaned)) {
    return {
      isValid: false,
      error: ValidationMessages.PHONE_INVALID,
      cleanedPhone: cleaned
    };
  }

  return {
    isValid: true,
    error: null,
    cleanedPhone: cleaned
  };
}

/**
 * Validates password input
 * @param {string} password
 * @returns {{isValid: boolean, error?: string}}
 */
export function validatePassword(password) {
  if (!password || password.trim().length === 0) {
    return {
      isValid: false,
      error: ValidationMessages.PASSWORD_EMPTY
    };
  }

  return {
    isValid: true,
    error: null
  };
}

/**
 * Formats 10 digits into "98765 43210" spaced grouping for readability
 * @param {string} val
 * @returns {string}
 */
export function formatPhoneNumberDisplay(val) {
  const digits = val.replace(/\D/g, '').slice(0, 10);
  if (digits.length > 5) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return digits;
}
