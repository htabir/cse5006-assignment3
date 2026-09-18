// The only module that reads process.env. Everything else imports `config`.
import path from 'node:path';
import dotenv from 'dotenv';

// Load the repository-root .env regardless of the current working directory.
// On Render there is no .env file; variables are injected, so this is a no-op there.
dotenv.config({ path: path.resolve(__dirname, '../../.env'), quiet: true });

const env = process.env;

// Configuration errors are printed as one line and stop the process (no stack trace noise).
function fail(message: string): never {
  console.error(`Configuration error: ${message}`);
  process.exit(1);
}

const nodeEnv = env.NODE_ENV ?? 'development';
const isProd = nodeEnv === 'production';

// Required variables must exist in production (fail fast on Render); in development a
// missing value is tolerated so the server can start before every feature is configured.
function required(name: string): string {
  const value = env[name];
  if (!value && isProd) fail(`Missing required environment variable: ${name}`);
  return value ?? '';
}

// Secrets must also be long enough to be worth anything.
function requiredSecret(name: string): string {
  const value = required(name);
  if (value && value.length < 32) fail(`${name} must be at least 32 characters`);
  return value;
}

export const config = {
  nodeEnv,
  isProd,
  port: Number(env.PORT ?? 4000),
  appUrl: env.APP_URL ?? 'http://localhost:5173',
  databaseUrl: required('DATABASE_URL'),
  jwtSecret: requiredSecret('JWT_SECRET'),
  githubClientId: required('GITHUB_CLIENT_ID'),
  githubClientSecret: required('GITHUB_CLIENT_SECRET'),
  githubCallbackUrl: required('GITHUB_CALLBACK_URL'),
  // Lifetime of the login session — used for both the JWT expiry and the cookie maxAge.
  sessionTtlSeconds: 7 * 24 * 60 * 60,
} as const;

// Which variables are set (never their values) — logged at startup and shown in the video.
const ENV_NAMES = [
  'NODE_ENV',
  'PORT',
  'APP_URL',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
  'GITHUB_CALLBACK_URL',
  'JWT_SECRET',
  'DATABASE_URL',
];

export function describeEnvironment(): string {
  return ENV_NAMES.map((name) => `${name} ${env[name] ? '✓' : '✗'}`).join(', ');
}
