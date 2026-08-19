export class AdminService {
  async getDashboardStats() {
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

  async getRecentActivity() {
    return [];
  }

  async getBookingStats() {
    return {
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
    };
  }
}
