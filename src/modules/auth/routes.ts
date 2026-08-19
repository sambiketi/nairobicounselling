import { FastifyInstance } from 'fastify';
import { AuthController } from './controller.js';

export async function authRoutes(fastify: FastifyInstance) {
  const controller = new AuthController();

  fastify.post('/api/auth/login', controller.login.bind(controller));
  fastify.post('/api/auth/logout', controller.logout.bind(controller));
  fastify.get('/api/auth/me', controller.getCurrentUser.bind(controller));
}
