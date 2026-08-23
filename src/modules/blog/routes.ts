import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { BlogController } from './controller.js';

// Authentication middleware
async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  // ✅ Direct session access - no .get() needed
  const user = request.session.user;
  
  if (!user) {
    if (request.url.startsWith('/api/')) {
      return reply.status(401).send({ success: false, error: 'Unauthorized' });
    }
    return reply.redirect('/admin/login');
  }
  
  // Optional role check
  if (user.role !== 'admin') {
    if (request.url.startsWith('/api/')) {
      return reply.status(403).send({ success: false, error: 'Forbidden' });
    }
    return reply.redirect('/admin/login');
  }
}

export async function blogRoutes(fastify: FastifyInstance) {
  const controller = new BlogController();

  // ============================================
  // PUBLIC ROUTES - No Auth Required
  // ============================================
  
  fastify.get('/api/blog', controller.getAllPosts.bind(controller));
  fastify.get('/api/blog/published', controller.getPublishedPosts.bind(controller));
  fastify.get('/api/blog/:id', controller.getPost.bind(controller));
  fastify.get('/api/blog/slug/:slug', controller.getPostBySlug.bind(controller));

  // ============================================
  // ADMIN VIEW ROUTES - Auth Required
  // ============================================
  
  fastify.get('/admin/blog', { preHandler: requireAuth }, async (request, reply) => {
    return reply.view('admin/blog/index.njk', {
      activePage: 'blog',
      user: request.session.user || { fullName: 'Admin' }
    });
  });

  fastify.get('/admin/blog/create', { preHandler: requireAuth }, async (request, reply) => {
    return reply.view('admin/blog/create.njk', {
      activePage: 'blog',
      user: request.session.user || { fullName: 'Admin' }
    });
  });

  fastify.get('/admin/blog/edit/:id', { preHandler: requireAuth }, async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const post = await controller.getPostById(id);
      if (!post) return reply.redirect('/admin/blog');
      return reply.view('admin/blog/edit.njk', {
        activePage: 'blog',
        user: request.session.user || { fullName: 'Admin' },
        post: post
      });
    } catch (error) {
      console.error('Error loading edit form:', error);
      return reply.redirect('/admin/blog');
    }
  });

  // ============================================
  // ADMIN API ROUTES - Auth Required
  // ============================================
  
  fastify.post('/api/admin/blog', { 
    preHandler: requireAuth 
  }, controller.createPost.bind(controller));

  fastify.put('/api/admin/blog/:id', { 
    preHandler: requireAuth 
  }, controller.updatePost.bind(controller));

  fastify.delete('/api/admin/blog/:id', { 
    preHandler: requireAuth 
  }, controller.deletePost.bind(controller));

  fastify.post('/api/admin/blog/:id/publish', { 
    preHandler: requireAuth 
  }, controller.publishPost.bind(controller));

  fastify.post('/api/admin/blog/:id/unpublish', { 
    preHandler: requireAuth 
  }, controller.unpublishPost.bind(controller));
}
