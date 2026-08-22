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
  trustProxy: true,
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

  // ?? Debug: Check all template files
  app.get("/debug/templates", async (request, reply) => {
    const fs = await import("fs");
    const pathModule = await import("path");
    
    const viewsPath = pathModule.join(process.cwd(), "dist", "views");
    
    function getAllFiles(dir, baseDir = "") {
      const results = [];
      if (!fs.existsSync(dir)) return results;
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = pathModule.join(dir, item);
        const relativePath = pathModule.join(baseDir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          results.push({ type: "directory", path: relativePath });
          results.push(...getAllFiles(fullPath, relativePath));
        } else {
          results.push({ type: "file", path: relativePath });
        }
      }
      return results;
    }
    
    const allFiles = getAllFiles(viewsPath);
    const njkFiles = allFiles.filter(f => f.type === "file" && f.path.endsWith(".njk"));
    
    return reply.send({
      viewsPath: viewsPath,
      totalFiles: allFiles.length,
      njkFiles: njkFiles.map(f => f.path),
      allFiles: allFiles,
    });
  });

  // ?? Debug: Try to render user-facing templates
  app.get("/debug/render-user", async (request, reply) => {
    const templates = ["index.njk", "about.njk", "contact.njk", "counselors.njk", "blog.njk"];
    const results = {};
    
    for (const template of templates) {
      try {
        await reply.view(template, { title: "Test" });
        results[template] = { success: true };
      } catch (error) {
        results[template] = { 
          success: false, 
          error: error.message 
        };
      }
    }
    
    return reply.send(results);
  });

  // ?? Debug: Try to render admin templates
  app.get("/debug/render-admin", async (request, reply) => {
    const templates = ["admin/login.njk", "admin/dashboard.njk", "admin/admin-base.njk"];
    const results = {};
    
    for (const template of templates) {
      try {
        await reply.view(template, { title: "Test", user: { fullName: "Admin" } });
        results[template] = { success: true };
      } catch (error) {
        results[template] = { 
          success: false, 
          error: error.message 
        };
      }
    }
    
    return reply.send(results);
  });

  // ?? Debug: Try to render with absolute paths
  app.get("/debug/render-absolute", async (request, reply) => {
    const fs = await import("fs");
    const pathModule = await import("path");
    
    const viewsPath = pathModule.join(process.cwd(), "dist", "views");
    const templates = {
      "index": pathModule.join(viewsPath, "index.njk"),
      "admin-login": pathModule.join(viewsPath, "admin", "login.njk"),
      "admin-dashboard": pathModule.join(viewsPath, "admin", "dashboard.njk"),
    };
    
    const results = {};
    
    for (const [name, fullPath] of Object.entries(templates)) {
      const exists = fs.existsSync(fullPath);
      results[name] = { 
        path: fullPath, 
        exists: exists,
        canRender: false
      };
      
      if (exists) {
        try {
          // Try to read the file content
          const content = fs.readFileSync(fullPath, "utf8");
          results[name].contentLength = content.length;
          results[name].firstLine = content.split("\n")[0];
          
          // Try to render
          const relativePath = name === "index" ? "index.njk" : `admin/${name.replace("admin-", "")}.njk`;
          await reply.view(relativePath, { title: "Test", user: { fullName: "Admin" } });
          results[name].canRender = true;
        } catch (error) {
          results[name].canRender = false;
          results[name].error = error.message;
        }
      }
    }
    
    return reply.send(results);
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