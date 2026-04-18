import { API_RESPONSE_CODES } from '../utils/constants';

/**
 * Standard HTTP Error constructor mapping logic natively mapping Controller limits.
 */
const createError = (message: string, statusCode: number) => {
  return Object.assign(new Error(message), { statusCode, isValidationError: true });
};

export class ValidationService {
  /**
   * Enforces rigorous email structuring strictly intercepting invalid domain components naturally.
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof email === 'string' && emailRegex.test(email);
  }

  /**
   * Alphanumeric boundary constraint structurally forcing a 6 character array minimum naturally globally.
   */
  validatePassword(password: string): boolean {
    const alphanumericRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{6,}$/;
    return typeof password === 'string' && alphanumericRegex.test(password);
  }

  /**
   * Enforces future-bound strict constraints natively dynamically intercepting broken executions mechanically cleanly formally executing properly safely securely checking strictly conceptually.
   */
  validateEventDateTime(dateTime: Date | string): boolean {
    const parsedDate = new Date(dateTime);
    if (isNaN(parsedDate.getTime())) return false;
    return parsedDate.getTime() > Date.now();
  }

  /**
   * Core execution bounding logic inherently mapping payloads securely matching CreateUserDTO conceptually strictly.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validateCreateUserInput(data: any): void {
    const errors: string[] = [];

    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      errors.push('Name is required and must be a non-empty string.');
    }

    if (!data.email || !this.validateEmail(data.email)) {
      errors.push('A valid email address is required.');
    }

    if (!data.password || !this.validatePassword(data.password)) {
      errors.push('Password must be at least 6 characters long and contain both letters and numbers.');
    }

    if (errors.length > 0) {
      throw createError(`Validation failed: ${errors.join(' ')}`, API_RESPONSE_CODES.BAD_REQUEST);
    }
  }

  /**
   * Core execution bounding logic inherently mapping payloads securely matching CreateEventDTO conceptually strictly.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validateCreateEventInput(data: any): void {
    const errors: string[] = [];

    if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 3) {
      errors.push('Event title must be at least 3 characters long.');
    }

    if (!data.description || typeof data.description !== 'string' || data.description.trim().length < 10) {
      errors.push('Event description must be at least 10 characters long.');
    }

    if (!data.venue || typeof data.venue !== 'string' || data.venue.trim().length === 0) {
      errors.push('Venue is required.');
    }

    if (!data.maxCapacity || typeof data.maxCapacity !== 'number' || data.maxCapacity <= 0) {
      errors.push('Maximum capacity must be a positive integer greater than 0.');
    }

    if (!data.dateTime || !this.validateEventDateTime(data.dateTime)) {
      errors.push('Event dateTime must be formatted correctly and map to a future point in time.');
    }

    if (errors.length > 0) {
      throw createError(`Validation failed: ${errors.join(' ')}`, API_RESPONSE_CODES.BAD_REQUEST);
    }
  }

  /**
   * Core execution bounding logic inherently mapping payloads securely matching CreateRegistrationDTO conceptually strictly.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validateCreateRegistrationInput(data: any): void {
    const errors: string[] = [];

    if (!data.userId || typeof data.userId !== 'string') {
      errors.push('A valid userId string target must be actively provided.');
    }

    if (!data.eventId || typeof data.eventId !== 'string') {
      errors.push('A valid eventId string target must be actively provided.');
    }

    if (errors.length > 0) {
      throw createError(`Validation failed: ${errors.join(' ')}`, API_RESPONSE_CODES.BAD_REQUEST);
    }
  }
}
