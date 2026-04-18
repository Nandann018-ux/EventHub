import { UserService } from './UserService';
import { EventService } from './EventService';
import { RegistrationService } from './RegistrationService';
import { ROLES, API_RESPONSE_CODES } from '../utils/constants';

/**
 * Standard HTTP Error constructor mapping logic natively mapping Controller limits.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  /**
   * Cross-references logical bounds strictly tracking whether origin payloads natively share physical properties globally
   */
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

  /**
   * Maps dynamic validation ensuring explicit origin user matches either organizational level permissions directly
   * OR holds host-creation explicit mappings physically mapped originally against the target event locally.
   */
  async isEventAdmin(userId: string, eventId: string): Promise<boolean> {
    const isAdmin = await this.hasRole(userId, ROLES.ADMIN);
    const event = await this.eventService.getEventById(eventId);
    
    return isAdmin || event.createdBy === userId;
  }

  /**
   * Intercepts explicit backend validations handling physical payload modifications.
   */
  async canModifyEvent(userId: string, eventId: string): Promise<boolean> {
    // Current logical mapping relies exclusively against raw Event Admin definitions formally mapped tracking structure conceptually
    return this.isEventAdmin(userId, eventId);
  }

  /**
   * Generates logic handling exact scopes for soft deletion cancellations naturally mapped.
   */
  async canCancelRegistration(userId: string, registrationId: string): Promise<boolean> {
    const registration = await this.registrationService.getRegistrationById(registrationId);
    
    // Exact Origin User Native Override
    if (registration.userId === userId) {
      return true;
    }
    
    // Elevated Native Mappings structurally resolving explicit bounds correctly
    return this.isEventAdmin(userId, registration.eventId);
  }

  /**
   * Formal isolation verifying execution access strictly bounding state mutations natively inside registration properties physically.
   */
  async canMarkAttendance(userId: string, eventId: string): Promise<boolean> {
    // General mathematical execution boundary logically mapped exclusively onto Event Host/System Admin blocks dynamically natively
    return this.isEventAdmin(userId, eventId);
  }
}
