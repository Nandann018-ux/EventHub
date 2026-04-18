import { UserService } from './UserService';
import { EventService } from './EventService';
import { RegistrationService } from './RegistrationService';
import { ROLES, API_RESPONSE_CODES } from '../utils/constants';
const createError = (message: string, statusCode: number) => {
  return Object.assign(new Error(message), { statusCode });
};
export class AuthorizationService {
  private userService: UserService;
  private eventService: EventService;
  private registrationService: RegistrationService;
  constructor() {
    this.userService = new UserService();
    this.eventService = new EventService();
    this.registrationService = new RegistrationService();
  }
  async hasRole(userId: string, requiredRole: string): Promise<boolean> {
    try {
      const role = await this.userService.getRoleByUserId(userId);
      return role === requiredRole;
    } catch (err: any) {
      if (err.statusCode === API_RESPONSE_CODES.NOT_FOUND) {
        return false;
      }
      throw err;
    }
  }
  async isEventAdmin(userId: string, eventId: string): Promise<boolean> {
    const isAdmin = await this.hasRole(userId, ROLES.ADMIN);
    const event = await this.eventService.getEventById(eventId);
    return isAdmin || event.createdBy === userId;
  }
  async canModifyEvent(userId: string, eventId: string): Promise<boolean> {
    return this.isEventAdmin(userId, eventId);
  }
  async canCancelRegistration(userId: string, registrationId: string): Promise<boolean> {
    const registration = await this.registrationService.getRegistrationById(registrationId);
    if (registration.userId === userId) {
      return true;
    }
    return this.isEventAdmin(userId, registration.eventId);
  }
  async canMarkAttendance(userId: string, eventId: string): Promise<boolean> {
    return this.isEventAdmin(userId, eventId);
  }
}