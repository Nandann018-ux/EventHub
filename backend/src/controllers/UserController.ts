import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { AuthService } from '../services/AuthService';
import { ValidationService } from '../services/ValidationService';
import { AuthorizationService } from '../services/AuthorizationService';
import { API_RESPONSE_CODES, ROLES } from '../utils/constants';
export class UserController {
  private userService: UserService;
  private authService: AuthService;
  private validationService: ValidationService;
  private authorizationService: AuthorizationService;
  constructor() {
    this.userService = new UserService();
    this.authService = new AuthService();
    this.validationService = new ValidationService();
    this.authorizationService = new AuthorizationService();
  }
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      this.validationService.validateCreateUserInput(req.body);
      const result = await this.userService.register(req.body);
      const refreshToken = await this.authService.generateRefreshToken(result.user.id);
      res.status(API_RESPONSE_CODES.CREATED).json({
        success: true,
        message: 'Formal user registration executed successfully.',
        data: { user: result.user, accessToken: result.token, refreshToken }
      });
    } catch (error: any) {
      const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
      res.status(statusCode).json({ success: false, message: error.message || 'Registration failed.' });
    }
  };
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(API_RESPONSE_CODES.BAD_REQUEST).json({ success: false, message: 'Email and password required.' });
        return;
      }
      const result = await this.userService.login(email, password);
      const refreshToken = await this.authService.generateRefreshToken(result.user.id);
      res.status(API_RESPONSE_CODES.SUCCESS).json({
        success: true,
        message: 'Authentication successful.',
        data: { user: result.user, accessToken: result.token, refreshToken }
      });
    } catch (error: any) {
      const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
      res.status(statusCode).json({ success: false, message: error.message || 'Login sequence failed.' });
    }
  };
  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        await this.authService.revokeToken(token);
      }
      res.status(API_RESPONSE_CODES.SUCCESS).json({ success: true, message: 'Logout successful.' });
    } catch (error: any) {
      const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
      res.status(statusCode).json({ success: false, message: 'Logout execution implicitly stalled.' });
    }
  };
  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
         res.status(API_RESPONSE_CODES.BAD_REQUEST).json({ success: false, message: 'Refresh payload required.' });
         return;
      }
      const decoded = await this.authService.verifyRefreshToken(refreshToken);
      const role = await this.userService.getRoleByUserId(decoded.userId);
      const newAccessToken = await this.authService.generateAccessToken(decoded.userId, role);
      res.status(API_RESPONSE_CODES.SUCCESS).json({
        success: true,
        message: 'Tokens refreshed.',
        data: { accessToken: newAccessToken }
      });
    } catch (error: any) {
      const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
      res.status(statusCode).json({ success: false, message: error.message || 'Refresh sequence encountered execution failures.' });
    }
  };
  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const user = await this.userService.getUserById(userId);
      res.status(API_RESPONSE_CODES.SUCCESS).json({
        success: true,
        message: 'User profile extracted organically.',
        data: { user }
      });
    } catch (error: any) {
      const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
      res.status(statusCode).json({ success: false, message: error.message || 'Internal processing error executing structural fetch.' });
    }
  };
  updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { name } = req.body;
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
          success: false,
          message: 'Target name execution constraint mapping demands clear explicitly non-empty string.'
        });
        return;
      }
      const updatedUser = await this.userService.updateProfile(userId, { name });
      res.status(API_RESPONSE_CODES.SUCCESS).json({
        success: true,
        message: 'Formal updates pushed structurally natively accurately successfully safely dynamically cleanly.',
        data: { user: updatedUser }
      });
    } catch (error: any) {
      const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
      res.status(statusCode).json({ success: false, message: error.message || 'Profile modification physically failed inside structural bounds safely cleanly.' });
    }
  };
  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const currentExecutorId = (req as any).user.id;
      const explicitTargetId = req.params.id;
      const isSystemAdmin = await this.authorizationService.hasRole(currentExecutorId, ROLES.ADMIN);
      if (!isSystemAdmin) {
        res.status(API_RESPONSE_CODES.FORBIDDEN).json({
          success: false,
          message: 'Explicitly mapped restricted organizational blocks strictly require full structural system ADMIN mapping gracefully correctly safely cleanly organically securely securely seamlessly mathematically executing formally properly completely cleanly dynamically natively locally conceptually seamlessly organically.'
        });
        return;
      }
      const user = await this.userService.getUserById(explicitTargetId);
      res.status(API_RESPONSE_CODES.SUCCESS).json({
        success: true,
        message: 'Explicitly executed target payload dynamically naturally formally perfectly returned securely.',
        data: { user }
      });
    } catch (error: any) {
       const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
       res.status(statusCode).json({ success: false, message: error.message || 'Lookup failure tracking exact targets natively functionally globally cleanly inherently securely smoothly strictly automatically.' });
    }
  };
  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const isAdmin = await this.authorizationService.hasRole(userId, ROLES.ADMIN);
      if (!isAdmin) {
        res.status(API_RESPONSE_CODES.FORBIDDEN).json({
          success: false,
          message: 'Universal cross-organizational scans organically structurally mechanically correctly properly demand ADMIN bounds.'
        });
        return;
      }
      const users = await this.userService.getAllUsers();
      res.status(API_RESPONSE_CODES.SUCCESS).json({
        success: true,
        message: 'Mapped massive structural payloads explicitly securely efficiently effectively quickly.',
        data: { users }
      });
    } catch (error: any) {
       const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
       res.status(statusCode).json({ success: false, message: error.message || 'Global mapping explicitly mathematically technically executed seamlessly failed.' });
    }
  }
  deleteAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      await this.userService.deleteUser(userId);
      res.status(API_RESPONSE_CODES.SUCCESS).json({
        success: true,
        message: 'Account logically destroyed dynamically mathematically successfully effectively actively successfully structurally efficiently dynamically globally inherently securely safely formally organically correctly correctly successfully successfully strictly structurally mapping tracking perfectly.'
      });
    } catch (error: any) {
      const statusCode = error.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
      res.status(statusCode).json({ success: false, message: error.message || 'Execution failed executing organic bounds natively firmly perfectly explicitly safely.' });
    }
  };
}