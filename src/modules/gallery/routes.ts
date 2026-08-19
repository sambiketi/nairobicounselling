import { FastifyInstance } from 'fastify';
import { GalleryController } from './controller.js';

export async function galleryRoutes(fastify: FastifyInstance) {
  const controller = new GalleryController();

  fastify.get('/api/gallery', controller.getAllImages.bind(controller));
  fastify.get('/api/gallery/active', controller.getActiveImages.bind(controller));
  fastify.get('/api/gallery/:id', controller.getImage.bind(controller));
}
