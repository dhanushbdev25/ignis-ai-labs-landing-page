export interface MailEnv {
  RESEND_API_KEY: string;
  CONTACT_EMAIL: string;
  RESEND_FROM_EMAIL: string;
}

type RuntimeLocals = {
  runtime?: {
    env?: Partial<Record<keyof MailEnv | string, string | undefined>>;
  };
};

/**
 * Reads RESEND_API_KEY, CONTACT_EMAIL, and RESEND_FROM_EMAIL strictly from
 * Cloudflare Workers runtime bindings via `locals.runtime.env` (@astrojs/cloudflare v12).
 * Throws an explicit Error naming any missing variables.
 */
export function getMailEnv(locals: App.Locals | RuntimeLocals | unknown): MailEnv {
  const runtimeEnv = (locals as RuntimeLocals | undefined)?.runtime?.env;

  if (!runtimeEnv) {
    throw new Error(
      'Cloudflare runtime environment (locals.runtime.env) is unavailable. Missing: RESEND_API_KEY, CONTACT_EMAIL, RESEND_FROM_EMAIL.'
    );
  }

  const requiredKeys = ['RESEND_API_KEY', 'CONTACT_EMAIL', 'RESEND_FROM_EMAIL'] as const;
  const missing: string[] = [];
  const envValues = {} as MailEnv;

  for (const key of requiredKeys) {
    const value = runtimeEnv[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      envValues[key] = value.trim();
    } else {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required Cloudflare runtime environment variable(s): ${missing.join(', ')}.`
    );
  }

  return envValues;
}

