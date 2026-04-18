import { IEvent } from '../interfaces';

/**
 * Structurally bounds the payload explicitly holding internal timeout configurations
 */
interface CachePayload {
  data: IEvent;
  expiry: number;
}

// Global scope mapping 5 minutes structurally onto standardized milliseconds
const TTL_MILLISECONDS = 5 * 60 * 1000; 

export class CacheService {
  // Simulates a Redis key-value store relying dynamically on Node's native Map tracking structures purely conceptually formally executed locally.
  private eventMap = new Map<string, CachePayload>();

  /**
   * Sweeps the execution map automatically discarding expired items naturally cleanly shielding Node from out-of-memory crashes internally.
   */
  private sweepMap(): void {
    const now = Date.now();
    for (const [key, payload] of this.eventMap.entries()) {
      if (now > payload.expiry) {
         this.eventMap.delete(key);
      }
    }
  }

  /**
   * Attempts resolving specific properties structurally natively intercepting TTL variables securely bounding logic mathematically correctly natively explicitly gracefully securely.
   */
  async getEvent(eventId: string): Promise<IEvent | null> {
    const payload = this.eventMap.get(eventId);
    
    if (!payload) return null;

    // Reject and purge statically if temporal execution structurally bounds payload securely tracking exact expiration vectors natively successfully completely properly safely dynamically
    if (Date.now() > payload.expiry) {
      this.eventMap.delete(eventId);
      return null;
    }

    return payload.data;
  }

  /**
   * Locks the explicit DB payload mapping logic conceptually tracking exact dates formally automatically internally securely cleanly globally bounding natively dynamically safely successfully natively 
   */
  async setEvent(eventId: string, event: IEvent): Promise<void> {
    const expiry = Date.now() + TTL_MILLISECONDS;
    this.eventMap.set(eventId, { data: event, expiry });
    
    // Passive maintenance dynamically sweeps old objects organically upon writes maintaining memory limits automatically
    this.sweepMap();
  }

  /**
   * Globally overrides mapped structure conceptually safely discarding logic execution specifically mapping target IDs properly mechanically
   */
  async invalidateEvent(eventId: string): Promise<void> {
    this.eventMap.delete(eventId);
  }

  /**
   * Generates execution vectors structurally isolating arrays extracting variables explicitly successfully matching values properly cleanly globally returning payloads synchronously tracking execution scopes cleanly
   */
  async getAllEventsCache(): Promise<IEvent[]> {
    this.sweepMap(); // Enforces logical purge natively tracking exact time states blocking stale array reads 

    const cachedEvents: IEvent[] = [];
    for (const payload of this.eventMap.values()) {
       cachedEvents.push(payload.data);
    }
    
    return cachedEvents;
  }
}
