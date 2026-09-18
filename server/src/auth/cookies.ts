// Assignment §4/§9: the JWT lives in a Secure, HttpOnly cookie named "token" — never in
// localStorage or an Authorization header.
import type { CookieOptions } from 'express';
import { config } from '../config';

export const TOKEN_COOKIE = 'token';
export const STATE_COOKIE = 'oauth_state';

export function tokenCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    // Browsers drop Secure cookies on plain http://localhost, so it is on only in production (HTTPS).
    secure: config.isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: config.sessionTtlSeconds * 1000,
  };
}

export function stateCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: config.isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 10 * 60 * 1000,
  };
}
