// Assignment §9: OAuth login → Express issues its own JWT → Secure/HttpOnly cookie "token".
import crypto from 'node:crypto';
import { Router } from 'express';
import { z } from 'zod';
import {
  STATE_COOKIE,
  TOKEN_COOKIE,
  stateCookieOptions,
  tokenCookieOptions,
} from '../auth/cookies';
import { buildAuthorizeUrl, exchangeCodeForToken, fetchGitHubUser } from '../auth/github';
import { signAppJwt } from '../auth/jwt';
import { config } from '../config';
import { getAuthenticatedUser, requireAuth } from '../middleware/requireAuth';

const callbackQuerySchema = z.object({ code: z.string().min(1), state: z.string().min(1) });

// Mounted at /auth
export const oauthRouter = Router();

oauthRouter.get('/github', (_req, res) => {
  // CSRF protection: remember a random state in a short-lived cookie and require GitHub to echo it.
  const state = crypto.randomBytes(24).toString('hex');
  res.cookie(STATE_COOKIE, state, stateCookieOptions());
  res.redirect(buildAuthorizeUrl(state));
});

oauthRouter.get('/github/callback', async (req, res) => {
  const parsed = callbackQuerySchema.safeParse(req.query);
  const expectedState: unknown = req.cookies?.[STATE_COOKIE];
  res.clearCookie(STATE_COOKIE, stateCookieOptions());

  if (!parsed.success || parsed.data.state !== expectedState) {
    res.status(400).json({ error: 'Invalid OAuth state. Restart the login flow.' });
    return;
  }

  try {
    const accessToken = await exchangeCodeForToken(parsed.data.code);
    const githubUser = await fetchGitHubUser(accessToken);
    // The GitHub token is discarded here; from now on the browser proves identity with our JWT.
    const token = signAppJwt({
      sub: String(githubUser.id),
      login: githubUser.login,
      name: githubUser.name,
      avatar_url: githubUser.avatar_url,
    });
    res.cookie(TOKEN_COOKIE, token, tokenCookieOptions());
    res.redirect(`${config.appUrl}/dashboard`);
  } catch (err) {
    console.error('OAuth callback failed:', err instanceof Error ? err.message : err);
    res.redirect(`${config.appUrl}/login?error=oauth_failed`);
  }
});

// Mounted at /api/auth
export const authApiRouter = Router();

authApiRouter.get('/me', requireAuth, (req, res) => {
  const user = getAuthenticatedUser(req);
  res.json({ id: user.sub, login: user.login, name: user.name, avatar_url: user.avatar_url });
});

authApiRouter.post('/logout', (_req, res) => {
  res.clearCookie(TOKEN_COOKIE, tokenCookieOptions());
  res.status(204).end();
});
