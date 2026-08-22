import { db } from '../../db/client.js';
import { bookings, services, therapists, blogPosts } from '../../db/schema/index.js';
import { sql, eq, and, gte, lte } from 'drizzle-orm';

export class AdminService {
  async getDashboardStats() {
    try {
      // Get total bookings
      const totalBookingsResult = await db.select({ count: sql<number>`count(*)` }).from(bookings);
      const totalBookings = Number(totalBookingsResult[0]?.count) || 0;

      // Get pending bookings
      const pendingResult = await db.select({ count: sql<number>`count(*)` })
        .from(bookings)
        .where(eq(bookings.status, 'pending'));
      const pendingBookings = Number(pendingResult[0]?.count) || 0;

      // Get completed bookings
      const completedResult = await db.select({ count: sql<number>`count(*)` })
        .from(bookings)
        .where(eq(bookings.status, 'completed'));
      const completedBookings = Number(completedResult[0]?.count) || 0;

      // Get cancelled bookings
      const cancelledResult = await db.select({ count: sql<number>`count(*)` })
        .from(bookings)
        .where(eq(bookings.status, 'cancelled'));
      const cancelledBookings = Number(cancelledResult[0]?.count) || 0;

      // Get total services
      const servicesResult = await db.select({ count: sql<number>`count(*)` }).from(services);
      const totalServices = Number(servicesResult[0]?.count) || 0;

      // Get total therapists
      const therapistsResult = await db.select({ count: sql<number>`count(*)` }).from(therapists);
      const totalTherapists = Number(therapistsResult[0]?.count) || 0;

      // Get total blog posts
      const blogResult = await db.select({ count: sql<number>`count(*)` }).from(blogPosts);
      const totalBlogPosts = Number(blogResult[0]?.count) || 0;

      // Get total revenue (from completed bookings)
      const revenueResult = await db.select({ sum: sql<string>`SUM(amount)` })
        .from(bookings)
        .where(eq(bookings.status, 'completed'));
      const totalRevenue = Number(revenueResult[0]?.sum) || 0;

      return {
        totalBookings,
        totalServices,
        totalTherapists,
        totalBlogPosts,
        pendingBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue,
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return {
        totalBookings: 0,
        totalServices: 0,
        totalTherapists: 0,
        totalBlogPosts: 0,
        pendingBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        totalRevenue: 0,
      };
    }
  }

  async getRecentActivity(limit: number = 10) {
    try {
      const recentBookings = await db
        .select()
        .from(bookings)
        .orderBy(bookings.createdAt)
        .limit(limit);
      
      return recentBookings.map(b => ({
        id: b.id,
        type: 'booking',
        description: `New booking from ${b.clientName}`,
        createdAt: b.createdAt,
        status: b.status,
      }));
    } catch (error) {
      console.error('Error getting recent activity:', error);
      return [];
    }
  }

  async getBookingStats() {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      // Today's bookings
      const todayResult = await db.select({ count: sql<number>`count(*)` })
        .from(bookings)
        .where(gte(bookings.createdAt, today));
      const today = Number(todayResult[0]?.count) || 0;

      // This week's bookings
      const weekResult = await db.select({ count: sql<number>`count(*)` })
        .from(bookings)
        .where(gte(bookings.createdAt, weekAgo));
      const thisWeek = Number(weekResult[0]?.count) || 0;

      // This month's bookings
      const monthResult = await db.select({ count: sql<number>`count(*)` })
        .from(bookings)
        .where(gte(bookings.createdAt, monthAgo));
      const thisMonth = Number(monthResult[0]?.count) || 0;

      return { today, thisWeek, thisMonth };
    } catch (error) {
      console.error('Error getting booking stats:', error);
      return { today: 0, thisWeek: 0, thisMonth: 0 };
    }
  }
}
