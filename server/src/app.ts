import fs from 'node:fs';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import express from 'express';
import { config } from './config';
import { apiNotFound, errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { authApiRouter, oauthRouter } from './routes/auth';
import { capsulesRouter } from './routes/capsules';
import { healthRouter } from './routes/health';

// Built React app, relative to server/dist/app.js (and server/src/app.ts under tsx).
const clientDist = path.resolve(__dirname, '../../client/dist');

export function createApp() {
  const app = express();

  // Render terminates TLS at its load balancer and forwards plain HTTP to the service.
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  if (!config.isProd) app.use(requestLogger);
  app.use(express.json({ limit: '100kb' }));
  app.use(cookieParser());

  app.use('/api/health', healthRouter);
  app.use('/auth', oauthRouter);
  app.use('/api/auth', authApiRouter);
  app.use('/api/capsules', capsulesRouter);

  // Unknown API paths are JSON 404s, never the React index.html.
  app.use('/api', apiNotFound);

  // Assignment §8: frontend and API are served from the same application and public URL.
  // Static assets first, then the SPA fallback for client-side routes (/, /login, /dashboard).
  // Regex form as in the Week 1 lab — Express 5 rejects the string '*'.
  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist, { index: false, maxAge: '1h' }));
    app.get(/.*/, (_req, res) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  } else {
    console.warn(
      `client/dist not found at ${clientDist} — run "npm run build" to serve the React app`,
    );
  }

  app.use(errorHandler);

  return app;
}
