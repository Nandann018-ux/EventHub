import prisma from '../config/database';
import { IRegistration, CreateRegistrationDTO } from '../interfaces';
import { IRegistrationRepository } from './IRegistrationRepository';

export class RegistrationRepository implements IRegistrationRepository {
  async create(data: CreateRegistrationDTO): Promise<IRegistration> {
    return prisma.registration.create({
      data,
    }) as unknown as Promise<IRegistration>;
  }

  async findById(id: string): Promise<IRegistration | null> {
    return prisma.registration.findUnique({
      where: { id },
    }) as unknown as Promise<IRegistration | null>;
  }

  /**
   * Retrieves a specific registration utilizing the Prisma composite unique mapping
   */
  async findByUserAndEvent(userId: string, eventId: string): Promise<IRegistration | null> {
    return prisma.registration.findUnique({
      where: {
        // Leverages the `@@unique([userId, eventId])` schema constraint
        userId_eventId: {
          userId,
          eventId,
        },
      },
    }) as unknown as Promise<IRegistration | null>;
  }

  async findByEvent(eventId: string): Promise<IRegistration[]> {
    return prisma.registration.findMany({
      where: { eventId },
      orderBy: { registeredAt: 'desc' },
    }) as unknown as Promise<IRegistration[]>;
  }

  async findByUser(userId: string): Promise<IRegistration[]> {
    return prisma.registration.findMany({
      where: { userId },
      orderBy: { registeredAt: 'desc' },
    }) as unknown as Promise<IRegistration[]>;
  }

  async updateStatus(id: string, status: string): Promise<IRegistration> {
    return prisma.registration.update({
      where: { id },
      // Bypass standard strict type to inherit mapped DB Enum explicitly
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { status: status as any },
    }) as unknown as Promise<IRegistration>;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.registration.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      // Catch P2025 where target is missing
      return false;
    }
  }

  async countConfirmedByEvent(eventId: string): Promise<number> {
    return prisma.registration.count({
      where: {
        eventId,
        status: 'CONFIRMED',
      },
    });
  }
}
