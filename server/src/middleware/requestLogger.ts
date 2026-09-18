import type { RequestHandler } from 'express';

// Development-only one-line request log. Logs the path only — never query strings (the OAuth
// callback carries code/state), cookies, headers or bodies.
export const requestLogger: RequestHandler = (req, res, next) => {
  const started = Date.now();
  const path = req.originalUrl.split('?')[0];
  res.on('finish', () => {
    console.log(`${req.method} ${path} ${res.statusCode} ${Date.now() - started}ms`);
  });
  next();
};
