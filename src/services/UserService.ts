import { UserRepository } from '../repositories/UserRepository';
import { CreateUserDTO, UpdateUserDTO, IUser, AuthResponseDTO } from '../interfaces';
import { hashPassword, comparePasswords } from '../utils/encryption';
import { generateToken, verifyToken } from '../utils/jwt';
import { API_RESPONSE_CODES, ROLES } from '../utils/constants';

/**
 * Strips password, createdAt, and updatedAt from a given user object payload.
 */
const sanitizeAuthUser = (user: any): Omit<IUser, 'createdAt' | 'updatedAt'> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, createdAt, updatedAt, ...safeUser } = user;
  return safeUser as Omit<IUser, 'createdAt' | 'updatedAt'>;
};

/**
 * Removes just the password for generalized user returns.
 */
const stripPassword = (user: any): IUser => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...safeUser } = user;
  return safeUser as IUser;
};

/**
 * Helper to construct formatted application errors that integrate
 * with the global Express errorHandler correctly.
 */
const createError = (message: string, statusCode: number) => {
  return Object.assign(new Error(message), { statusCode });
};

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  // ==========================================
  // Core Business Methods
  // ==========================================
  
  async register(data: CreateUserDTO): Promise<AuthResponseDTO> {
    console.log(`[UserService] Registration attempt utilizing email: ${data.email}`);
    
    // Validates uniqueness abstraction
    await this.validateEmailUnique(data.email);

    if (!data.password) {
      throw createError('A valid password is required to register.', API_RESPONSE_CODES.BAD_REQUEST);
    }

    const hashedPassword = await hashPassword(data.password);
    
    const newUser = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    const safeUser = sanitizeAuthUser(newUser);
    const token = this.generateUserToken(safeUser);

    return { token, user: safeUser };
  }

  async login(email: string, passwordString: string): Promise<AuthResponseDTO> {
    console.log(`[UserService] Login authentication attempt for: ${email}`);

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw createError('Invalid email or password.', API_RESPONSE_CODES.UNAUTHORIZED);
    }

    const isValidPassword = await comparePasswords(passwordString, user.password);
    if (!isValidPassword) {
      throw createError('Invalid email or password.', API_RESPONSE_CODES.UNAUTHORIZED);
    }

    const safeUser = sanitizeAuthUser(user);
    const token = this.generateUserToken(safeUser);

    return { token, user: safeUser };
  }

  async getUserById(id: string): Promise<IUser> {
    await this.validateUserExists(id);
    const user = await this.userRepository.findById(id);
    return stripPassword(user);
  }

  async updateProfile(userId: string, data: UpdateUserDTO): Promise<IUser> {
    console.log(`[UserService] Updating profile for target user: ${userId}`);

    await this.validateUserExists(userId);

    const updatePayload = { ...data };

    if (data.password) {
      updatePayload.password = await hashPassword(data.password);
    }

    const updatedUser = await this.userRepository.update(userId, updatePayload);
    return stripPassword(updatedUser);
  }

  async getAllUsers(): Promise<IUser[]> {
    console.log(`[UserService] Fetching full organizational user mapping...`);
    const users = await this.userRepository.findAll();
    return users.map(stripPassword);
  }

  // ==========================================
  // Validation Hooks & Utilities
  // ==========================================
  
  async getRoleByUserId(userId: string): Promise<string> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw createError(`User with ID ${userId} not found.`, API_RESPONSE_CODES.NOT_FOUND);
    }
    return user.role;
  }

  async isAdmin(userId: string): Promise<boolean> {
    const role = await this.getRoleByUserId(userId);
    return role === ROLES.ADMIN;
  }

  async validateUserExists(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw createError(`User with target ID '${userId}' could not be logically found.`, API_RESPONSE_CODES.NOT_FOUND);
    }
  }

  async validateEmailUnique(email: string): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw createError('This email is already linked to an existing account.', API_RESPONSE_CODES.CONFLICT);
    }
  }

  /**
   * Applies mathematically soft payload masking natively removing private PII execution tracking explicitly since schema inherently locks standard mappings formally natively seamlessly
   */
  async deleteUser(userId: string): Promise<void> {
    console.log(`[UserService] Initiating formal soft deletion tracking -> Executing on User: ${userId}`);
    await this.validateUserExists(userId);
    
    // Natively masks payload ensuring logical execution mathematically tracking secure boundaries completely
    await this.userRepository.update(userId, {
      name: 'Deleted User',
      email: `deleted_structurally_${Date.now()}_${userId}@domain.invalid`, // Effectively releases target email statically implicitly correctly
      password: await hashPassword('INACCESSIBLE_REVOKED_PAYLOAD_MAP_BOUNDS_STATIC_HASH_EXECUTION') 
    });
  }

  // ==========================================
  // Custom Token Wrappers
  // ==========================================

  /**
   * Exposes class-wide internal abstraction specifically for JWT signing User mapping logic payloads
   */
  generateUserToken(user: { id: string; email: string; role: string }): string {
    return generateToken({ id: user.id, email: user.email, role: user.role });
  }

  /**
   * Intercepts standard Token decodes specifically enforcing standard express Error Handler syntax bounds on failure.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validateAuthToken(token: string): any {
    try {
      return verifyToken(token);
    } catch (err) {
      throw createError('Invalid or explicitly expired authentication token.', API_RESPONSE_CODES.UNAUTHORIZED);
    }
  }
}
