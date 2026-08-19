import { FastifyRequest, FastifyReply } from 'fastify';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(limit: number = 10, windowMs: number = 60000) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const ip = request.ip || 'unknown';
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || record.resetTime < now) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      return;
    }

    if (record.count >= limit) {
      return reply.status(429).send({
        success: false,
        error: 'Too many requests, please try again later',
      });
    }

    record.count++;
  };
}
