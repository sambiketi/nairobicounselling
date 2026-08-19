import { FastifyInstance } from 'fastify';
import { TherapistController } from './controller.js';

export async function therapistRoutes(fastify: FastifyInstance) {
  const controller = new TherapistController();

  fastify.get('/api/therapists', controller.getAllTherapists.bind(controller));
  fastify.get('/api/therapists/active', controller.getActiveTherapists.bind(controller));
  fastify.get('/api/therapists/:id', controller.getTherapist.bind(controller));
}
