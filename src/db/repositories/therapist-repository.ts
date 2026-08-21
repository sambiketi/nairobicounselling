import { eq, desc } from 'drizzle-orm';
import { therapists } from '../schema/index.js';
import { BaseRepository } from './base-repository.js';

export class TherapistRepository extends BaseRepository<typeof therapists> {
  constructor() {
    super(therapists);
  }

  async create(data: any): Promise<any> {
    const [result] = await this.db.insert(this.table).values(data).returning();
    if (!result) throw new Error('Failed to create therapist');
    return result;
  }

  async findById(id: string): Promise<any> {
    const [result] = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.id, id));
    return result;
  }

  async findActive(): Promise<any[]> {
    return await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.isActive, true))
      .orderBy(desc(this.table.displayOrder));
  }

  async findAll(): Promise<any[]> {
    return await this.db
      .select()
      .from(this.table)
      .orderBy(desc(this.table.displayOrder));
  }

  async update(id: string, data: any): Promise<any> {
    const [result] = await this.db
      .update(this.table)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(this.table.id, id))
      .returning();
    if (!result) throw new Error('Therapist not found');
    return result;
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(this.table).where(eq(this.table.id, id));
  }
}


