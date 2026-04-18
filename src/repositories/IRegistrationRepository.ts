import { IRegistration, CreateRegistrationDTO } from '../interfaces';

export interface IRegistrationRepository {
  create(registration: CreateRegistrationDTO): Promise<IRegistration>;
  findById(id: string): Promise<IRegistration | null>;
  findByUserAndEvent(userId: string, eventId: string): Promise<IRegistration | null>;
  findByEvent(eventId: string): Promise<IRegistration[]>;
  findByUser(userId: string): Promise<IRegistration[]>;
  // Accepts a general string enum signature but adheres strictly to schema constraints internally
  updateStatus(id: string, status: string): Promise<IRegistration>;
  delete(id: string): Promise<boolean>;
  countConfirmedByEvent(eventId: string): Promise<number>;
}
