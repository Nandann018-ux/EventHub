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
  // Usually implicitly set by the authenticated user making the request
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
