import { Request, Response, NextFunction } from 'express';
import { ValidationService } from '../services/ValidationService';

const validationService = new ValidationService();

export const validateCreateUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    validationService.validateCreateUserInput(req.body);
    next();
  } catch (error: any) {
    error.name = 'ValidationError';
    next(error);
  }
};

export const validateCreateEvent = (req: Request, res: Response, next: NextFunction) => {
  try {
    validationService.validateCreateEventInput(req.body);
    next();
  } catch (error: any) {
    error.name = 'ValidationError';
    next(error);
  }
};

export const validateCreateRegistration = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Note: Some logic assumes req.user.id is mapped to userId dynamically.
    // If the controller manually sets it, we expect it in the body for standalone validation.
    // But since RegistrationController sets it from user, we map it manually here.
    const data = {
      ...req.body,
      userId: req.body.userId || (req as any).user?.id,
    };
    validationService.validateCreateRegistrationInput(data);
    next();
  } catch (error: any) {
    error.name = 'ValidationError';
    next(error);
  }
};

export const validateUpdateEvent = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Update might be partial, so we manually check the DTO constraints if fields are defined.
    // We could add validateUpdateEventInput to ValidationService, but for now we inline the partial check.
    const data = req.body;
    const errors: string[] = [];

    if (data.title !== undefined && (typeof data.title !== 'string' || data.title.trim().length < 3)) {
      errors.push('Event title must be at least 3 characters long.');
    }
    if (data.description !== undefined && (typeof data.description !== 'string' || data.description.trim().length < 10)) {
      errors.push('Event description must be at least 10 characters long.');
    }
    if (data.venue !== undefined && (typeof data.venue !== 'string' || data.venue.trim().length === 0)) {
      errors.push('Venue must be a valid string if provided.');
    }
    if (data.maxCapacity !== undefined && (typeof data.maxCapacity !== 'number' || data.maxCapacity <= 0)) {
      errors.push('Maximum capacity must be a positive integer greater than 0.');
    }
    if (data.dateTime !== undefined && !validationService.validateEventDateTime(data.dateTime)) {
      errors.push('Event dateTime must be formatted correctly and map to a future point in time.');
    }

    if (errors.length > 0) {
      const error = new Error(`Validation failed: ${errors.join(' ')}`);
      error.name = 'ValidationError';
      throw error;
    }

    next();
  } catch (error: any) {
    next(error);
  }
};
