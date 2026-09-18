import type { ErrorRequestHandler, RequestHandler } from 'express';
import { HttpError } from '../errors';

// Unknown /api/* paths get a JSON 404 rather than the React index.html.
export const apiNotFound: RequestHandler = (_req, res) => {
  res.status(404).json({ error: 'Not found' });
};

// Single place that turns errors into responses. Never leaks stack traces to the client.
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};
