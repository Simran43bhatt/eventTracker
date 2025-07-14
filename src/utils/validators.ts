export const validateEmail = (email: string): string => {
  if (!email) {
    throw new Error('Email is required');
  }

  if (typeof email !== 'string') {
    throw new Error('Email must be a string');
  }

  email = email.trim();

  if (email.length === 0) {
    throw new Error('Email cannot be empty');
  }

  if (email.length > 254) {
    throw new Error('Email is too long (max 254 characters)');
  }

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }

  if (email.includes('..')) {
    throw new Error('Email cannot contain consecutive dots');
  }

  const localPart = email.split('@')[0];
  if (localPart.length > 64) {
    throw new Error('Email local part is too long (max 64 characters)');
  }

  return email;
};

export const validatePhone = (phone: string): { cleanPhone: string; countryCode?: string; formattedPhone: string } => {
  if (!phone) {
    throw new Error('Phone number is required');
  }

  if (typeof phone !== 'string') {
    throw new Error('Phone number must be a string');
  }

  let cleanPhone = phone.trim().replace(/[\s\-\(\)\.]/g, '');

  if (cleanPhone.startsWith('+')) {
    cleanPhone = cleanPhone.substring(1);
  }

  if (!/^[0-9]+$/.test(cleanPhone)) {
    throw new Error('Phone number can only contain digits');
  }

  if (cleanPhone.length > 15) {
    throw new Error('Phone number cannot be longer than 15 digits');
  }

  if (cleanPhone.length === 0) {
    throw new Error('Phone number cannot be empty');
  }

  let countryCode: string | undefined;
  let phoneNumber: string;

  if (cleanPhone.length > 10) {
    const extraDigits = cleanPhone.length - 10;
    countryCode = cleanPhone.substring(0, extraDigits);
    phoneNumber = cleanPhone.substring(extraDigits);
  } else {
    phoneNumber = cleanPhone;
  }

  const formattedPhone = countryCode ? `+${countryCode}${phoneNumber}` : phoneNumber;

  return {
    cleanPhone: phoneNumber,
    countryCode,
    formattedPhone,
  };
};

export const isEmptyLike = (input: unknown): boolean => {
  return input === null || input === undefined || input === '' || input === 'null' || input === 'undefined';
};
