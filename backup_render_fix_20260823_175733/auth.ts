import { FastifyRequest, FastifyReply } from 'fastify';

export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Debug logging
  console.log('🔍 Auth Check:', {
    hasUser: !!request.session.user,
    sessionId: request.session.sessionId,
    hasCookie: !!request.headers.cookie,
    url: request.url,
  });
  
  // ✅ Direct property access - consistent with @fastify/session
  const user = request.session.user;
  
  if (!user) {
    // Check if session exists but user is missing
    if (request.session.sessionId) {
      console.log('⚠️ Session exists but no user!');
    }
    
    if (request.url.startsWith('/api/')) {
      return reply.status(401).send({ 
        success: false, 
        error: 'Unauthorized - Please login' 
      });
    }
    return reply.redirect('/admin/login');
  }
  
  // Check if user has admin role
  if (user.role !== 'admin') {
    if (request.url.startsWith('/api/')) {
      return reply.status(403).send({ 
        success: false, 
        error: 'Forbidden - Insufficient permissions' 
      });
    }
    return reply.redirect('/admin/login');
  }
  
  return;
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = request.session.user;
  if (!user) {
    return reply.status(401).send({
      success: false,
      error: 'Unauthorized',
    });
  }
}
