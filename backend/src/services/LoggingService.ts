import fs from 'fs/promises';
import path from 'path';
import { EventService } from './EventService';
const LOG_DIRECTORY = path.join(__dirname, '../../logs');
const ACTIVITY_LOG_PATH = path.join(LOG_DIRECTORY, 'activity_logs.json');
const ERROR_LOG_PATH = path.join(LOG_DIRECTORY, 'error_logs.json');
export class LoggingService {
  private eventService: EventService;
  constructor() {
    this.eventService = new EventService();
    this.initLogs().catch(err => console.error('[LoggingService] Bootstrap storage failure:', err));
  }
  private async initLogs(): Promise<void> {
    await fs.mkdir(LOG_DIRECTORY, { recursive: true });
    const files = [ACTIVITY_LOG_PATH, ERROR_LOG_PATH];
    for (const file of files) {
      try {
        await fs.access(file);
      } catch {
        await fs.writeFile(file, JSON.stringify([]));
      }
    }
  }
  private async appendToJsonFile(filePath: string, entry: any): Promise<void> {
    try {
       const data = await fs.readFile(filePath, 'utf-8');
       const logs = JSON.parse(data);
       logs.push({ ...entry, timestamp: new Date().toISOString() });
       await fs.writeFile(filePath, JSON.stringify(logs, null, 2));
    } catch (err) {
      console.error(`[LoggingService] Failed appending file struct successfully: ${err}`);
    }
  }
  async logAction(userId: string, action: string, resource: string, result: string): Promise<void> {
    const logEntry = {
      type: 'ACTION',
      userId,
      action,
      resource,
      result,
    };
    this.appendToJsonFile(ACTIVITY_LOG_PATH, logEntry).catch(() => {});
  }
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
  async getUserActivityLog(userId: string): Promise<any[]> {
    try {
      const data = await fs.readFile(ACTIVITY_LOG_PATH, 'utf-8');
      const logs: any[] = JSON.parse(data);
      return logs.filter(log => log.userId === userId);
    } catch (error) {
      console.log(`[LoggingService] Failed formal payload read executing implicitly tracking logs dynamically...`);
      return [];
    }
  }
  async getEventAnalytics(eventId: string): Promise<{ registrations: number; cancellations: number; attendance: number }> {
    const stats = await this.eventService.getEventStats(eventId);
    return {
      registrations: stats.registered + stats.confirmed,
      cancellations: stats.cancelled,
      attendance: stats.attended,
    };
  }
}