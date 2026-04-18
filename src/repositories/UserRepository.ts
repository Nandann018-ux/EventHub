import prisma from '../config/database';
import { IUser, CreateUserDTO, UpdateUserDTO } from '../interfaces';
import { IUserRepository } from './IUserRepository';

export class UserRepository implements IUserRepository {
  async create(data: CreateUserDTO): Promise<IUser> {
    return prisma.user.create({
      data,
    }) as unknown as Promise<IUser>;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return prisma.user.findUnique({
      where: { email },
    }) as unknown as Promise<IUser | null>;
  }

  async findById(id: string): Promise<IUser | null> {
    return prisma.user.findUnique({
      where: { id },
    }) as unknown as Promise<IUser | null>;
  }

  async findAll(): Promise<IUser[]> {
    return prisma.user.findMany() as unknown as Promise<IUser[]>;
  }

  async update(id: string, data: UpdateUserDTO): Promise<IUser> {
    return prisma.user.update({
      where: { id },
      data,
    }) as unknown as Promise<IUser>;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      // Prisma throws an error (P2025) if the record to delete does not exist.
      return false;
    }
  }
}
