import { FastifyInstance } from 'fastify';
import { ServiceController } from './controller.js';

export async function serviceRoutes(fastify: FastifyInstance) {
  const controller = new ServiceController();

  // ============================================
  // PUBLIC API ROUTES
  // ============================================
  fastify.get('/api/services/active', controller.getActiveServices.bind(controller));
  fastify.get('/api/services/:id', controller.getService.bind(controller));

  // ============================================
  // ADMIN API ROUTES
  // ============================================
  fastify.post('/api/admin/services', {
    preHandler: async (request: any, reply: any) => {
      const session = request.session as any;
      const user = session?.user;
      if (!user) {
        return reply.status(401).send({ success: false, error: 'Unauthorized' });
      }
    },
  }, controller.createService.bind(controller));

  fastify.put('/api/admin/services/:id', {
    preHandler: async (request: any, reply: any) => {
      const session = request.session as any;
      const user = session?.user;
      if (!user) {
        return reply.status(401).send({ success: false, error: 'Unauthorized' });
      }
    },
  }, controller.updateService.bind(controller));

  fastify.delete('/api/admin/services/:id', {
    preHandler: async (request: any, reply: any) => {
      const session = request.session as any;
      const user = session?.user;
      if (!user) {
        return reply.status(401).send({ success: false, error: 'Unauthorized' });
      }
    },
  }, controller.deleteService.bind(controller));

  // ============================================
  // ADMIN VIEW ROUTES - Added for UI
  // ============================================
  
  // Create Service Page
  fastify.get('/admin/services/create', {
    preHandler: async (request: any, reply: any) => {
      const session = request.session as any;
      const user = session?.user;
      if (!user) {
        return reply.redirect('/admin/login');
      }
    },
  }, async (request, reply) => {
    const session = request.session as any;
    return reply.view('admin/services/create.njk', {
      activePage: 'services',
      user: session?.user || { fullName: 'Admin' },
      title: 'Create Service'
    });
  });

  // Edit Service Page
  fastify.get('/admin/services/edit/:id', {
    preHandler: async (request: any, reply: any) => {
      const session = request.session as any;
      const user = session?.user;
      if (!user) {
        return reply.redirect('/admin/login');
      }
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const session = request.session as any;
    try {
      const service = await controller.getServiceById(id);
      if (!service) {
        return reply.redirect('/admin/services');
      }
      return reply.view('admin/services/edit.njk', {
        activePage: 'services',
        user: session?.user || { fullName: 'Admin' },
        service: service,
        title: 'Edit Service'
      });
    } catch (error) {
      console.error('Error loading service edit page:', error);
      return reply.redirect('/admin/services');
    }
  });
}
