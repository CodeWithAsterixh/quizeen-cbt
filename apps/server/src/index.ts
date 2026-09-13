import { createApp } from './app.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
const app = createApp();

const server = app.listen(PORT, () => {
  console.log(`[CBT Server] Backend listening on http://localhost:${PORT}`);
});

const shutdown = () => {
  console.log('[CBT Server] Gracefully shutting down...');
  server.close(() => {
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
