
export class AdminService {
  async getDashboardStats() {
    return {
      totalBookings: 0,
      totalServices: 0,
      totalTherapists: 0,
      totalBlogPosts: 0,
      pendingBookings: 0,
    };
  }

  async getRecentActivity() {
    return [];
  }
}
