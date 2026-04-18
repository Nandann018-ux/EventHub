import { IUser, CreateUserDTO, UpdateUserDTO } from '../interfaces';

export interface IUserRepository {
  create(user: CreateUserDTO): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  findAll(): Promise<IUser[]>;
  update(id: string, data: UpdateUserDTO): Promise<IUser>;
  delete(id: string): Promise<boolean>;
}
