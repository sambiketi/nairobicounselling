import { FastifyRequest, FastifyReply } from 'fastify';
import { WhatsAppVideoService } from './service.js';
import { z } from 'zod';

const createSessionSchema = z.object({
  bookingId: z.string(),
  counselorId: z.string(),
  clientName: z.string().min(2).max(100),
  clientPhone: z.string().regex(/^254[0-9]{9}$/),
  sessionTime: z.string().datetime(),
});

export class WhatsAppVideoController {
  private videoService: WhatsAppVideoService;

  constructor() {
    this.videoService = new WhatsAppVideoService();
  }

  // Create a new video session
  async createSession(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = createSessionSchema.parse(request.body);
      const sessionTime = new Date(body.sessionTime);

      if (isNaN(sessionTime.getTime())) {
        return reply.status(400).send({
          success: false,
          error: 'Invalid session time',
        });
      }

      // Reject past sessions
      if (sessionTime < new Date()) {
        return reply.status(400).send({
          success: false,
          error: 'Cannot schedule sessions in the past',
        });
      }

      const session = this.videoService.createClientSession(
        body.bookingId,
        body.counselorId,
        body.clientName,
        body.clientPhone,
        sessionTime
      );

      // Send reminder to client
      await this.videoService.sendReminder(session);

      return reply.status(201).send({
        success: true,
        data: {
          sessionId: session.id,
          whatsappLink: session.whatsappLink,
          sessionCode: session.sessionCode,
          message: 'Session created! Click the WhatsApp link to start your video call.',
          instructions: [
            '1. Click the WhatsApp link provided',
            '2. You will be connected to your counselor via WhatsApp video call',
            '3. Your session will begin once both parties are connected',
            '4. Session duration: approximately 50 minutes',
          ],
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: 'Invalid input',
          details: error.errors,
        });
      }
      console.error('Error creating video session:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to create video session',
      });
    }
  }

  // Start a session (client clicks to start)
  async startSession(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { sessionId } = request.params as { sessionId: string };
      const session = await this.videoService.getSession(sessionId);

      if (!session) {
        return reply.status(404).send({
          success: false,
          error: 'Session not found',
        });
      }

      // Update session status
      await this.videoService.updateSessionStatus(sessionId, 'active');

      // Redirect to WhatsApp video call
      return reply.send({
        success: true,
        data: {
          whatsappLink: session.whatsappLink,
          sessionCode: session.sessionCode,
          message: 'Redirecting to WhatsApp video call...',
        },
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to start session',
      });
    }
  }

  // Get session details
  async getSession(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { sessionId } = request.params as { sessionId: string };
      const session = await this.videoService.getSession(sessionId);

      if (!session) {
        return reply.status(404).send({
          success: false,
          error: 'Session not found',
        });
      }

      return reply.send({
        success: true,
        data: session,
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch session',
      });
    }
  }

  // End a session
  async endSession(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { sessionId } = request.params as { sessionId: string };
      await this.videoService.updateSessionStatus(sessionId, 'completed');

      return reply.send({
        success: true,
        message: 'Session completed successfully',
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to end session',
      });
    }
  }
}
