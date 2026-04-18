export interface IRegistration {
  id: string;
  userId: string;
  eventId: string;
  status: 'REGISTERED' | 'CONFIRMED' | 'CANCELLED' | 'ATTENDED';
  registeredAt: Date;
  updatedAt: Date;
}

export interface CreateRegistrationDTO {
  userId: string;
  eventId: string;
}
