import { FastifyInstance } from 'fastify';
import { ServiceController } from './controller.js';

export async function serviceRoutes(fastify: FastifyInstance) {
  const controller = new ServiceController();

  fastify.get('/api/services', controller.getAllServices.bind(controller));
  fastify.get('/api/services/active', controller.getActiveServices.bind(controller));
  fastify.get('/api/services/:id', controller.getService.bind(controller));
}
