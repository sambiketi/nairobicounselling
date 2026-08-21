import { FastifyRequest, FastifyReply } from 'fastify';
import { ServiceManagementService } from './service.js';
import { z } from 'zod';

const createServiceSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/),
  duration: z.number().int().positive(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

const updateServiceSchema = createServiceSchema.partial();

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

  // Admin methods
  async createService(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = createServiceSchema.parse(request.body);
            // Handle undefined values
      const createData = {
        name: body.name,
        price: body.price,
        duration: body.duration,
        description: body.description || null,
        imageUrl: body.imageUrl || null,
        isActive: body.isActive ?? true,
        displayOrder: body.displayOrder ?? 0,
      };
      const service = await this.serviceService.createService(createData);
      return reply.status(201).send({
        success: true,
        data: service,
        message: 'Service created successfully',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: 'Invalid input',
          details: error.errors,
        });
      }
      return reply.status(500).send({
        success: false,
        error: 'Failed to create service',
      });
    }
  }

  async updateService(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const body = updateServiceSchema.parse(request.body);
            // Handle undefined values
      const updateData: any = {};
      if (body.name !== undefined) updateData.name = body.name;
      if (body.price !== undefined) updateData.price = body.price;
      if (body.duration !== undefined) updateData.duration = body.duration;
      if (body.description !== undefined) updateData.description = body.description || null;
      if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl || null;
      if (body.isActive !== undefined) updateData.isActive = body.isActive;
      if (body.displayOrder !== undefined) updateData.displayOrder = body.displayOrder;
      const service = await this.serviceService.updateService(id, updateData);
      return reply.send({
        success: true,
        data: service,
        message: 'Service updated successfully',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: 'Invalid input',
          details: error.errors,
        });
      }
      return reply.status(500).send({
        success: false,
        error: 'Failed to update service',
      });
    }
  }

  async deleteService(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      await this.serviceService.deleteService(id);
      return reply.send({
        success: true,
        message: 'Service deleted successfully',
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to delete service',
      });
    }
  }
}

