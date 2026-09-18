// Assignment §5/§7: GET /api/health is public and returns exactly { "status": "ok" }.
import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json({ status: 'ok' });
});
