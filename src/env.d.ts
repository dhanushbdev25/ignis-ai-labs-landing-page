/// <reference path="../.astro/types.d.ts" />

interface Env {
  RESEND_API_KEY: string;
  CONTACT_EMAIL: string;
  RESEND_FROM_EMAIL: string;
}

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}

