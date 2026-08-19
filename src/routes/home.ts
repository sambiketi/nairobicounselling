import { FastifyInstance } from 'fastify';

export async function homeRoutes(fastify: FastifyInstance) {
  // Home page
  fastify.get('/', async (request, reply) => {
    try {
      return reply.view('index.njk', {
        title: 'Massage Nairobi - Professional Massage Therapy',
        message: 'Welcome to Massage Nairobi'
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to load home page'
      });
    }
  });

  // Therapists page
  fastify.get('/therapists', async (request, reply) => {
    try {
      return reply.view('therapists.njk', {
        title: 'Our Therapists - Massage Nairobi'
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to load therapists page'
      });
    }
  });

  // About page
  fastify.get('/about', async (request, reply) => {
    try {
      return reply.view('about.njk', {
        title: 'About Us - Massage Nairobi'
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to load about page'
      });
    }
  });

  // Blog page
  fastify.get('/blog', async (request, reply) => {
    try {
      return reply.view('blog.njk', {
        title: 'Blog - Massage Nairobi'
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to load blog page'
      });
    }
  });

  // Blog post page
  fastify.get('/blog/:slug', async (request, reply) => {
    try {
      const { slug } = request.params as { slug: string };
      return reply.view('blog-post.njk', {
        title: 'Blog Post - Massage Nairobi',
        post: { title: 'Blog Post', slug: slug }
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to load blog post'
      });
    }
  });
}
