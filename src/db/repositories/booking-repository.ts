import { and, eq, ne, gte, lte, desc, SQL, sql } from 'drizzle-orm';
import { bookings } from '../schema/index.js';
import { BaseRepository } from './base-repository.js';
import { constants } from '../../config/constants.js';

export class BookingRepository extends BaseRepository<typeof bookings> {
  constructor() {
    super(bookings);
  }

  async create(data: any): Promise<any> {
    const [result] = await this.db.insert(this.table).values(data).returning();
    if (!result) throw new Error('Failed to create booking');
    return result;
  }

  async findById(id: string): Promise<any> {
    const [result] = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.id, id));
    return result;
  }

  async findConflicts(date: Date, time: string, excludeId?: string): Promise<any[]> {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const conditions: any[] = [
      gte(this.table.appointmentDate, start),
      lte(this.table.appointmentDate, end),
      eq(this.table.appointmentTime, time),
      eq(this.table.status, constants.BOOKING_STATUS.CONFIRMED)
    ];

    if (excludeId) {
      conditions.push(ne(this.table.id, excludeId));
    }

    return await this.db
      .select()
      .from(this.table)
      .where(and(...conditions));
  }

  async updateStatus(id: string, status: string): Promise<any> {
    const [result] = await this.db
      .update(this.table)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(this.table.id, id))
      .returning();
    if (!result) throw new Error('Booking not found');
    return result;
  }

  async updatePaymentStatus(id: string, paymentStatus: string, transactionId?: string): Promise<any> {
    const updateData: any = {
      paymentStatus,
      updatedAt: new Date(),
    };
    if (transactionId) {
      updateData.mpesaTransactionId = transactionId;
    }

    const [result] = await this.db
      .update(this.table)
      .set(updateData)
      .where(eq(this.table.id, id))
      .returning();
    if (!result) throw new Error('Booking not found');
    return result;
  }

  async findAll(page: number = 1, limit: number = 50, filters?: { status?: string }): Promise<{ data: any[]; total: number }> {
    const offset = (page - 1) * limit;
    
    let data;
    
    // ✅ FIX: Use the status filter
    if (filters?.status) {
      data = await this.db
        .select()
        .from(this.table)
        .where(eq(this.table.status, filters.status as any))
        .orderBy(desc(this.table.appointmentDate))
        .limit(limit)
        .offset(offset);
    } else {
      data = await this.db
        .select()
        .from(this.table)
        .orderBy(desc(this.table.appointmentDate))
        .limit(limit)
        .offset(offset);
    }
    
    // ✅ FIX: Use proper COUNT with filters
    const countQuery = this.db
      .select({ count: sql<number>`count(*)` })
      .from(this.table);
    
    if (filters?.status) {
      countQuery.where(eq(this.table.status, filters.status as any));
    }
    
    const totalResult = await countQuery;
    const total = Number(totalResult[0]?.count) || 0;

    return { data, total };
  }
}
