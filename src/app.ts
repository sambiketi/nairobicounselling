import Fastify from 'fastify';
import fastifyView from '@fastify/view';
import fastifyStatic from '@fastify/static';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import fastifyFormBody from '@fastify/formbody';
import fastifyMultipart from '@fastify/multipart';
import fastifyRateLimit from '@fastify/rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import nunjucks from 'nunjucks';
import { env } from './config/env.js';
import { bookingRoutes } from './modules/bookings/routes.js';
import { authRoutes } from './modules/auth/routes.js';
import { adminRoutes } from './modules/admin/routes.js';
import { therapistRoutes } from './modules/therapists/routes.js';
import { serviceRoutes } from './modules/services/routes.js';
import { galleryRoutes } from './modules/gallery/routes.js';
import { blogRoutes } from './modules/blog/routes.js';
import { settingsRoutes } from './modules/settings/routes.js';
import { videoCallRoutes } from './modules/whatsapp-video/routes.js';
import { homeRoutes } from './routes/home.js';
import { errorHandler } from './middleware/error-handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function buildApp() {
  const app = Fastify({
    logger: env.NODE_ENV !== 'production'
      ? {
          transport: {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          },
        }
      : true,
  });

  await app.register(fastifyFormBody);
  await app.register(fastifyMultipart, {
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });
  await app.register(fastifyCookie);
  await app.register(fastifySession, {
    secret: env.SESSION_SECRET,
    cookie: {
      secure: env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    },
  });

  // 🔍 Diagnostic route to check session
  app.get("/debug/session", async (request, reply) => {
    const user = (request.session as any).user;
    console.log("🔍 Debug session check - Session ID:", request.session.sessionId);
    console.log("🔍 Debug session check - User:", user);
    return reply.send({
      sessionId: request.session.sessionId,
      user: user || null,
      cookies: request.headers.cookie || null,
    });
  });

  await app.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // Setup views
  const viewsDir = path.join(__dirname, 'views');

  // Register view engine with Nunjucks
  await app.register(fastifyView, {
    engine: {
      nunjucks: nunjucks,
    },
    templates: viewsDir,
    includeViewExtension: true,
  });

  await app.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/public/',
  });

  // Register all routes
  await app.register(homeRoutes);
  await app.register(bookingRoutes);
  await app.register(authRoutes);
  await app.register(adminRoutes);
  await app.register(therapistRoutes);
  await app.register(serviceRoutes);
  await app.register(galleryRoutes);
  await app.register(blogRoutes);
  await app.register(settingsRoutes);
  await app.register(videoCallRoutes);

  app.setErrorHandler(errorHandler);

  return app;
}