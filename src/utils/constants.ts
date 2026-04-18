export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export const REGISTRATION_STATUS = {
  REGISTERED: 'REGISTERED',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  ATTENDED: 'ATTENDED',
} as const;

export const EVENT_STATUS = {
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
} as const;

export const API_RESPONSE_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const API_RESPONSE_MESSAGES = {
  INTERNAL_SERVER_ERROR: 'An unexpected error occurred.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
} as const;
