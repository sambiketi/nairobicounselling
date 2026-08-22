import { FastifyInstance } from 'fastify';
import { BlogController } from './controller.js';

export async function blogRoutes(fastify: FastifyInstance) {
  const controller = new BlogController();

  // Public routes (read-only)
  fastify.get('/api/blog', controller.getAllPosts.bind(controller));
  fastify.get('/api/blog/published', controller.getPublishedPosts.bind(controller));
  fastify.get('/api/blog/:id', controller.getPost.bind(controller));
  fastify.get('/api/blog/slug/:slug', controller.getPostBySlug.bind(controller));

  // Admin routes (write operations)
  fastify.post('/api/admin/blog', {
    preHandler: async (request: any, reply: any) => {
      const session = request.session as any;
      const user = session.user;
      if (!user) {
        return reply.status(401).send({ success: false, error: 'Unauthorized' });
      }
    },
  }, controller.createPost.bind(controller));

  fastify.put('/api/admin/blog/:id', {
    preHandler: async (request: any, reply: any) => {
      const session = request.session as any;
      const user = session.user;
      if (!user) {
        return reply.status(401).send({ success: false, error: 'Unauthorized' });
      }
    },
  }, controller.updatePost.bind(controller));

  fastify.delete('/api/admin/blog/:id', {
    preHandler: async (request: any, reply: any) => {
      const session = request.session as any;
      const user = session.user;
      if (!user) {
        return reply.status(401).send({ success: false, error: 'Unauthorized' });
      }
    },
  }, controller.deletePost.bind(controller));

  fastify.post('/api/admin/blog/:id/publish', {
    preHandler: async (request: any, reply: any) => {
      const session = request.session as any;
      const user = session.user;
      if (!user) {
        return reply.status(401).send({ success: false, error: 'Unauthorized' });
      }
    },
  }, controller.publishPost.bind(controller));

  fastify.post('/api/admin/blog/:id/unpublish', {
    preHandler: async (request: any, reply: any) => {
      const session = request.session as any;
      const user = session.user;
      if (!user) {
        return reply.status(401).send({ success: false, error: 'Unauthorized' });
      }
    },
  }, controller.unpublishPost.bind(controller));
}
