import prisma from '../config/database';
import { IEvent, CreateEventDTO, UpdateEventDTO } from '../interfaces';
import { IEventRepository, EventFilters } from './IEventRepository';
export class EventRepository implements IEventRepository {
  async create(data: CreateEventDTO, userId: string): Promise<IEvent> {
    return prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        dateTime: new Date(data.dateTime),
        venue: data.venue,
        maxCapacity: data.maxCapacity,
        createdBy: userId,
      },
    }) as unknown as Promise<IEvent>;
  }
  async findById(id: string): Promise<IEvent | null> {
    return prisma.event.findUnique({
      where: { id },
    }) as unknown as Promise<IEvent | null>;
  }
  async findAll(filters?: EventFilters): Promise<IEvent[]> {
    const whereClause: any = {};
    if (filters?.status) {
      whereClause.status = filters.status;
    }
    if (filters?.dateRange) {
      whereClause.dateTime = {
        gte: filters.dateRange.start,
        lte: filters.dateRange.end,
      };
    }
    return prisma.event.findMany({
      where: whereClause,
      orderBy: { dateTime: 'asc' },
    }) as unknown as Promise<IEvent[]>;
  }
  async update(id: string, data: UpdateEventDTO): Promise<IEvent> {
    const updateData: any = { ...data };
    if (data.dateTime) {
      updateData.dateTime = new Date(data.dateTime);
    }
    return prisma.event.update({
      where: { id },
      data: updateData,
    }) as unknown as Promise<IEvent>;
  }
  async delete(id: string): Promise<boolean> {
    try {
      await prisma.event.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
  async getAvailableCapacity(eventId: string): Promise<number> {
    const event = await prisma.event.findUnique({
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
      throw new Error('Event not found');
    }
    const takenRegistrations = event._count.registrations;
    return event.maxCapacity - takenRegistrations;
  }
}