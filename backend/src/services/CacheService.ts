import { IEvent } from '../interfaces';
interface CachePayload {
  data: IEvent;
  expiry: number;
}
const TTL_MILLISECONDS = 5 * 60 * 1000;
export class CacheService {
  private eventMap = new Map<string, CachePayload>();
  private sweepMap(): void {
    const now = Date.now();
    for (const [key, payload] of this.eventMap.entries()) {
      if (now > payload.expiry) {
         this.eventMap.delete(key);
      }
    }
  }
  async getEvent(eventId: string): Promise<IEvent | null> {
    const payload = this.eventMap.get(eventId);
    if (!payload) return null;
    if (Date.now() > payload.expiry) {
      this.eventMap.delete(eventId);
      return null;
    }
    return payload.data;
  }
  async setEvent(eventId: string, event: IEvent): Promise<void> {
    const expiry = Date.now() + TTL_MILLISECONDS;
    this.eventMap.set(eventId, { data: event, expiry });
    this.sweepMap();
  }
  async invalidateEvent(eventId: string): Promise<void> {
    this.eventMap.delete(eventId);
  }
  async getAllEventsCache(): Promise<IEvent[]> {
    this.sweepMap();
    const cachedEvents: IEvent[] = [];
    for (const payload of this.eventMap.values()) {
       cachedEvents.push(payload.data);
    }
    return cachedEvents;
  }
}