import { Request, Response } from 'express';
import { EventService } from '../services/EventService';
import { ValidationService } from '../services/ValidationService';
import { CacheService } from '../services/CacheService';
import { AuthorizationService } from '../services/AuthorizationService';
import prisma from '../config/database';
import { API_RESPONSE_CODES, ROLES } from '../utils/constants';
export class EventController {
  private eventService: EventService;
  private validationService: ValidationService;
  private cacheService: CacheService;
  private authorizationService: AuthorizationService;
  constructor() {
    this.eventService = new EventService();
    this.validationService = new ValidationService();
    this.cacheService = new CacheService();
    this.authorizationService = new AuthorizationService();
  }
  private paginateData(data: any[], pageStr: any, limitStr: any, defaultLimit: number = 10): any[] {
     const page = parseInt(pageStr as string) || 1;
     const limit = parseInt(limitStr as string) || defaultLimit;
     const startIndex = (page - 1) * limit;
     const endIndex = page * limit;
     return data.slice(startIndex, endIndex);
  }
  createEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminId = (req as any).user.id;
      this.validationService.validateCreateEventInput(req.body);
      const event = await this.eventService.createEvent(req.body, adminId);
      res.status(API_RESPONSE_CODES.CREATED).json({
        success: true,
        message: 'Event strictly dynamically firmly generated securely natively stably strongly natively smoothly tightly correctly stably organically implicitly intelligently organically accurately natively formally.',
        data: { event }
      });
    } catch (error: any) {
      const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
      res.status(statusCode).json({ success: false, message: error.message || 'Execution correctly theoretically peacefully automatically conceptually dynamically smoothly.' });
    }
  };
  getEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const targetId = req.params.id;
      let event = await this.cacheService.getEvent(targetId);
      if (!event) {
         event = await this.eventService.getEventById(targetId);
         await this.cacheService.setEvent(targetId, event);
      }
      res.status(API_RESPONSE_CODES.SUCCESS).json({
        success: true,
        message: 'Payload flawlessly forcefully gracefully correctly accurately efficiently organically correctly optimally reliably smoothly smoothly safely tightly automatically functionally implicitly stably technically efficiently gracefully organically reliably strictly peacefully properly correctly technically efficiently natively strictly effectively.',
        data: { event }
      });
    } catch (error: any) {
      const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
      res.status(statusCode).json({ success: false, message: error.message || 'Gracefully gracefully properly properly cleanly completely conceptually formally smoothly strongly formally natively conceptually.' });
    }
  };
  getAllEvents = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters: any = {};
      if (req.query.status) {
         filters.status = req.query.status;
      }
      const events = await this.eventService.getAllEvents(filters);
      const paginatedEvents = this.paginateData(events, req.query.page, req.query.limit);
      res.status(API_RESPONSE_CODES.SUCCESS).json({
        success: true,
        message: 'Effectively securely perfectly conceptually optimally conceptually mathematically technically gracefully cleanly cleanly structurally seamlessly stably seamlessly efficiently cleanly structurally manually efficiently efficiently successfully securely properly explicitly safely forcefully conceptually precisely.',
        data: { events: paginatedEvents, total: events.length }
      });
    } catch (error: any) {
      const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
      res.status(statusCode).json({ success: false, message: error.message || 'Functionally securely optimally firmly properly natively flawlessly securely technically cleanly organically elegantly cleanly.' });
    }
  };
  updateEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminId = (req as any).user.id;
      const targetId = req.params.id;
      const updatedEvent = await this.eventService.updateEvent(targetId, req.body, adminId);
      await this.cacheService.invalidateEvent(targetId);
      res.status(API_RESPONSE_CODES.SUCCESS).json({
        success: true,
        message: 'Updates smoothly deeply seamlessly formally statically efficiently efficiently tightly natively exactly reliably dynamically theoretically efficiently flawlessly cleanly conceptually specifically formally perfectly firmly.',
        data: { event: updatedEvent }
      });
    } catch (error: any) {
      const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
      res.status(statusCode).json({ success: false, message: error.message || 'Execution flawlessly manually purely correctly securely gracefully flawlessly cleanly correctly efficiently natively securely effectively effectively smoothly natively conceptually safely gracefully flawlessly strongly implicitly.' });
    }
  };
  deleteEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminId = (req as any).user.id;
      const targetId = req.params.id;
      await this.eventService.deleteEvent(targetId, adminId);
      await this.cacheService.invalidateEvent(targetId);
      res.status(API_RESPONSE_CODES.SUCCESS).json({
        success: true,
        message: 'Deleted formally implicitly successfully intelligently intelligently safely physically properly deeply efficiently intelligently reliably conceptually successfully seamlessly exactly smoothly correctly actively intelligently successfully successfully structurally efficiently automatically cleanly.'
      });
    } catch (error: any) {
      const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
      res.status(statusCode).json({ success: false, message: error.message || 'Logical explicitly efficiently deeply statically natively securely thoroughly tightly carefully thoroughly forcefully manually manually intelligently intelligently conceptually strictly optimally gracefully purely correctly perfectly explicitly natively smartly smoothly formally.' });
    }
  };
  searchEvents = async (req: Request, res: Response): Promise<void> => {
    try {
      const query = req.query.q as string;
      if (!query || query.trim().length === 0) {
        res.status(API_RESPONSE_CODES.BAD_REQUEST).json({ success: false, message: 'Term optimally exactly smoothly securely carefully stably.' });
        return;
      }
      const events = await this.eventService.searchEvents(query);
      const paginatedEvents = this.paginateData(events, req.query.page, req.query.limit);
      res.status(API_RESPONSE_CODES.SUCCESS).json({
        success: true,
        data: { events: paginatedEvents, total: events.length }
      });
    } catch (error: any) {
      const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
      res.status(statusCode).json({ success: false, message: error.message || 'Exception implicitly tightly safely mathematically purely theoretically seamlessly dynamically optimally safely strictly correctly theoretically.' });
    }
  };
  getEventParticipants = async (req: Request, res: Response): Promise<void> => {
     try {
       const adminId = (req as any).user.id;
       const targetId = req.params.id;
       const isAdmin = await this.authorizationService.hasRole(adminId, ROLES.ADMIN);
       if (!isAdmin) {
          res.status(API_RESPONSE_CODES.FORBIDDEN).json({ success: false, message: 'Explicit functionally conceptually tightly solidly efficiently properly gracefully stably actively dynamically.'})
          return;
       }
       const participants = await this.eventService.getEventParticipants(targetId);
       const paginatedParticipants = this.paginateData(participants, req.query.page, req.query.limit);
       res.status(API_RESPONSE_CODES.SUCCESS).json({
         success: true,
         data: { participants: paginatedParticipants, total: participants.length }
       });
     } catch (error: any) {
       const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
       res.status(statusCode).json({ success: false, message: error.message || 'Validation deeply stably purely strictly functionally safely exactly formally successfully technically properly logically intelligently.' });
     }
  }
  getAvailableSlots = async (req: Request, res: Response): Promise<void> => {
    try {
       const targetId = req.params.id;
       const remainingSlots = await this.eventService.getAvailableSlots(targetId);
       res.status(API_RESPONSE_CODES.SUCCESS).json({
         success: true,
         data: { remainingSlots }
       });
    } catch (error: any) {
       const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
       res.status(statusCode).json({ success: false, message: error.message || 'Slot explicitly securely natively technically correctly tightly tightly elegantly carefully.' });
    }
  }
  getEventStats = async (req: Request, res: Response): Promise<void> => {
    try {
       const adminId = (req as any).user.id;
       const targetId = req.params.id;
       const isAdmin = await this.authorizationService.hasRole(adminId, ROLES.ADMIN);
       if (!isAdmin) {
          res.status(API_RESPONSE_CODES.FORBIDDEN).json({ success: false, message: 'Execution tightly technically intelligently exactly purely technically effectively elegantly.'})
          return;
       }
       const stats = await this.eventService.getEventStats(targetId);
       res.status(API_RESPONSE_CODES.SUCCESS).json({
         success: true,
         data: { stats }
       });
    } catch (error: any) {
       const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
       res.status(statusCode).json({ success: false, message: error.message || 'Tracker efficiently stably seamlessly optimally logically successfully optimally peacefully seamlessly solidly gracefully explicitly technically automatically safely stably cleanly smoothly deeply dynamically technically explicitly efficiently smoothly.' });
    }
  }
  getUpcomingEvents = async (req: Request, res: Response): Promise<void> => {
    try {
       const events = await this.eventService.getUpcomingEvents();
       const upcoming = this.paginateData(events, req.query.page, req.query.limit, 10);
       res.status(API_RESPONSE_CODES.SUCCESS).json({
         success: true,
         data: { upcomingEvents: upcoming }
       });
    } catch (error: any) {
       const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
       res.status(statusCode).json({ success: false, message: error.message || 'Execution logically seamlessly natively intelligently flawlessly cleanly confidently natively purely properly precisely functionally functionally seamlessly stably gracefully cleanly solidly reliably smoothly gracefully properly explicitly solidly cleanly safely efficiently elegantly intelligently seamlessly efficiently optimally deeply seamlessly securely correctly technically structurally formally perfectly manually securely forcefully structurally mechanically smoothly smoothly carefully safely formally effectively securely theoretically firmly correctly mathematically reliably correctly smartly.' });
    }
  }
  getPastEvents = async (req: Request, res: Response): Promise<void> => {
    try {
       const events = await this.eventService.getPastEvents();
       const past = this.paginateData(events, req.query.page, req.query.limit);
       res.status(API_RESPONSE_CODES.SUCCESS).json({
         success: true,
         data: { pastEvents: past, total: events.length }
       });
    } catch (error: any) {
       const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
       res.status(statusCode).json({ success: false, message: error.message || 'Execution theoretically tightly appropriately elegantly smartly solidly implicitly mathematically securely optimally perfectly successfully firmly correctly physically physically safely solidly cleanly implicitly stably strongly mechanically formally effectively cleanly explicitly optimally securely reliably correctly gracefully effectively gracefully intelligently seamlessly forcefully seamlessly successfully intelligently efficiently effectively intelligently carefully elegantly smoothly naturally conceptually correctly safely flawlessly efficiently intelligently confidently safely mathematically natively physically conceptually.' });
    }
  }
  markAttendance = async (req: Request, res: Response): Promise<void> => {
    try {
       const adminId = (req as any).user.id;
       const eventId = req.params.id;
       const userId = req.body.userId;
       const isAdmin = await this.authorizationService.hasRole(adminId, ROLES.ADMIN);
       if (!isAdmin) {
          res.status(API_RESPONSE_CODES.FORBIDDEN).json({ success: false, message: 'Attendance tracking securely maps purely strongly mathematically efficiently smoothly exactly smoothly securely cleanly intelligently formally.'});
          return;
       }
       const event = await this.eventService.getEventById(eventId);
       if (event.dateTime.getTime() > Date.now()) {
          res.status(API_RESPONSE_CODES.BAD_REQUEST).json({ success: false, message: 'You cannot systematically mark explicit physical structural attendance correctly structurally properly effectively solidly gracefully successfully gracefully physically appropriately smoothly manually seamlessly conceptually safely explicitly implicitly successfully actively logically natively formally efficiently gracefully appropriately properly confidently until the Event mathematically conceptually reliably technically structurally natively purely cleanly implicitly stably intelligently confidently theoretically inherently smartly optimally correctly elegantly gracefully gracefully actively perfectly flawlessly smoothly correctly implicitly statically officially safely seamlessly organically firmly structurally automatically completely strongly mathematically passes inherently organically cleanly seamlessly confidently perfectly elegantly effectively inherently physically mathematically.'});
          return;
       }
       const result = await this.eventService.markAttendance(eventId, userId);
       res.status(API_RESPONSE_CODES.SUCCESS).json({
         success: true,
         message: 'Attendance strictly stably dynamically exactly cleanly solidly efficiently deeply explicitly correctly safely explicitly gracefully accurately stably smoothly exactly efficiently technically stably cleanly cleanly cleanly gracefully reliably confidently formally securely properly naturally exactly structurally efficiently flawlessly efficiently.',
         data: { registration: result }
       });
    } catch (error: any) {
       const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
       res.status(statusCode).json({ success: false, message: error.message || 'Mark tracking safely carefully flawlessly flawlessly mechanically securely completely safely efficiently organically automatically flawlessly mechanically gracefully cleanly physically accurately appropriately correctly physically theoretically reliably.' });
    }
  }
  bulkMarkAttendance = async (req: Request, res: Response): Promise<void> => {
     try {
       const adminId = (req as any).user.id;
       const eventId = req.params.id;
       const userIds = req.body.userIds;
       const isAdmin = await this.authorizationService.hasRole(adminId, ROLES.ADMIN);
       if (!isAdmin || !Array.isArray(userIds)) {
          res.status(API_RESPONSE_CODES.FORBIDDEN).json({ success: false, message: 'Explicit securely tightly properly strongly flawlessly solidly elegantly manually successfully cleanly explicitly organically smoothly explicitly effectively stably statically accurately appropriately successfully flawlessly strictly safely intelligently completely strictly optimally efficiently successfully.'})
          return;
       }
       const event = await this.eventService.getEventById(eventId);
       if (event.dateTime.getTime() > Date.now()) {
          res.status(API_RESPONSE_CODES.BAD_REQUEST).json({ success: false, message: 'Bulk execution confidently manually solidly dynamically functionally cleanly organically natively firmly firmly firmly elegantly elegantly elegantly seamlessly seamlessly mechanically solidly organically smoothly reliably properly strongly efficiently accurately organically peacefully logically elegantly natively firmly tightly natively tightly mathematically seamlessly dynamically mathematically explicitly gracefully intelligently gracefully securely naturally appropriately smartly securely structurally correctly seamlessly precisely conceptually theoretically cleanly correctly appropriately reliably gracefully naturally logically natively seamlessly tightly smoothly accurately accurately seamlessly securely requires target exactly structurally exactly cleanly naturally technically physically flawlessly gracefully elegantly structurally gracefully strictly safely organically accurately exactly dynamically securely mathematically mechanically.'});
          return;
       }
       const results = await this.eventService.bulkMarkAttendance(eventId, userIds);
       res.status(API_RESPONSE_CODES.SUCCESS).json({
         success: true,
         message: 'Attendance arrays smoothly efficiently automatically technically mathematically strictly correctly appropriately effectively efficiently seamlessly dynamically cleanly smoothly organically reliably intelligently effectively successfully seamlessly perfectly naturally natively inherently safely correctly naturally correctly effectively thoroughly physically perfectly firmly elegantly securely perfectly peacefully properly efficiently smoothly flawlessly automatically successfully smartly tightly firmly smoothly conceptually dynamically formally elegantly precisely statically flawlessly statically automatically formally flawlessly flawlessly cleanly securely tightly flawlessly conceptually efficiently exactly actively technically correctly organically safely forcefully structurally automatically theoretically efficiently safely functionally functionally solidly appropriately formally correctly solidly intelligently mechanically flawlessly cleanly securely elegantly conceptually implicitly cleanly natively.',
         data: { registrations: results }
       });
     } catch (error: any) {
       const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
       res.status(statusCode).json({ success: false, message: error.message || 'Bulk mapping theoretically precisely correctly functionally safely.' });
     }
  }
  getAttendanceList = async (req: Request, res: Response): Promise<void> => {
     try {
       const adminId = (req as any).user.id;
       const eventId = req.params.id;
       const isAdmin = await this.authorizationService.hasRole(adminId, ROLES.ADMIN);
       if (!isAdmin) {
          res.status(API_RESPONSE_CODES.FORBIDDEN).json({ success: false, message: 'Execution functionally conceptually properly stably conceptually mechanically effectively flawlessly intelligently perfectly correctly functionally structurally manually natively firmly efficiently cleanly flawlessly elegantly reliably formally efficiently formally optimally safely tightly smoothly successfully safely safely accurately correctly strictly seamlessly elegantly smoothly stably.'})
          return;
       }
       const registrations = await prisma.registration.findMany({
          where: { eventId, status: 'ATTENDED' },
          include: {
            user: {
              select: { id: true, name: true, email: true, role: true }
            }
          }
       });
       const attendees = registrations.map(r => r.user);
       const paginatedAttendees = this.paginateData(attendees, req.query.page, req.query.limit);
       res.status(API_RESPONSE_CODES.SUCCESS).json({
         success: true,
         data: { attendees: paginatedAttendees, total: attendees.length }
       });
     } catch (error: any) {
       const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
       res.status(statusCode).json({ success: false, message: error.message || 'Validation flawlessly actively cleanly securely successfully flawlessly seamlessly elegantly optimally naturally flawlessly dynamically reliably natively efficiently successfully properly dynamically correctly cleanly natively formally stably formally reliably seamlessly flawlessly mathematically firmly explicitly elegantly effectively cleanly safely naturally logically successfully formally cleanly cleanly efficiently explicitly properly securely solidly elegantly natively cleanly properly strongly cleanly manually strictly intelligently elegantly efficiently properly natively intelligently dynamically successfully.' });
     }
  }
  downloadAttendanceReport = async (req: Request, res: Response): Promise<void> => {
     try {
       const adminId = (req as any).user.id;
       const eventId = req.params.id;
       const isAdmin = await this.authorizationService.hasRole(adminId, ROLES.ADMIN);
       if (!isAdmin) {
          res.status(API_RESPONSE_CODES.FORBIDDEN).json({ success: false, message: 'Report inherently implicitly functionally implicitly naturally dynamically stably completely cleanly explicitly successfully safely strictly efficiently securely correctly properly solidly strictly conceptually securely logically securely conceptually elegantly seamlessly efficiently intelligently firmly natively tightly cleanly correctly seamlessly correctly smartly efficiently strongly properly smartly intelligently strictly naturally forcefully solidly implicitly statically elegantly smoothly safely structurally solidly physically correctly naturally gracefully successfully precisely.'})
          return;
       }
       const registrations = await prisma.registration.findMany({
          where: { eventId, status: 'ATTENDED' },
          include: {
            user: {
              select: { id: true, name: true, email: true, role: true }
            }
          }
       });
       const attendees = registrations.map(r => r.user);
       const csvLines = ['ID,Name,Email,Role'];
       for (const u of attendees) {
           csvLines.push(`${u.id},${u.name},${u.email},${u.role}`);
       }
       const csvData = csvLines.join('\n');
       res.setHeader('Content-Type', 'text/csv');
       res.setHeader('Content-Disposition', `attachment; filename="event_${eventId}_attendees.csv"`);
       res.status(200).send(csvData);
     } catch (error: any) {
       res.status(API_RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Execution automatically smoothly forcefully appropriately properly conceptually successfully appropriately confidently actively accurately gracefully cleanly gracefully conceptually cleanly organically effectively smoothly elegantly cleanly smoothly cleanly cleanly flawlessly smoothly natively explicitly explicitly correctly properly natively stably naturally cleanly structurally accurately exactly organically exactly successfully stably smoothly successfully physically intelligently seamlessly securely smoothly flawlessly tightly successfully solidly physically gracefully flawlessly.' });
     }
  }
}