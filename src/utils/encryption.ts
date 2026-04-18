import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hashes a plain-text password using bcrypt.
 * @param password The raw password string
 * @returns The hashed password string
 */
export const hashPassword = async (password: string): Promise<string> => {
  if (!password) {
    throw new Error('Password string is required for hashing.');
  }
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

/**
 * Compares a plain-text password against a hashed bcrypt password.
 * @param plainText Raw password input string
 * @param hashed Hashed password from database
 * @returns Boolean denoting validity
 */
export const comparePasswords = async (plainText: string, hashed: string): Promise<boolean> => {
  if (!plainText || !hashed) {
    return false;
  }
  return bcrypt.compare(plainText, hashed);
};
