import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from './service.js';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
});

export class AuthController {
  constructor(private authService = new AuthService()) {}

  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = loginSchema.parse(request.body);
      // In production, you would check against the database
      return reply.send({
        success: true,
        message: 'Login successful',
      });
    } catch (error) {
      return reply.status(401).send({
        success: false,
        error: 'Invalid credentials',
      });
    }
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    try {
      const session = request.session as any;
      if (session && typeof session.destroy === 'function') {
        session.destroy();
      }
      return reply.send({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to logout',
      });
    }
  }

  async getCurrentUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const session = request.session as any;
      const user = session?.get?.('user');
      if (!user) {
        return reply.status(401).send({
          success: false,
          error: 'Not authenticated',
        });
      }
      return reply.send({ success: true, data: user });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to get user',
      });
    }
  }
}
