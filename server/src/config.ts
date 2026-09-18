// The only module that reads process.env. Everything else imports `config`.
import path from 'node:path';
import dotenv from 'dotenv';

// Load the repository-root .env regardless of the current working directory.
// On Render there is no .env file; variables are injected, so this is a no-op there.
dotenv.config({ path: path.resolve(__dirname, '../../.env'), quiet: true });

const env = process.env;

const nodeEnv = env.NODE_ENV ?? 'development';
const isProd = nodeEnv === 'production';

// Required variables must exist in production (fail fast on Render); in development a
// missing value is tolerated so the server can start before every feature is configured.
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by fields added in later commits
function required(name: string): string {
  const value = env[name];
  if (!value && isProd) throw new Error(`Missing required environment variable: ${name}`);
  return value ?? '';
}

export const config = {
  nodeEnv,
  isProd,
  port: Number(env.PORT ?? 4000),
  appUrl: env.APP_URL ?? 'http://localhost:5173',
  // Lifetime of the login session — used for both the JWT expiry and the cookie maxAge.
  sessionTtlSeconds: 7 * 24 * 60 * 60,
} as const;
