import { FastifyRequest, FastifyReply } from 'fastify';
import { ServiceManagementService } from './service.js';

export class ServiceController {
  constructor(private serviceService = new ServiceManagementService()) {}

  async getAllServices(request: FastifyRequest, reply: FastifyReply) {
    try {
      const services = await this.serviceService.getAllServices();
      return reply.send({ success: true, data: services });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch services',
      });
    }
  }

  async getActiveServices(request: FastifyRequest, reply: FastifyReply) {
    try {
      const services = await this.serviceService.getActiveServices();
      return reply.send({ success: true, data: services });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch active services',
      });
    }
  }

  async getService(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const service = await this.serviceService.getService(id);
      if (!service) {
        return reply.status(404).send({
          success: false,
          error: 'Service not found',
        });
      }
      return reply.send({ success: true, data: service });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch service',
      });
    }
  }
}
