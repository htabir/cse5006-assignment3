import type { RequestHandler } from 'express';

// Development-only one-line request log. Never logs cookies, headers or bodies.
export const requestLogger: RequestHandler = (req, res, next) => {
  const started = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - started}ms`);
  });
  next();
};
