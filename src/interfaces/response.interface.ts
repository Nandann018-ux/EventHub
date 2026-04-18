import { IUser } from './user.interface';

export interface AuthResponseDTO {
  token: string;
  user: Omit<IUser, 'createdAt' | 'updatedAt'>;
}

export interface ErrorResponseDTO<T = any> {
  status: 'error' | 'fail';
  message: string;
  data?: T;
}
