import { FastifyInstance } from 'fastify';
import { TherapistController } from './controller.js';

export async function therapistRoutes(fastify: FastifyInstance) {
  const controller = new TherapistController();

  // Public routes
  // Removed - use /api/therapists/active instead
  fastify.get('/api/therapists/active', controller.getActiveTherapists.bind(controller));
  fastify.get('/api/therapists/:id', controller.getTherapist.bind(controller));

  // Admin routes
  fastify.post('/api/admin/therapists', {
    preHandler: async (request: any, reply: any) => {
      const session = request.session as any;
      const user = session?.get?.('user');
      if (!user) {
        return reply.status(401).send({ success: false, error: 'Unauthorized' });
      }
    },
  }, controller.createTherapist.bind(controller));

  fastify.put('/api/admin/therapists/:id', {
    preHandler: async (request: any, reply: any) => {
      const session = request.session as any;
      const user = session?.get?.('user');
      if (!user) {
        return reply.status(401).send({ success: false, error: 'Unauthorized' });
      }
    },
  }, controller.updateTherapist.bind(controller));

  fastify.delete('/api/admin/therapists/:id', {
    preHandler: async (request: any, reply: any) => {
      const session = request.session as any;
      const user = session?.get?.('user');
      if (!user) {
        return reply.status(401).send({ success: false, error: 'Unauthorized' });
      }
    },
  }, controller.deleteTherapist.bind(controller));
}
