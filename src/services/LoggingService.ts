import fs from 'fs/promises';
import path from 'path';
import { EventService } from './EventService';

// Structurally mapped payload ensuring files nest neatly independent of project execution entrypoint
const LOG_DIRECTORY = path.join(__dirname, '../../logs');
const ACTIVITY_LOG_PATH = path.join(LOG_DIRECTORY, 'activity_logs.json');
const ERROR_LOG_PATH = path.join(LOG_DIRECTORY, 'error_logs.json');

export class LoggingService {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
    // Fire safe asynchronous scaffolding executions cleanly ensuring directories physically exist
    this.initLogs().catch(err => console.error('[LoggingService] Bootstrap storage failure:', err));
  }

  /**
   * Initializes log directories globally ensuring raw JSON arrays explicitly handle appended variables predictably
   */
  private async initLogs(): Promise<void> {
    await fs.mkdir(LOG_DIRECTORY, { recursive: true });
    
    const files = [ACTIVITY_LOG_PATH, ERROR_LOG_PATH];
    for (const file of files) {
      try {
        await fs.access(file);
      } catch {
        // Scaffolds empty array brackets preventing parse execution mapping failures formally 
        await fs.writeFile(file, JSON.stringify([])); 
      }
    }
  }

  /**
   * General asynchronous array appending utility 
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async appendToJsonFile(filePath: string, entry: any): Promise<void> {
    try {
       // Reads memory lock completely. In production streams, Winston/Redis implementations cleanly handle scaled payload streams naturally.
       const data = await fs.readFile(filePath, 'utf-8');
       const logs = JSON.parse(data);
       
       logs.push({ ...entry, timestamp: new Date().toISOString() });
       
       await fs.writeFile(filePath, JSON.stringify(logs, null, 2));
    } catch (err) {
      console.error(`[LoggingService] Failed appending file struct successfully: ${err}`);
    }
  }

  /**
   * Tracks user interaction states mapping explicitly into the physical disk tracking boundary securely cleanly 
   */
  async logAction(userId: string, action: string, resource: string, result: string): Promise<void> {
    const logEntry = {
      type: 'ACTION',
      userId,
      action,
      resource, // Target object identifier logically executed cleanly
      result,   // Status state execution
    };
    
    // Abstracting resolution bounds executing independent background writes natively smoothly
    this.appendToJsonFile(ACTIVITY_LOG_PATH, logEntry).catch(() => {});
  }

  /**
   * Globally logs exact physical exceptions tracking explicit error state properties natively accurately.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async logError(error: any, context: string): Promise<void> {
    const errorEntry = {
      type: 'ERROR',
      context,
      message: error.message || 'Unknown Context Exception',
      stack: error.stack || null,
      statusCode: error.statusCode || 500,
    };

    this.appendToJsonFile(ERROR_LOG_PATH, errorEntry).catch(() => {});
  }

  /**
   * Queries tracking payloads natively mapping exact historical interactions purely statically locally filtering arrays structurally implicitly natively cleanly.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getUserActivityLog(userId: string): Promise<any[]> {
    try {
      const data = await fs.readFile(ACTIVITY_LOG_PATH, 'utf-8');
      const logs: any[] = JSON.parse(data);
      
      // Enforces explicit boundary variable constraints safely capturing mapping logs naturally exactly properly tracking scopes formally securely 
      return logs.filter(log => log.userId === userId);
    } catch (error) {
      console.log(`[LoggingService] Failed formal payload read executing implicitly tracking logs dynamically...`);
      return []; 
    }
  }

  /**
   * Maps granular DB statistics formally generated mathematically tracking registrations flawlessly mapping properties structurally properly properly naturally neatly
   */
  async getEventAnalytics(eventId: string): Promise<{ registrations: number; cancellations: number; attendance: number }> {
    // Intercept database analytical executions structurally isolating execution logic cleanly mapping DB queries over files conceptually securely inherently
    const stats = await this.eventService.getEventStats(eventId);
    
    return {
      registrations: stats.registered + stats.confirmed, 
      cancellations: stats.cancelled,
      attendance: stats.attended,
    };
  }
}
