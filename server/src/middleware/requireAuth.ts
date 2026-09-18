// Assignment §9: every protected route verifies the JWT from the "token" cookie.
// No cookie or an invalid/expired/forged token → 401 and no data.
import type { Request, RequestHandler } from 'express';
import { TOKEN_COOKIE } from '../auth/cookies';
import { verifyAppJwt, type AppJwtPayload } from '../auth/jwt';
import { HttpError } from '../errors';

export const requireAuth: RequestHandler = (req, res, next) => {
  const token: unknown = req.cookies?.[TOKEN_COOKIE];
  if (typeof token !== 'string' || token.length === 0) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    req.user = verifyAppJwt(token);
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// For handlers mounted behind requireAuth; avoids non-null assertions on req.user.
export function getAuthenticatedUser(req: Request): AppJwtPayload {
  if (!req.user) throw new HttpError(401, 'Unauthorized');
  return req.user;
}
