import { IEvent, CreateEventDTO, UpdateEventDTO } from '../interfaces';
export interface EventFilters {
  status?: 'ACTIVE' | 'CANCELLED';
  dateRange?: {
    start: Date;
    end: Date;
  };
}
export interface IEventRepository {
  create(event: CreateEventDTO, userId: string): Promise<IEvent>;
  findById(id: string): Promise<IEvent | null>;
  findAll(filters?: EventFilters): Promise<IEvent[]>;
  update(id: string, data: UpdateEventDTO): Promise<IEvent>;
  delete(id: string): Promise<boolean>;
  getAvailableCapacity(eventId: string): Promise<number>;
}