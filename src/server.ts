import { buildApp } from './app.js';
import { env } from './config/env.js';

const app = await buildApp();

const port = env.PORT;
const host = '0.0.0.0';

try {
  await app.listen({ port, host });
  console.log('🚀 Server running at http://localhost:' + port);
  console.log('📚 Environment: ' + env.NODE_ENV);
  console.log('📝 Press Ctrl+C to stop');
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}
