// GitHub OAuth 2.0 Web Application Flow (server-to-server parts), following the Week 5 lab
// and https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps.
import { config } from '../config';

export interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string | null;
}

export function buildAuthorizeUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: config.githubClientId,
    redirect_uri: config.githubCallbackUrl,
    scope: 'read:user',
    state,
  });
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

// Exchanges the one-time code for an access token. The client secret never reaches the browser.
export async function exchangeCodeForToken(code: string): Promise<string> {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: config.githubClientId,
      client_secret: config.githubClientSecret,
      code,
      redirect_uri: config.githubCallbackUrl,
    }),
  });
  const data = (await response.json()) as { access_token?: string; error?: string };
  if (!response.ok || data.error || !data.access_token) {
    throw new Error(data.error ?? 'GitHub did not return an access token');
  }
  return data.access_token;
}

export async function fetchGitHubUser(accessToken: string): Promise<GitHubUser> {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${accessToken}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'ai-capsule',
    },
  });
  if (!response.ok) throw new Error(`GitHub API request failed: ${response.status}`);
  const data = (await response.json()) as Partial<GitHubUser>;
  if (typeof data.id !== 'number' || typeof data.login !== 'string') {
    throw new Error('GitHub profile is missing id or login');
  }
  return {
    id: data.id,
    login: data.login,
    name: data.name ?? null,
    avatar_url: data.avatar_url ?? null,
  };
}
