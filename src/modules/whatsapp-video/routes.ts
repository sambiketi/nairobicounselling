import { FastifyInstance } from 'fastify';
import { WhatsAppVideoController } from './controller.js';

export async function videoCallRoutes(fastify: FastifyInstance) {
  const controller = new WhatsAppVideoController();

  // Create a new video session (for admin/counselor)
  fastify.post('/api/video/session', controller.createSession.bind(controller));

  // Start a session (client clicks this)
  fastify.post('/api/video/session/:sessionId/start', controller.startSession.bind(controller));

  // Get session details
  fastify.get('/api/video/session/:sessionId', controller.getSession.bind(controller));

  // End a session
  fastify.post('/api/video/session/:sessionId/end', controller.endSession.bind(controller));

  // Simple HTML page for starting session (if needed)
  fastify.get('/video-call/start/:sessionId', async (request, reply) => {
    const { sessionId } = request.params as { sessionId: string };
    return reply.view('video-call/start.njk', {
      title: 'Start Video Session',
      sessionId: sessionId,
    });
  });
}
