import { FastifyInstance } from 'fastify';
import { BlogController } from './controller.js';

export async function blogRoutes(fastify: FastifyInstance) {
  const controller = new BlogController();

  fastify.get('/api/blog', controller.getAllPosts.bind(controller));
  fastify.get('/api/blog/published', controller.getPublishedPosts.bind(controller));
  fastify.get('/api/blog/:id', controller.getPost.bind(controller));
  fastify.get('/api/blog/slug/:slug', controller.getPostBySlug.bind(controller));
}
