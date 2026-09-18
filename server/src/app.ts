import cookieParser from 'cookie-parser';
import express from 'express';
import { config } from './config';
import { apiNotFound, errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { authApiRouter, oauthRouter } from './routes/auth';
import { healthRouter } from './routes/health';

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

  app.use('/api', apiNotFound);
  app.use(errorHandler);

  return app;
}
