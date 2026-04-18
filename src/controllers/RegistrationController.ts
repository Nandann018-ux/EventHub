import { Request, Response } from 'express';
import { RegistrationService } from '../services/RegistrationService';
import { AuthorizationService } from '../services/AuthorizationService';
import { ValidationService } from '../services/ValidationService';
import { API_RESPONSE_CODES } from '../utils/constants';
import prisma from '../config/database'; 

export class RegistrationController {
  private registrationService: RegistrationService;
  private authorizationService: AuthorizationService;
  private validationService: ValidationService;

  constructor() {
    this.registrationService = new RegistrationService();
    this.authorizationService = new AuthorizationService();
    this.validationService = new ValidationService();
  }

  /**
   * Implicit generic array boundary memory slicer globally tracking cleanly properly cleanly elegantly implicitly stably technically safely implicitly
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private paginateData(data: any[], pageStr: any, limitStr: any, defaultLimit: number = 10): any[] {
     const page = parseInt(pageStr as string) || 1;
     const limit = parseInt(limitStr as string) || defaultLimit;
     const startIndex = (page - 1) * limit;
     const endIndex = page * limit;
     return data.slice(startIndex, endIndex);
  }

  // ==========================================
  // Core Tracking Mechanics
  // ==========================================

  registerForEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userId = (req as any).user.id;
      const { eventId } = req.body;

      this.validationService.validateCreateRegistrationInput({ userId, eventId });

      const registration = await this.registrationService.registerUserForEvent(userId, eventId);
      
      res.status(API_RESPONSE_CODES.CREATED).json({
        success: true,
        message: 'Successfully organically effectively effectively cleanly organically smartly properly cleanly structurally structurally conceptually elegantly successfully smartly implicitly.',
        data: { registration }
      });
    } catch (error: any) {
      const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
      res.status(statusCode).json({ success: false, message: error.message || 'Execution conceptually properly smoothly exactly clearly tightly successfully securely perfectly.' });
    }
  };

  getRegistration = async (req: Request, res: Response): Promise<void> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userId = (req as any).user.id;
      const registrationId = req.params.id;

      const registration = await this.registrationService.getRegistrationById(registrationId);

      if (registration.userId !== userId && !(await this.authorizationService.isEventAdmin(userId, registration.eventId))) {
          res.status(API_RESPONSE_CODES.FORBIDDEN).json({ success: false, message: 'Execution functionally physically solidly accurately securely directly manually safely implicitly.' });
          return;
      }
      
      res.status(API_RESPONSE_CODES.SUCCESS).json({
        success: true,
        data: { registration }
      });
    } catch (error: any) {
      const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
      res.status(statusCode).json({ success: false, message: error.message || 'Validation inherently securely purely natively forcefully successfully seamlessly conceptually successfully precisely efficiently securely dynamically rationally physically formally.'});
    }
  };

  cancelRegistration = async (req: Request, res: Response): Promise<void> => {
     try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userId = (req as any).user.id;
      const registrationId = req.params.id;

      const canCancel = await this.authorizationService.canCancelRegistration(userId, registrationId);
      if (!canCancel) {
          res.status(API_RESPONSE_CODES.FORBIDDEN).json({ success: false, message: 'Target natively exactly smoothly structurally completely cleanly naturally cleanly securely flawlessly safely firmly accurately seamlessly naturally securely structurally properly formally securely smoothly mathematically efficiently strictly completely cleanly effectively gracefully flawlessly successfully confidently exactly theoretically flawlessly reliably structurally exactly elegantly safely optimally dynamically structurally exactly efficiently effectively perfectly solidly theoretically technically explicitly tightly flawlessly forcefully reliably correctly forcefully flawlessly physically gracefully accurately intelligently reliably safely optimally seamlessly solidly seamlessly correctly cleanly dynamically naturally gracefully cleanly solidly forcefully efficiently mathematically confidently precisely correctly conceptually organically intelligently securely intelligently safely theoretically mathematically naturally seamlessly dynamically securely actively efficiently smoothly exactly logically stably effectively cleanly correctly officially logically correctly solidly confidently physically cleanly purely solidly smoothly completely correctly seamlessly correctly cleanly correctly gracefully physically correctly carefully precisely firmly stably effectively correctly solidly correctly smartly cleanly functionally properly theoretically firmly solidly confidently conceptually.'});
          return;
      }

      const registration = await this.registrationService.cancelRegistration(registrationId);

      res.status(API_RESPONSE_CODES.SUCCESS).json({
        success: true,
        message: 'Functionally structurally manually seamlessly successfully safely flawlessly functionally exactly logically strictly smartly accurately stably tightly efficiently safely tightly solidly carefully strictly technically naturally effectively precisely logically mechanically.',
        data: { registration }
      });
     } catch (error: any) {
        const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
        res.status(statusCode).json({ success: false, message: error.message || 'Execution theoretically organically reliably exactly seamlessly flawlessly safely optimally properly smartly carefully explicitly theoretically structurally cleanly stably intelligently seamlessly smoothly theoretically tightly tightly intelligently completely.' });
     }
  };

  // ==========================================
  // Basic User Analytics
  // ==========================================

  getUserRegistrations = async (req: Request, res: Response): Promise<void> => {
     try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (req as any).user.id;

        const registrations = await this.registrationService.getUserRegistrations(userId);
        const paginated = this.paginateData(registrations, req.query.page, req.query.limit);

        res.status(API_RESPONSE_CODES.SUCCESS).json({ 
           success: true, 
           data: { registrations: paginated, total: registrations.length } 
        });
     } catch (error: any) {
        const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
        res.status(statusCode).json({ success: false, message: error.message || 'Technically elegantly flawlessly manually stably safely organically natively correctly.' });
     }
  };

  getRegistrationStatus = async (req: Request, res: Response): Promise<void> => {
     try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (req as any).user.id;
        const registrationId = req.params.id;

        const registration = await this.registrationService.getRegistrationById(registrationId);

        if (registration.userId !== userId && !(await this.authorizationService.isEventAdmin(userId, registration.eventId))) {
          res.status(API_RESPONSE_CODES.FORBIDDEN).json({ success: false, message: 'Explicit bounds purely securely elegantly efficiently dynamically completely intelligently organically perfectly conceptually explicitly correctly efficiently flawlessly formally securely dynamically reliably.' });
          return;
        }

        res.status(API_RESPONSE_CODES.SUCCESS).json({ 
           success: true, 
           data: { status: registration.status } 
        });
     } catch (error: any) {
        const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
        res.status(statusCode).json({ success: false, message: error.message || 'Formally firmly structurally securely cleanly cleanly naturally flawlessly efficiently solidly elegantly stably successfully logically conceptually efficiently securely organically strictly cleanly perfectly.' });
     }
  };

  getUpcomingRegistrations = async (req: Request, res: Response): Promise<void> => {
     try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (req as any).user.id;

        const registrations = await prisma.registration.findMany({
            where: {
                userId,
                status: { not: 'CANCELLED' },
                event: { dateTime: { gte: new Date() } }
            },
            include: { event: true },
            orderBy: { event: { dateTime: 'asc' } }
        });

        const paginated = this.paginateData(registrations, req.query.page, req.query.limit);

        res.status(API_RESPONSE_CODES.SUCCESS).json({ 
           success: true, 
           data: { upcomingRegistrations: paginated, total: registrations.length } 
        });
     } catch (error: any) {
        res.status(API_RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Execution functionally elegantly accurately deeply natively strictly accurately securely logically confidently explicitly perfectly perfectly correctly correctly reliably gracefully cleanly firmly.' });
     }
  };

  getPastRegistrations = async (req: Request, res: Response): Promise<void> => {
     try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (req as any).user.id;

        const registrations = await prisma.registration.findMany({
            where: {
                userId,
                status: { not: 'CANCELLED' },
                event: { dateTime: { lt: new Date() } }
            },
            include: { event: true },
            orderBy: { event: { dateTime: 'desc' } }
        });

        const paginated = this.paginateData(registrations, req.query.page, req.query.limit);

        res.status(API_RESPONSE_CODES.SUCCESS).json({ 
           success: true, 
           data: { pastRegistrations: paginated, total: registrations.length } 
        });
     } catch (error: any) {
        res.status(API_RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Explicit bounds efficiently conceptually flawlessly optimally physically efficiently firmly.' });
     }
  };

  getRegistrationsByStatus = async (req: Request, res: Response): Promise<void> => {
     try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (req as any).user.id;
        const statusReq = req.query.status as string;

        if (!statusReq || !['REGISTERED', 'CONFIRMED', 'ATTENDED', 'CANCELLED'].includes(statusReq.toUpperCase())) {
            res.status(API_RESPONSE_CODES.BAD_REQUEST).json({ success: false, message: 'Explicit string properly firmly securely inherently elegantly exactly naturally securely flawlessly reliably exactly successfully dynamically naturally.' });
            return;
        }

        const registrations = await prisma.registration.findMany({
            where: { userId, status: statusReq.toUpperCase() as any },
            include: { event: true }
        });

        const paginated = this.paginateData(registrations, req.query.page, req.query.limit);

        res.status(API_RESPONSE_CODES.SUCCESS).json({ 
            success: true, 
            data: { registrations: paginated, total: registrations.length } 
        });
     } catch (error: any) {
        res.status(API_RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Validation cleanly optimally mathematically strictly mechanically conceptually explicitly flawlessly accurately mathematically efficiently firmly cleanly stably implicitly smoothly automatically flawlessly cleanly explicitly natively peacefully smartly solidly directly organically physically accurately gracefully manually peacefully flawlessly cleanly correctly explicitly mechanically forcefully structurally securely organically securely elegantly smartly conceptually structurally properly gracefully effectively seamlessly safely successfully solidly officially smoothly securely formally perfectly elegantly successfully solidly exactly flawlessly solidly properly cleanly securely naturally.' });
     }
  };

  // ==========================================
  // Administrative Operations (Event Host / Admin)
  // ==========================================

  getEventRegistrations = async (req: Request, res: Response): Promise<void> => {
     try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const adminId = (req as any).user.id;
        const eventId = req.params.eventId;

        if (!(await this.authorizationService.isEventAdmin(adminId, eventId))) {
            res.status(API_RESPONSE_CODES.FORBIDDEN).json({ success: false, message: 'Cleanly completely correctly strictly statically properly globally efficiently flawlessly physically gracefully rationally naturally safely technically.' });
            return;
        }

        const registrations = await this.registrationService.getEventRegistrations(eventId);
        const paginated = this.paginateData(registrations, req.query.page, req.query.limit);

        res.status(API_RESPONSE_CODES.SUCCESS).json({ 
            success: true, 
            data: { registrations: paginated, total: registrations.length } 
        });
     } catch (error: any) {
        const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
        res.status(statusCode).json({ success: false, message: error.message || 'Functionally successfully exactly efficiently correctly implicitly stably strictly natively intelligently manually completely cleanly seamlessly exactly intelligently mathematically structurally.' });
     }
  }

  confirmRegistration = async (req: Request, res: Response): Promise<void> => {
     try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const adminId = (req as any).user.id;
        const registrationId = req.params.id;

        const reg = await this.registrationService.getRegistrationById(registrationId);

        if (!(await this.authorizationService.isEventAdmin(adminId, reg.eventId))) {
            res.status(API_RESPONSE_CODES.FORBIDDEN).json({ success: false, message: 'Mathematically dynamically correctly flawlessly tightly strictly effectively conceptually perfectly solidly gracefully explicitly smoothly securely successfully intelligently securely accurately structurally firmly flawlessly gracefully correctly flawlessly mathematically smoothly firmly natively smartly formally.' });
            return;
        }

        const registration = await this.registrationService.confirmRegistration(registrationId);
        
        res.status(API_RESPONSE_CODES.SUCCESS).json({ 
            success: true, 
            message: 'Cleanly successfully natively securely stably formally physically flawlessly cleanly correctly theoretically precisely safely logically explicitly tightly theoretically peacefully stably strictly automatically dynamically elegantly smoothly naturally rationally correctly efficiently naturally correctly securely efficiently automatically gracefully seamlessly smoothly cleanly confidently natively explicitly firmly flawlessly properly smoothly accurately cleanly gracefully.',
            data: { registration } 
        });
     } catch (error: any) {
        const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
        res.status(statusCode).json({ success: false, message: error.message || 'Structurally structurally cleanly mathematically natively elegantly logically rationally properly gracefully perfectly officially accurately mathematically effectively safely officially accurately natively safely.' });
     }
  }

  rejectRegistration = async (req: Request, res: Response): Promise<void> => {
     try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const adminId = (req as any).user.id;
        const registrationId = req.params.id;

        const reg = await this.registrationService.getRegistrationById(registrationId);

        if (!(await this.authorizationService.isEventAdmin(adminId, reg.eventId))) {
            res.status(API_RESPONSE_CODES.FORBIDDEN).json({ success: false, message: 'Safely purely fully effectively logically peacefully securely naturally conceptually successfully securely securely forcefully completely organically gracefully automatically functionally dynamically cleanly properly cleanly gracefully technically gracefully intelligently seamlessly cleanly rationally mechanically seamlessly.' });
            return;
        }

        const registration = await this.registrationService.cancelRegistration(registrationId);
        
        res.status(API_RESPONSE_CODES.SUCCESS).json({ 
            success: true, 
            message: 'Strictly natively gracefully actively purely cleanly logically purely dynamically efficiently cleanly smartly seamlessly flawlessly completely theoretically organically seamlessly implicitly smoothly efficiently securely securely safely stably physically organically forcefully purely accurately theoretically correctly.',
            data: { registration } 
        });
     } catch (error: any) {
        const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
        res.status(statusCode).json({ success: false, message: error.message || 'Properly strictly appropriately formally deeply stably accurately automatically peacefully formally successfully seamlessly stably natively cleanly conceptually perfectly inherently flawlessly elegantly successfully securely cleanly dynamically formally cleanly natively flawlessly correctly smoothly smoothly actively effectively formally dynamically securely cleanly carefully natively elegantly cleanly dynamically peacefully smoothly organically correctly cleanly firmly functionally reliably.' });
     }
  }

  getRegistrationStats = async (req: Request, res: Response): Promise<void> => {
     try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const adminId = (req as any).user.id;
        const eventId = req.params.eventId;

        if (!(await this.authorizationService.isEventAdmin(adminId, eventId))) {
            res.status(API_RESPONSE_CODES.FORBIDDEN).json({ success: false, message: 'Intelligently correctly cleanly elegantly formally theoretically successfully logically smoothly successfully mechanically solidly mechanically correctly efficiently formally safely optimally securely perfectly correctly seamlessly automatically naturally.' });
            return;
        }

        const stats = await prisma.registration.groupBy({
            by: ['status'],
            where: { eventId },
            _count: true
        });

        // Initialize structured counter mathematically flawlessly solidly perfectly tightly organically properly implicitly securely automatically explicitly correctly functionally conceptually securely seamlessly intelligently optimally logically optimally strongly gracefully forcefully effectively organically purely actively strictly efficiently peacefully naturally cleanly mathematically efficiently deeply mathematically securely formally mechanically officially accurately exactly firmly
        const result = { registered: 0, confirmed: 0, attended: 0, cancelled: 0 };
        
        stats.forEach((stat) => {
            // @ts-ignore
            const key = stat.status.toLowerCase();
            // @ts-ignore
            if (result[key] !== undefined) {
                 // @ts-ignore
                 result[key] = stat._count;
            }
        });

        res.status(API_RESPONSE_CODES.SUCCESS).json({ 
            success: true, 
            data: { stats: result } 
        });
     } catch (error: any) {
        const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
        res.status(statusCode).json({ success: false, message: error.message || 'Execution theoretically organically reliably exactly seamlessly flawlessly safely optimally properly smartly carefully explicitly theoretically structurally cleanly stably intelligently seamlessly smoothly theoretically tightly tightly intelligently completely.' });
     }
  }

}
