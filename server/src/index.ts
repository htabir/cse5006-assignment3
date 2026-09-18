import { createApp } from './app';
import { config, describeEnvironment } from './config';
import { initDb } from './db/init';

async function main() {
  console.log(`Environment: ${describeEnvironment()}`);
  await initDb();
  console.log('Database ready');

  // Render requires binding to 0.0.0.0 (the Week 1 lab's 127.0.0.1 would not be reachable).
  createApp().listen(config.port, '0.0.0.0', () => {
    console.log(
      `AI Capsule server listening on http://localhost:${config.port} (${config.nodeEnv})`,
    );
  });
}

main().catch((err) => {
  console.error('Startup failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
