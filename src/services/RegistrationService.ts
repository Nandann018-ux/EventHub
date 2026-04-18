import { RegistrationRepository } from '../repositories/RegistrationRepository';
import { UserService } from './UserService';
import { EventService } from './EventService';
import prisma from '../config/database';
import { IRegistration, IEvent } from '../interfaces';
import { API_RESPONSE_CODES } from '../utils/constants';

/**
 * Standard HTTP Error constructor mapping logic universally.
 */
const createError = (message: string, statusCode: number) => {
  return Object.assign(new Error(message), { statusCode });
};

export class RegistrationService {
  private registrationRepository: RegistrationRepository;
  private userService: UserService;
  private eventService: EventService;

  constructor() {
    this.registrationRepository = new RegistrationRepository();
    this.userService = new UserService();
    this.eventService = new EventService();
  }

  // ==========================================
  // Primary Scaffolding
  // ==========================================

  async registerUserForEvent(userId: string, eventId: string): Promise<IRegistration> {
    console.log(`[RegistrationService] Attempting logical registration linking User '${userId}' -> Event '${eventId}'`);

    await this.userService.getUserById(userId);
    await this.eventService.getEventById(eventId);
    
    // Instead of raw un-safe calls, proxy down into secure unified handler blocks executing transactions natively
    return this.handleConcurrentRegistrations(userId, eventId);
  }

  async getRegistrationById(id: string): Promise<IRegistration> {
    const registration = await this.registrationRepository.findById(id);
    if (!registration) {
      throw createError(`Registration record binding to target ID '${id}' could not be logically intercepted.`, API_RESPONSE_CODES.NOT_FOUND);
    }
    return registration;
  }

  async getUserRegistrations(userId: string): Promise<IRegistration[]> {
    console.log(`[RegistrationService] Extrapolating historical mapping vectors tied to target user: ${userId}`);
    await this.userService.getUserById(userId);
    return this.registrationRepository.findByUser(userId);
  }

  async getEventRegistrations(eventId: string): Promise<IRegistration[]> {
    console.log(`[RegistrationService] Extracting broad tracking log encapsulating target event bindings: ${eventId}`);
    await this.eventService.getEventById(eventId);
    return this.registrationRepository.findByEvent(eventId);
  }

  // ==========================================
  // Logical State Transition Validations
  // ==========================================

  validateStateTransition(currentStatus: string, newStatus: string): boolean {
    const validTransitions: Record<string, string[]> = {
      'REGISTERED': ['CONFIRMED', 'CANCELLED'],
      'CONFIRMED': ['ATTENDED', 'CANCELLED'],
      'CANCELLED': ['REGISTERED'], 
      'ATTENDED': [], 
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }

  async confirmRegistration(registrationId: string): Promise<IRegistration> {
    console.log(`[RegistrationService] Activating confirmation scope hooked logically against registration: ${registrationId}`);
    
    const registration = await this.getRegistrationById(registrationId);

    if (!this.validateStateTransition(registration.status, 'CONFIRMED')) {
      throw createError(`Registration state violation. Logic structurally mapped to '${registration.status}' cannot organically transition right into 'CONFIRMED'.`, API_RESPONSE_CODES.CONFLICT);
    }

    return this.registrationRepository.updateStatus(registrationId, 'CONFIRMED');
  }

  async cancelRegistration(registrationId: string): Promise<IRegistration> {
    console.log(`[RegistrationService] Actively wrapping cancellation payload mapped statically against registration tracker: ${registrationId}`);
    
    const registration = await this.getRegistrationById(registrationId);

    if (!this.validateStateTransition(registration.status, 'CANCELLED')) {
      throw createError(`Lifecycle conflict generated logically. Executions resolving firmly from initial scope '${registration.status}' generally cannot shift statically down straight entirely toward 'CANCELLED' safely.`, API_RESPONSE_CODES.CONFLICT);
    }

    return this.registrationRepository.updateStatus(registrationId, 'CANCELLED');
  }

  async markAttended(registrationId: string): Promise<IRegistration> {
    console.log(`[RegistrationService] Triggering static execution log bounding attendance mapping hooks across registration constraint: ${registrationId}`);
    
    const registration = await this.getRegistrationById(registrationId);

    if (!this.validateStateTransition(registration.status, 'ATTENDED')) {
      throw createError(`Violation explicitly hooked logic constraint block dynamically. Records normally MUST validate natively holding a 'CONFIRMED' origin structure before mathematically receiving an internal 'ATTENDED' tracker mappings logically. Target dynamically returned '${registration.status}'.`, API_RESPONSE_CODES.CONFLICT);
    }

    return this.registrationRepository.updateStatus(registrationId, 'ATTENDED');
  }

  // ==========================================
  // Concurrency & Enhanced Conflict Hooks
  // ==========================================

  /**
   * Helper abstracting structural lookup avoiding direct physical duplicates spanning mapped tables dynamically.
   * Can ingest active transaction clients to ensure reads lock correctly inside race boundaries safely.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async checkDuplicateRegistration(userId: string, eventId: string, txClient?: any): Promise<boolean> {
    const executor = txClient || prisma;
    const existing = await executor.registration.findUnique({
      where: { userId_eventId: { userId, eventId } }
    });
    
    // An aborted/soft deleted block is mathematically reusable conceptually
    return !!existing && existing.status !== 'CANCELLED';
  }

  /**
   * Formal validation throwing error if duplication structurally bounds across active scopes.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async validateRegistrationNotExists(userId: string, eventId: string, txClient?: any): Promise<void> {
    const isDuplicate = await this.checkDuplicateRegistration(userId, eventId, txClient);
    if (isDuplicate) {
      throw createError('Conflict blocked formally. User holds a structurally active reservation statically matching against this particular event target.', API_RESPONSE_CODES.CONFLICT);
    }
  }

  /**
   * Encapsulates complete scaffolding payload generation entirely wrapped inside a physical database transaction lock
   * effectively preventing raw "double-booking" vulnerabilities naturally appearing when multi-threaded limits are pushed dynamically.
   */
  async handleConcurrentRegistrations(userId: string, eventId: string): Promise<IRegistration> {
    console.log(`[RegistrationService] Spinning up secure transaction lock ensuring explicit isolation targeting mapping -> User: ${userId} Event: ${eventId}`);

    return prisma.$transaction(async (tx) => {
      // 1. Transactional Slot Verify Lock (Hook explicitly built back inside EventService payload bindings)
      await this.eventService.validateEventNotFull(eventId, tx);

      // 2. Transactional Duplication Checks
      await this.validateRegistrationNotExists(userId, eventId, tx);

      // Extract prior dead locks tracking explicitly canceled bounds handling overrides cleanly 
      const deadRegistration = await tx.registration.findUnique({
        where: { userId_eventId: { userId, eventId } }
      });

      if (deadRegistration) {
        // Soft resurrection mapped execution
        return tx.registration.update({
          where: { id: deadRegistration.id },
          data: { status: 'REGISTERED' }
        }) as unknown as Promise<IRegistration>;
      }

      // Generate pristine structural tracking payloads cleanly
      return tx.registration.create({
        data: { userId, eventId }
      }) as unknown as Promise<IRegistration>;
    });
  }

  /**
   * Simple alias proxy cleanly extracting available slot totals executing queries downward logically.
   */
  async getRemainingSlots(eventId: string): Promise<number> {
    return this.eventService.getAvailableSlots(eventId);
  }

  /**
   * Scans mapping dependencies attempting to catch explicit calendar overlaps strictly resolving events firing structurally matching identical start times.
   */
  async getAllUserEventConflicts(userId: string): Promise<IEvent[]> {
    console.log(`[RegistrationService] Performing complex structural overlap query looking tracking conflicting calendar constraints specifically executing for user: ${userId}`);

    // Verify user scope formally exists natively
    await this.userService.getUserById(userId);

    // Explicitly grab all actively scheduled (or completed) logic mappings wrapping target associations implicitly 
    const validRegistrations = await prisma.registration.findMany({
      where: { userId, status: { not: 'CANCELLED' } },
      include: { event: true } // Expand relational blocks pulling event times accurately 
    });

    const bookedEvents = validRegistrations.map(r => r.event);
    const overlappingConflicts: IEvent[] = [];
    const calendarIndexMapping = new Map<number, typeof bookedEvents>();

    // Hash logical buckets bounding exactly identical starting timestamps linearly 
    for (const event of bookedEvents) {
      const lockKey = event.dateTime.getTime();
      if (!calendarIndexMapping.has(lockKey)) {
        calendarIndexMapping.set(lockKey, []);
      }
      calendarIndexMapping.get(lockKey)!.push(event);
    }

    // Extract overlapping bucket arrays effectively returning physical conflicts
    for (const [, eventsCluster] of calendarIndexMapping.entries()) {
      if (eventsCluster.length > 1) {
        overlappingConflicts.push(...eventsCluster); // Map entire cluster structurally back
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return overlappingConflicts as unknown as Promise<IEvent[]>; 
  }
}
