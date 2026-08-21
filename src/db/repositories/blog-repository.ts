import { eq, desc } from 'drizzle-orm';
import { blogPosts } from '../schema/index.js';
import { BaseRepository } from './base-repository';

export class BlogRepository extends BaseRepository<typeof blogPosts> {
  constructor() {
    super(blogPosts);
  }

  async create(data: any): Promise<any> {
    const [result] = await this.db.insert(this.table).values(data).returning();
    if (!result) throw new Error('Failed to create blog post');
    return result;
  }

  async findById(id: string): Promise<any> {
    const [result] = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.id, id));
    return result;
  }

  async findBySlug(slug: string): Promise<any> {
    const [result] = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.slug, slug));
    return result;
  }

  async findPublished(): Promise<any[]> {
    return await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.isPublished, true))
      .orderBy(desc(this.table.publishedAt));
  }

  async findAll(): Promise<any[]> {
    return await this.db
      .select()
      .from(this.table)
      .orderBy(desc(this.table.createdAt));
  }

  async update(id: string, data: any): Promise<any> {
    const [result] = await this.db
      .update(this.table)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(this.table.id, id))
      .returning();
    if (!result) throw new Error('Blog post not found');
    return result;
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(this.table).where(eq(this.table.id, id));
  }
}

