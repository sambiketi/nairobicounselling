import { FastifyInstance } from 'fastify';
import { SettingsController } from './controller.js';

export async function settingsRoutes(fastify: FastifyInstance) {
  const controller = new SettingsController();

  // Public routes (for viewing location on frontend)
  fastify.get('/api/settings/location', controller.getLocationSettings.bind(controller));
  fastify.get('/api/settings/content', controller.getSiteContent.bind(controller));

  // Admin routes for content
  fastify.put('/api/admin/settings/content', {
    preHandler: async (request: any, reply: any) => {
      const session = request.session as any;
      const user = session?.get?.('user');
      if (!user) {
        return reply.status(401).send({ success: false, error: 'Unauthorized' });
      }
    },
  }, controller.updateSiteContent.bind(controller));


  // Admin routes (protected)
  fastify.put('/api/admin/settings/location', {
    preHandler: async (request: any, reply: any) => {
      const session = request.session as any;
      const user = session?.get?.('user');
      if (!user) {
        return reply.status(401).send({
          success: false,
          error: 'Unauthorized',
        });
      }
    },
  }, controller.updateLocation.bind(controller));

  fastify.get('/api/admin/settings', {
    preHandler: async (request: any, reply: any) => {
      const session = request.session as any;
      const user = session?.get?.('user');
      if (!user) {
        return reply.status(401).send({
          success: false,
          error: 'Unauthorized',
        });
      }
    },
  }, controller.getAllSettings.bind(controller));
}



