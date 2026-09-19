// Assignment §6/§9: what a client may send. strictObject rejects unknown keys, so a body that
// tries to supply user_id (or id) fails validation — ownership only ever comes from the JWT.
import { z } from 'zod';

const optionalText = (max: number) => z.string().trim().max(max).nullish();

export const capsuleInputSchema = z.strictObject({
  project_name: z.string().trim().min(1, 'Project name is required').max(200),
  prompt_title: z.string().trim().min(1, 'Prompt title is required').max(200),
  prompt_version: optionalText(50),
  prompt_text: z.string().trim().min(1, 'Prompt text is required').max(20000),
  response_summary: optionalText(5000),
  category: optionalText(100),
  usefulness: optionalText(100),
  reviewed: z.boolean().default(false),
  improved: z.boolean().default(false),
  screenshot_url: z.url().max(2000).or(z.literal('')).nullish(),
  notes: optionalText(5000),
});

// What a client may send: everything except the server-controlled columns (id, user_id, created_at).
export type CapsuleInput = z.infer<typeof capsuleInputSchema>;

export const idParamSchema = z.coerce.number().int().positive();

// Query parameters for GET /api/capsules — all optional; filtering happens in SQL.
const boolParam = z
  .enum(['true', 'false'])
  .transform((v) => v === 'true')
  .optional();

export const listQuerySchema = z.object({
  q: z.string().trim().max(200).optional(),
  category: z.string().trim().max(100).optional(),
  usefulness: z.string().trim().max(100).optional(),
  reviewed: boolParam,
  improved: boolParam,
});

export type ListQuery = z.infer<typeof listQuerySchema>;
