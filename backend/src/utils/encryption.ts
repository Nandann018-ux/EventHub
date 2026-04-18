import bcrypt from 'bcryptjs';
const SALT_ROUNDS = 10;
export const hashPassword = async (password: string): Promise<string> => {
  if (!password) {
    throw new Error('Password string is required for hashing.');
  }
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};
export const comparePasswords = async (plainText: string, hashed: string): Promise<boolean> => {
  if (!plainText || !hashed) {
    return false;
  }
  return bcrypt.compare(plainText, hashed);
};