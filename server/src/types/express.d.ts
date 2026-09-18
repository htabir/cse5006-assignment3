import type { AppJwtPayload } from '../auth/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: AppJwtPayload;
    }
  }
}
