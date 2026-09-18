// Assignment §9: the application JWT is issued by Express after OAuth and verified server-side.
// This is the only module that imports jsonwebtoken.
import jwt from 'jsonwebtoken';
import { config } from '../config';

const ISSUER = 'ai-capsule';

// `sub` is the GitHub user ID (as a string) and is the capsule owner (`user_id`).
export interface AppJwtPayload {
  sub: string;
  login: string;
  name: string | null;
  avatar_url: string | null;
}

export function signAppJwt(payload: AppJwtPayload): string {
  return jwt.sign(payload, config.jwtSecret, {
    algorithm: 'HS256',
    expiresIn: config.sessionTtlSeconds,
    issuer: ISSUER,
  });
}

// Throws on a missing/invalid signature, wrong issuer, expiry, or malformed payload.
export function verifyAppJwt(token: string): AppJwtPayload {
  const decoded = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'], issuer: ISSUER });
  if (typeof decoded !== 'object' || decoded === null) throw new Error('Invalid token payload');

  const { sub, login, name, avatar_url } = decoded as Record<string, unknown>;
  if (typeof sub !== 'string' || sub.length === 0) throw new Error('Invalid token subject');
  if (typeof login !== 'string') throw new Error('Invalid token login');

  return {
    sub,
    login,
    name: typeof name === 'string' ? name : null,
    avatar_url: typeof avatar_url === 'string' ? avatar_url : null,
  };
}
