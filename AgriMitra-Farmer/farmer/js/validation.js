

export const ValidationMessages = {
  PHONE_EMPTY: 'Please enter your phone number.',
  PHONE_INVALID: 'Please enter a valid phone number.',
  PASSWORD_EMPTY: 'Please enter your password.',
  CREDENTIALS_MISMATCH: 'Incorrect phone number or password.'
};

export function cleanPhoneNumber(rawPhone) {
  if (!rawPhone) return '';

  let cleaned = rawPhone.replace(/[\s\-\(\)]/g, '');

  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.substring(3);
  } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.substring(1);
  }
  return cleaned;
}

export function validatePhoneNumber(phone) {
  const cleaned = cleanPhoneNumber(phone);

  if (!cleaned || cleaned.trim().length === 0) {
    return {
      isValid: false,
      error: ValidationMessages.PHONE_EMPTY,
      cleanedPhone: ''
    };
  }

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

export function formatPhoneNumberDisplay(val) {
  const digits = val.replace(/\D/g, '').slice(0, 10);
  if (digits.length > 5) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return digits;
}
