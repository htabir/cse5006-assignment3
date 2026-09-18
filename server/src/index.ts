import { createApp } from './app';
import { config } from './config';

// Render requires binding to 0.0.0.0 (the Week 1 lab's 127.0.0.1 would not be reachable).
createApp().listen(config.port, '0.0.0.0', () => {
  console.log(`AI Capsule server listening on http://localhost:${config.port} (${config.nodeEnv})`);
});
