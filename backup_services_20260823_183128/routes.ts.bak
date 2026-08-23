import { FastifyInstance } from 'fastify';
import { ServiceController } from './controller.js';

export async function serviceRoutes(fastify: FastifyInstance) {
  const controller = new ServiceController();

  // Public routes
  // Removed - use /api/services/active instead
  fastify.get('/api/services/active', controller.getActiveServices.bind(controller));
  fastify.get('/api/services/:id', controller.getService.bind(controller));

  // Admin routes
  fastify.post('/api/admin/services', {
    preHandler: async (request: any, reply: any) => {
      const session = request.session as any;
      const user = session?.get?.('user');
      if (!user) {
        return reply.status(401).send({ success: false, error: 'Unauthorized' });
      }
    },
  }, controller.createService.bind(controller));

  fastify.put('/api/admin/services/:id', {
    preHandler: async (request: any, reply: any) => {
      const session = request.session as any;
      const user = session?.get?.('user');
      if (!user) {
        return reply.status(401).send({ success: false, error: 'Unauthorized' });
      }
    },
  }, controller.updateService.bind(controller));

  fastify.delete('/api/admin/services/:id', {
    preHandler: async (request: any, reply: any) => {
      const session = request.session as any;
      const user = session?.get?.('user');
      if (!user) {
        return reply.status(401).send({ success: false, error: 'Unauthorized' });
      }
    },
  }, controller.deleteService.bind(controller));
}
