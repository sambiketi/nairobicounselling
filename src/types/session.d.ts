// Type declaration for Fastify Session with user property
import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    session: FastifySession & {
      user?: {
        id: string;
        username: string;
        fullName: string;
        role: string;
      };
    };
  }
}

declare module '@fastify/session' {
  interface Session {
    user?: {
      id: string;
      username: string;
      fullName: string;
      role: string;
    };
  }
}
