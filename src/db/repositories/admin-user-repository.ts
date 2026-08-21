import { eq } from 'drizzle-orm';
import { adminUsers } from '../schema/index.js';
import { BaseRepository } from './base-repository.js';

export class AdminUserRepository extends BaseRepository<typeof adminUsers> {
  constructor() {
    super(adminUsers);
  }

  async findByUsername(username: string) {
    const [result] = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.username, username));
    return result;
  }

  async findById(id: string) {
    const [result] = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.id, id));
    return result;
  }

  async updateLastLogin(id: string) {
    await this.db
      .update(this.table)
      .set({ lastLoginAt: new Date() })
      .where(eq(this.table.id, id));
  }
}


