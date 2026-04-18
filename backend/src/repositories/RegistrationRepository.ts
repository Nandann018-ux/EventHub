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
  async findByUserAndEvent(userId: string, eventId: string): Promise<IRegistration | null> {
    return prisma.registration.findUnique({
      where: {
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