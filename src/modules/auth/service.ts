import { randomBytes } from 'crypto';
import argon2 from 'argon2';

export class AuthService {
  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });
  }

  async verifyPassword(hash: string, password: string): Promise<boolean> {
    return await argon2.verify(hash, password);
  }

  generateSessionToken(): string {
    return randomBytes(32).toString('hex');
  }
}
