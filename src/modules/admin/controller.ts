import { FastifyRequest, FastifyReply } from 'fastify';
import { AdminService } from './service.js';

export class AdminController {
  constructor(private adminService = new AdminService()) {}

  async getDashboard(request: FastifyRequest, reply: FastifyReply) {
    try {
      const stats = await this.adminService.getDashboardStats();
      return reply.send({ success: true, data: stats });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to load dashboard',
      });
    }
  }

  async getStats(request: FastifyRequest, reply: FastifyReply) {
    try {
      const stats = await this.adminService.getDashboardStats();
      return reply.send({ success: true, data: stats });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to load stats',
      });
    }
  }
}
