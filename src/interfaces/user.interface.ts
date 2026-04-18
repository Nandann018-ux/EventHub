export interface IUser {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  email: string;
  password?: string;
  name: string;
  role?: 'USER' | 'ADMIN';
}

export interface UpdateUserDTO {
  name?: string;
  password?: string;
  role?: 'USER' | 'ADMIN';
}
