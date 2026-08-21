import { FastifyInstance } from 'fastify';
import { GalleryController } from './controller.js';

export async function galleryRoutes(fastify: FastifyInstance) {
  const controller = new GalleryController();

  // Public routes
  fastify.get('/api/gallery', controller.getAllImages.bind(controller));
  fastify.get('/api/gallery/active', controller.getActiveImages.bind(controller));
  fastify.get('/api/gallery/:id', controller.getImage.bind(controller));

  // Admin routes
  fastify.post('/api/admin/gallery', {
    preHandler: async (request: any, reply: any) => {
      const session = request.session as any;
      const user = session?.get?.('user');
      if (!user) {
        return reply.status(401).send({ success: false, error: 'Unauthorized' });
      }
    },
  }, controller.createImage.bind(controller));

  fastify.put('/api/admin/gallery/:id', {
    preHandler: async (request: any, reply: any) => {
      const session = request.session as any;
      const user = session?.get?.('user');
      if (!user) {
        return reply.status(401).send({ success: false, error: 'Unauthorized' });
      }
    },
  }, controller.updateImage.bind(controller));

  fastify.delete('/api/admin/gallery/:id', {
    preHandler: async (request: any, reply: any) => {
      const session = request.session as any;
      const user = session?.get?.('user');
      if (!user) {
        return reply.status(401).send({ success: false, error: 'Unauthorized' });
      }
    },
  }, controller.deleteImage.bind(controller));
}
