import { CreateEventDTO } from '../interfaces';
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\W]{8,}$/;
  return passwordRegex.test(password);
};
export const validateEventData = (data: CreateEventDTO): string[] => {
  const errors: string[] = [];
  if (!data.title || data.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long.');
  }
  if (!data.description || data.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters long.');
  }
  if (!data.venue || data.venue.trim().length === 0) {
    errors.push('Venue cannot be empty.');
  }
  if (!data.maxCapacity || data.maxCapacity <= 0) {
    errors.push('Maximum capacity must be a positive number greater than 0.');
  }
  if (!data.dateTime || isNaN(new Date(data.dateTime).getTime())) {
    errors.push('A properly formatted dateTime is required.');
  }
  return errors;
};