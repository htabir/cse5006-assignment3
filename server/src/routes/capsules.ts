// Assignment §5/§9: the four required CRUD routes, all behind JWT middleware.
import { Router } from 'express';
import { createForUser, deleteOwned, listByUser, updateOwned } from '../db/capsules.repo';
import { getAuthenticatedUser, requireAuth } from '../middleware/requireAuth';
import { capsuleInputSchema, idParamSchema } from '../schemas/capsule';

export const capsulesRouter = Router();

// Every verb on every path under /api/capsules requires a valid JWT.
capsulesRouter.use(requireAuth);

capsulesRouter.get('/', async (req, res) => {
  const user = getAuthenticatedUser(req);
  res.json(await listByUser(user.sub));
});

capsulesRouter.post('/', async (req, res) => {
  const user = getAuthenticatedUser(req);
  const body = capsuleInputSchema.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: 'Validation failed', issues: body.error.issues });
    return;
  }
  res.status(201).json(await createForUser(user.sub, body.data));
});

capsulesRouter.put('/:id', async (req, res) => {
  const user = getAuthenticatedUser(req);
  const id = idParamSchema.safeParse(req.params.id);
  const body = capsuleInputSchema.safeParse(req.body);
  if (!id.success || !body.success) {
    res
      .status(400)
      .json({ error: 'Validation failed', issues: body.success ? [] : body.error.issues });
    return;
  }
  const updated = await updateOwned(user.sub, id.data, body.data);
  if (!updated) {
    res.status(404).json({ error: 'Capsule not found' });
    return;
  }
  res.json(updated);
});

capsulesRouter.delete('/:id', async (req, res) => {
  const user = getAuthenticatedUser(req);
  const id = idParamSchema.safeParse(req.params.id);
  if (!id.success) {
    res.status(400).json({ error: 'Validation failed' });
    return;
  }
  const deleted = await deleteOwned(user.sub, id.data);
  if (!deleted) {
    res.status(404).json({ error: 'Capsule not found' });
    return;
  }
  res.status(204).end();
});
