// Static example records for the public landing page (rendered with the real CapsuleCard).
import type { Capsule } from '@/types/capsule';

export const SAMPLE_CAPSULES: Capsule[] = [
  {
    id: -1,
    user_id: 'example',
    project_name: 'SmartFarm Irrigation',
    prompt_title: 'Debug cloud deployment',
    prompt_version: 'v2',
    prompt_text:
      'My Node server builds fine but the deployed service never becomes healthy. It listens on 127.0.0.1:3001 and the platform sets PORT. What is wrong and what is the minimal fix?',
    response_summary:
      'Bind to 0.0.0.0 on process.env.PORT; the load balancer cannot reach loopback.',
    category: 'Coding',
    usefulness: 'Good',
    reviewed: true,
    improved: true,
    screenshot_url: 'https://render.com/docs/deploy-node-express-app',
    notes: 'v1 asked without the listen() line — answer was generic. Adding it fixed the reply.',
    created_at: '2026-09-14T09:30:00.000Z',
  },
  {
    id: -2,
    user_id: 'example',
    project_name: 'CSE5006 Essay',
    prompt_title: 'Summarise the OAuth 2.0 authorization code flow',
    prompt_version: 'v1',
    prompt_text:
      'Explain the OAuth 2.0 authorization code flow in under 150 words for a web app that uses GitHub as the identity provider.',
    response_summary: 'Redirect to provider → one-time code → server-side exchange → profile.',
    category: 'Writing',
    usefulness: 'Needs Improvement',
    reviewed: false,
    improved: false,
    screenshot_url: null,
    notes: 'Too generic — next version should ask for the state parameter and cookie handling.',
    created_at: '2026-09-16T14:05:00.000Z',
  },
];
