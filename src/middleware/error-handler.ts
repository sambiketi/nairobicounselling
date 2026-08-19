import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';

export function errorHandler(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply
) {
  const statusCode = error.statusCode || 500;

  console.error('Error:', error);

  const isProduction = process.env.NODE_ENV === 'production';

  reply.status(statusCode).send({
    success: false,
    error: isProduction && statusCode === 500
      ? 'Internal server error'
      : error.message,
  });
}
