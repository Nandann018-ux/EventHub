export interface IEvent {
  id: string;
  title: string;
  description: string;
  dateTime: Date;
  venue: string;
  maxCapacity: number;
  status: 'ACTIVE' | 'CANCELLED';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface CreateEventDTO {
  title: string;
  description: string;
  dateTime: Date | string;
  venue: string;
  maxCapacity: number;
  createdBy?: string;
}
export interface UpdateEventDTO {
  title?: string;
  description?: string;
  dateTime?: Date | string;
  venue?: string;
  maxCapacity?: number;
  status?: 'ACTIVE' | 'CANCELLED';
}