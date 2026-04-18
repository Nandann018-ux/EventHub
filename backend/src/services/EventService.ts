import { EventRepository } from '../repositories/EventRepository';
import { UserService } from './UserService';
import prisma from '../config/database';
import { CreateEventDTO, UpdateEventDTO, IEvent, IUser, IRegistration } from '../interfaces';
import { EventFilters } from '../repositories/IEventRepository';
import { API_RESPONSE_CODES, EVENT_STATUS } from '../utils/constants';
import { isValidEventDate } from '../utils/dateHelpers';
const createError = (message: string, statusCode: number) => {
  return Object.assign(new Error(message), { statusCode });
};
export class EventService {
  private eventRepository: EventRepository;
  private userService: UserService;
  constructor() {
    this.eventRepository = new EventRepository();
    this.userService = new UserService();
  }
  private async assertAdminAccess(userId: string): Promise<void> {
    const isUserAdmin = await this.userService.isAdmin(userId);
    if (!isUserAdmin) {
      throw createError('Forbidden. Only authenticated administrators can interact with this resource.', API_RESPONSE_CODES.FORBIDDEN);
    }
  }
  async createEvent(data: CreateEventDTO, adminId: string): Promise<IEvent> {
    console.log(`[EventService] Event scaffolding requested by admin: ${adminId}`);
    await this.assertAdminAccess(adminId);
    if (!isValidEventDate(data.dateTime)) {
      throw createError('The provided event dateTime must be formatted correctly and map to a future point in time.', API_RESPONSE_CODES.BAD_REQUEST);
    }
    return this.eventRepository.create(data, adminId);
  }
  async getEventById(id: string): Promise<IEvent> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw createError(`Event with ID '${id}' could not be logically resolved.`, API_RESPONSE_CODES.NOT_FOUND);
    }
    return event;
  }
  async getAllEvents(filters?: EventFilters): Promise<IEvent[]> {
    console.log(`[EventService] Fetching all registered events.`);
    return this.eventRepository.findAll(filters);
  }
  async updateEvent(id: string, data: UpdateEventDTO, adminId: string): Promise<IEvent> {
    console.log(`[EventService] Update mapped to event '${id}' requested by admin: ${adminId}`);
    await this.assertAdminAccess(adminId);
    await this.getEventById(id);
    if (data.dateTime && !isValidEventDate(data.dateTime)) {
      throw createError('Updated dateTime mappings must be moved to a valid point within the future.', API_RESPONSE_CODES.BAD_REQUEST);
    }
    return this.eventRepository.update(id, data);
  }
  async deleteEvent(id: string, adminId: string): Promise<boolean> {
    console.log(`[EventService] Cancellation mapped to event '${id}' requested by admin: ${adminId}`);
    await this.assertAdminAccess(adminId);
    await this.getEventById(id);
    await this.eventRepository.update(id, { status: EVENT_STATUS.CANCELLED });
    return true;
  }
  async getAvailableSlots(eventId: string, txClient?: any): Promise<number> {
    const executor = txClient || prisma;
    const event = await executor.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: {
            registrations: {
              where: {
                status: {
                  not: 'CANCELLED',
                },
              },
            },
          },
        },
      },
    });
    if (!event) {
      throw createError(`Event with ID '${eventId}' could not be logically resolved.`, API_RESPONSE_CODES.NOT_FOUND);
    }
    const takenRegistrations = event._count.registrations;
    return event.maxCapacity - takenRegistrations;
  }
  async checkCapacityAvailable(eventId: string, txClient?: any): Promise<boolean> {
    const slots = await this.getAvailableSlots(eventId, txClient);
    return slots > 0;
  }
  async validateEventNotFull(eventId: string, txClient?: any): Promise<void> {
    const slotsAvailable = await this.checkCapacityAvailable(eventId, txClient);
    if (!slotsAvailable) {
      throw createError('Registration limit reached. This event is currently at maximum capacity.', API_RESPONSE_CODES.CONFLICT);
    }
  }
  async getEventParticipants(eventId: string): Promise<IUser[]> {
    console.log(`[EventService] Constructing internal participant map for: ${eventId}`);
    await this.getEventById(eventId);
    const users = await prisma.$transaction(async (tx) => {
      const activeRegistrations = await tx.registration.findMany({
        where: {
          eventId,
          status: {
            not: 'CANCELLED'
          }
        },
        include: {
          user: true,
        }
      });
      return activeRegistrations.map((registration) => registration.user);
    });
    return users.map((user) => {
      const { password, ...safeUser } = user;
      return safeUser as IUser;
    });
  }
  async getUpcomingEvents(): Promise<IEvent[]> {
    console.log(`[EventService] Executing chronological query isolating future events...`);
    return prisma.event.findMany({
      where: {
        status: EVENT_STATUS.ACTIVE,
        dateTime: { gte: new Date() }
      },
      orderBy: { dateTime: 'asc' }
    }) as unknown as Promise<IEvent[]>;
  }
  async getPastEvents(): Promise<IEvent[]> {
    console.log(`[EventService] Executing historic event query isolations...`);
    return prisma.event.findMany({
      where: {
        status: EVENT_STATUS.ACTIVE,
        dateTime: { lt: new Date() }
      },
      orderBy: { dateTime: 'desc' }
    }) as unknown as Promise<IEvent[]>;
  }
  async searchEvents(query: string): Promise<IEvent[]> {
    console.log(`[EventService] Searching cross-index payloads structurally for: '${query}'`);
    return prisma.event.findMany({
      where: {
        status: EVENT_STATUS.ACTIVE,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { venue: { contains: query, mode: 'insensitive' } }
        ]
      },
      orderBy: { dateTime: 'asc' }
    }) as unknown as Promise<IEvent[]>;
  }
  async getEventStats(eventId: string): Promise<{ registered: number; confirmed: number; cancelled: number; attended: number }> {
    console.log(`[EventService] Querying granular analytic status map for event: ${eventId}`);
    await this.getEventById(eventId);
    const stats = await prisma.registration.groupBy({
      by: ['status'],
      where: { eventId },
      _count: true,
    });
    const result = {
      registered: 0,
      confirmed: 0,
      cancelled: 0,
      attended: 0,
    };
    stats.forEach((stat) => {
      const prop = stat.status.toLowerCase();
      if (result[prop] !== undefined) {
        result[prop] = stat._count;
      }
    });
    return result;
  }
  async markAttendance(eventId: string, userId: string): Promise<IRegistration> {
    console.log(`[EventService] Attempting to mark attendance explicitly mapped for User: ${userId} -> Event: ${eventId}`);
    await this.getEventById(eventId);
    const registration = await prisma.registration.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
    });
    if (!registration) {
      throw createError('No formal registration payload exists bonding this specific user to the target event.', API_RESPONSE_CODES.NOT_FOUND);
    }
    if (registration.status === 'CANCELLED') {
      throw createError('Cannot confirm logical attendance against a structurally cancelled reservation.', API_RESPONSE_CODES.CONFLICT);
    }
    return prisma.registration.update({
      where: { id: registration.id },
      data: { status: 'ATTENDED' },
    }) as unknown as Promise<IRegistration>;
  }
  async registerWithCapacityCheck(userId: string, eventId: string): Promise<IRegistration> {
    console.log(`[EventService] Resolving physical transaction constraints structurally matching active bindings natively -> User: ${userId} & Event: ${eventId}`);
    await this.userService.getUserById(userId);
    await this.getEventById(eventId);
    return prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id: eventId },
        include: {
          _count: {
            select: {
              registrations: { where: { status: { not: 'CANCELLED' } } }
            }
          }
        }
      });
      if (!event) {
        throw createError('System generated transaction execution mathematically aborted checking logic execution cleanly tracking target event missing locally conceptually inherently structurally inside locked bounds naturally avoiding null mapping executions manually.', API_RESPONSE_CODES.NOT_FOUND);
      }
      const availableSlots = event.maxCapacity - event._count.registrations;
      if (availableSlots <= 0) {
        throw createError('Event registration strictly bounds executions structurally avoiding logical mapping. No capacity tracking inherently resolving globally actively cleanly.', API_RESPONSE_CODES.CONFLICT);
      }
      const currentMapping = await tx.registration.findUnique({
        where: {
          userId_eventId: { userId, eventId }
        }
      });
      if (currentMapping) {
        if (currentMapping.status !== 'CANCELLED') {
           throw createError('Formal registration already structurally mapped validating active bounds naturally logic mapping conceptually mapping successfully preventing mapping overlaps explicitly natively dynamically executing safely physically avoiding data corruption.', API_RESPONSE_CODES.CONFLICT);
        } else {
           return tx.registration.update({
             where: { id: currentMapping.id },
             data: { status: 'REGISTERED' }
           }) as unknown as Promise<IRegistration>;
        }
      }
      return tx.registration.create({
        data: { userId, eventId, status: 'REGISTERED' }
      }) as unknown as Promise<IRegistration>;
    });
  }
  async bulkMarkAttendance(eventId: string, userIds: string[]): Promise<IRegistration[]> {
    console.log(`[EventService] Initiating structured massive ACID payload updating array targets globally natively mapping -> Event: ${eventId}`);
    await this.getEventById(eventId);
    return prisma.$transaction(async (tx) => {
      const activeRegistrations = await tx.registration.findMany({
        where: {
          eventId,
          userId: { in: userIds }
        }
      });
      const validExecutionIds = activeRegistrations
          .filter(reg => reg.status !== 'CANCELLED')
          .map(reg => reg.id);
      if (validExecutionIds.length === 0) {
        return [];
      }
      await tx.registration.updateMany({
        where: { id: { in: validExecutionIds } },
        data: { status: 'ATTENDED' }
      });
      const updatedRegistrations = await tx.registration.findMany({
        where: { id: { in: validExecutionIds } }
      });
      return updatedRegistrations as unknown as Promise<IRegistration[]>;
    });
  }
}