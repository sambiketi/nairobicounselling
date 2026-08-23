import { FastifyInstance } from 'fastify';
import { TherapistController } from './controller.js';

export async function therapistRoutes(fastify: FastifyInstance) {
  const controller = new TherapistController();

  // ============================================
  // PUBLIC API ROUTES
  // ============================================
  fastify.get('/api/therapists/active', controller.getActiveTherapists.bind(controller));
  fastify.get('/api/therapists/:id', controller.getTherapist.bind(controller));

  // ============================================
  // ADMIN API ROUTES
  // ============================================
  fastify.post('/api/admin/therapists', {
    preHandler: async (request: any, reply: any) => {
      const session = request.session as any;
      const user = session?.user;
      if (!user) {
        return reply.status(401).send({ success: false, error: 'Unauthorized' });
      }
    },
  }, controller.createTherapist.bind(controller));

  fastify.put('/api/admin/therapists/:id', {
    preHandler: async (request: any, reply: any) => {
      const session = request.session as any;
      const user = session?.user;
      if (!user) {
        return reply.status(401).send({ success: false, error: 'Unauthorized' });
      }
    },
  }, controller.updateTherapist.bind(controller));

  fastify.delete('/api/admin/therapists/:id', {
    preHandler: async (request: any, reply: any) => {
      const session = request.session as any;
      const user = session?.user;
      if (!user) {
        return reply.status(401).send({ success: false, error: 'Unauthorized' });
      }
    },
  }, controller.deleteTherapist.bind(controller));

  // ============================================
  // ADMIN VIEW ROUTES - FIX 404 ERROR
  // ============================================
  
  // Create Counselor Page
  fastify.get('/admin/counselors/create', {
    preHandler: async (request: any, reply: any) => {
      const session = request.session as any;
      const user = session?.user;
      if (!user) {
        return reply.redirect('/admin/login');
      }
    },
  }, async (request, reply) => {
    const session = request.session as any;
    return reply.view('admin/counselors/create.njk', {
      activePage: 'counselors',
      user: session?.user || { fullName: 'Admin' },
      title: 'Create Counselor'
    });
  });

  // Edit Counselor Page
  fastify.get('/admin/counselors/edit/:id', {
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
      const counselor = await controller.getTherapistById(id);
      if (!counselor) {
        return reply.redirect('/admin/counselors');
      }
      return reply.view('admin/counselors/edit.njk', {
        activePage: 'counselors',
        user: session?.user || { fullName: 'Admin' },
        counselor: counselor,
        title: 'Edit Counselor'
      });
    } catch (error) {
      console.error('Error loading counselor edit page:', error);
      return reply.redirect('/admin/counselors');
    }
  });
}
