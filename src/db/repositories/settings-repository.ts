import { eq } from 'drizzle-orm';
import { siteSettings } from '../schema';
import { BaseRepository } from './base-repository';

export class SettingsRepository extends BaseRepository<typeof siteSettings> {
  constructor() {
    super(siteSettings);
  }

  async create(data: any): Promise<any> {
    const [result] = await this.db.insert(this.table).values(data).returning();
    if (!result) throw new Error('Failed to create setting');
    return result;
  }

  async findByKey(key: string): Promise<any> {
    const [result] = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.key, key));
    return result;
  }

  async findAll(): Promise<any[]> {
    return await this.db
      .select()
      .from(this.table);
  }

  async update(key: string, value: any): Promise<any> {
    const [result] = await this.db
      .update(this.table)
      .set({ value, updatedAt: new Date() })
      .where(eq(this.table.key, key))
      .returning();
    if (!result) throw new Error('Setting not found');
    return result;
  }
}
