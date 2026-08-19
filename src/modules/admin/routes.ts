import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AdminController } from './controller.js';

export async function adminRoutes(fastify: FastifyInstance) {
  const controller = new AdminController();

  fastify.addHook('preHandler', async (request: FastifyRequest, reply: FastifyReply) => {
    const session = request.session as any;
    const user = session?.get?.('user');
    if (!user) {
      return reply.status(401).send({
        success: false,
        error: 'Unauthorized',
      });
    }
  });

  fastify.get('/api/admin/dashboard', controller.getDashboard.bind(controller));
}
