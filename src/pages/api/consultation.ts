import type { APIRoute } from 'astro';
import { POST as sendEmailPost, OPTIONS as sendEmailOptions, ALL as sendEmailAll } from './send-email';

export const prerender = false;

// Forward legacy /api/consultation requests to the canonical /api/send-email endpoint
export const OPTIONS: APIRoute = sendEmailOptions;
export const POST: APIRoute = sendEmailPost;
export const ALL: APIRoute = sendEmailAll;
