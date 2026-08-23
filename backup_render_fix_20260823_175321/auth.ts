import { FastifyRequest, FastifyReply } from 'fastify';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const session = request.session as any;
  const user = session?.get?.('user');
  if (!user) {
    return reply.status(401).send({
      success: false,
      error: 'Unauthorized',
    });
  }
}
