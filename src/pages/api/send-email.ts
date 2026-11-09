import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { z } from 'zod';

export const prerender = false;

// 64 KB maximum request body size
const MAX_BODY_BYTES = 64 * 1024;

// Standard CORS and content headers
const corsHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
};

// In-memory sliding rate limiter (5 requests per 10 minutes per IP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(
  ip: string,
  limit = 5,
  windowMs = 10 * 60 * 1000
): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();

  // Housekeeping: remove expired records to prevent memory leak
  if (rateLimitMap.size > 1000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetAt < now) rateLimitMap.delete(key);
    }
  }

  const record = rateLimitMap.get(ip);
  if (!record || record.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (record.count >= limit) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count += 1;
  return { allowed: true };
}

// Server-side Zod validation schema
export const contactFormSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email cannot exceed 255 characters'),
  subject: z
    .string({ required_error: 'Subject is required' })
    .trim()
    .min(1, 'Subject is required')
    .max(200, 'Subject cannot exceed 200 characters'),
  message: z
    .string({ required_error: 'Message is required' })
    .trim()
    .min(1, 'Message is required')
    .max(5000, 'Message cannot exceed 5000 characters'),
  mobile: z.string().trim().max(50, 'Mobile cannot exceed 50 characters').optional(),
  company: z.string().trim().max(100, 'Company cannot exceed 100 characters').optional(),
  primaryInterest: z.string().trim().max(100).optional(),
  background: z.string().trim().max(100).optional(),
  submittedAt: z.string().optional(),
  website: z.string().optional(), // Honeypot field for spam detection
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Normalize frontend field aliases (fullName -> name, goals -> message, primaryInterest -> subject fallback)
function normalizePayload(input: unknown): Record<string, unknown> {
  if (typeof input !== 'object' || input === null) return {};
  const data = input as Record<string, unknown>;

  const name =
    typeof data.name === 'string' && data.name.trim()
      ? data.name.trim()
      : typeof data.fullName === 'string' && data.fullName.trim()
        ? data.fullName.trim()
        : undefined;

  const email = typeof data.email === 'string' ? data.email.trim() : undefined;

  let subject =
    typeof data.subject === 'string' && data.subject.trim()
      ? data.subject.trim()
      : undefined;
  if (!subject && typeof data.primaryInterest === 'string' && data.primaryInterest.trim()) {
    subject = data.primaryInterest.trim();
  }

  const message =
    typeof data.message === 'string' && data.message.trim()
      ? data.message.trim()
      : typeof data.goals === 'string' && data.goals.trim()
        ? data.goals.trim()
        : undefined;

  return {
    name,
    email,
    subject,
    message,
    mobile: typeof data.mobile === 'string' && data.mobile.trim() ? data.mobile.trim() : undefined,
    company: typeof data.company === 'string' && data.company.trim() ? data.company.trim() : undefined,
    primaryInterest:
      typeof data.primaryInterest === 'string' && data.primaryInterest.trim()
        ? data.primaryInterest.trim()
        : undefined,
    background:
      typeof data.background === 'string' && data.background.trim()
        ? data.background.trim()
        : undefined,
    submittedAt: typeof data.submittedAt === 'string' ? data.submittedAt : undefined,
    website: typeof data.website === 'string' ? data.website : undefined,
  };
}

// HTML sanitizer/escaper to prevent XSS / HTML injection in email clients
function escapeHtml(str: string | undefined | null): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Clean, professional HTML email template adhering to Ignis AI Labs branding
function generateBrandedEmailHtml(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  mobile?: string;
  company?: string;
  primaryInterest?: string;
  background?: string;
  submittedAtFormatted: string;
  clientIp?: string;
}): string {
  const escapedName = escapeHtml(data.name);
  const escapedEmail = escapeHtml(data.email);
  const escapedSubject = escapeHtml(data.subject);
  const escapedMessage = escapeHtml(data.message);
  const escapedMobile = escapeHtml(data.mobile);
  const escapedCompany = escapeHtml(data.company);
  const escapedInterest = escapeHtml(data.primaryInterest);
  const escapedBackground = escapeHtml(data.background);
  const escapedDate = escapeHtml(data.submittedAtFormatted);
  const escapedIp = escapeHtml(data.clientIp);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Website Enquiry - ${escapedSubject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050403; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f7f4ef; -webkit-font-smoothing: antialiased; line-height: 1.6;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #050403; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #0d0b09; border: 1px solid #1f1a16; border-radius: 8px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.8);">
          
          <!-- Molten Header Filament Bar -->
          <tr>
            <td height="3" style="background: linear-gradient(90deg, #ff3b1e 0%, #ff7a18 50%, #ffb443 100%);"></td>
          </tr>

          <!-- Header Section -->
          <tr>
            <td style="padding: 32px 36px 24px 36px; border-bottom: 1px solid #1a1612;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-family: ui-monospace, 'IBM Plex Mono', 'Courier New', monospace; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #ffb443; margin-bottom: 6px;">
                      IGNIS AI LABS · WEBSITE ENQUIRY
                    </div>
                    <h1 style="margin: 0; font-size: 22px; font-weight: 600; color: #f7f4ef; letter-spacing: -0.02em;">
                      New Contact Request
                    </h1>
                  </td>
                  <td align="right" valign="top">
                    <span style="display: inline-block; padding: 6px 12px; font-family: ui-monospace, 'IBM Plex Mono', monospace; font-size: 11px; color: #ffb443; background-color: rgba(255, 180, 67, 0.1); border: 1px solid rgba(255, 180, 67, 0.25); border-radius: 4px;">
                      1538°C / INCOMING
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Section -->
          <tr>
            <td style="padding: 32px 36px;">

              <!-- Subject Banner -->
              <div style="margin-bottom: 28px; padding: 14px 18px; background-color: #14100c; border: 1px solid #28211a; border-left: 3px solid #ff7a18; border-radius: 4px;">
                <div style="font-family: ui-monospace, 'IBM Plex Mono', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #9e9488; margin-bottom: 4px;">
                  Subject
                </div>
                <div style="font-size: 15px; font-weight: 600; color: #f7f4ef;">
                  ${escapedSubject}
                </div>
              </div>

              <!-- Visitor Details Grid -->
              <div style="margin-bottom: 28px;">
                <div style="font-family: ui-monospace, 'IBM Plex Mono', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: #ffb443; margin-bottom: 14px;">
                  Visitor Information
                </div>

                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #120e0a; border: 1px solid #1f1a16; border-radius: 6px;">
                  <tr>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #1a1612; width: 35%; font-family: ui-monospace, 'IBM Plex Mono', monospace; font-size: 11px; color: #9e9488; text-transform: uppercase;">
                      Full Name
                    </td>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #1a1612; font-size: 14px; font-weight: 500; color: #f7f4ef;">
                      ${escapedName}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #1a1612; font-family: ui-monospace, 'IBM Plex Mono', monospace; font-size: 11px; color: #9e9488; text-transform: uppercase;">
                      Email Address
                    </td>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #1a1612; font-size: 14px;">
                      <a href="mailto:${escapedEmail}" style="color: #ffb443; text-decoration: none; font-weight: 500;">${escapedEmail}</a>
                    </td>
                  </tr>
                  ${
                    escapedMobile
                      ? `<tr>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #1a1612; font-family: ui-monospace, 'IBM Plex Mono', monospace; font-size: 11px; color: #9e9488; text-transform: uppercase;">
                      Mobile Number
                    </td>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #1a1612; font-size: 14px; color: #f7f4ef;">
                      <a href="tel:${escapedMobile}" style="color: #f7f4ef; text-decoration: none;">${escapedMobile}</a>
                    </td>
                  </tr>`
                      : ''
                  }
                  ${
                    escapedCompany
                      ? `<tr>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #1a1612; font-family: ui-monospace, 'IBM Plex Mono', monospace; font-size: 11px; color: #9e9488; text-transform: uppercase;">
                      Company
                    </td>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #1a1612; font-size: 14px; color: #f7f4ef;">
                      ${escapedCompany}
                    </td>
                  </tr>`
                      : ''
                  }
                  ${
                    escapedInterest
                      ? `<tr>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #1a1612; font-family: ui-monospace, 'IBM Plex Mono', monospace; font-size: 11px; color: #9e9488; text-transform: uppercase;">
                      Primary Interest
                    </td>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #1a1612; font-size: 14px; color: #ffb443;">
                      ${escapedInterest}
                    </td>
                  </tr>`
                      : ''
                  }
                  ${
                    escapedBackground
                      ? `<tr>
                    <td style="padding: 12px 16px; font-family: ui-monospace, 'IBM Plex Mono', monospace; font-size: 11px; color: #9e9488; text-transform: uppercase;">
                      Background
                    </td>
                    <td style="padding: 12px 16px; font-size: 14px; color: #f7f4ef;">
                      ${escapedBackground}
                    </td>
                  </tr>`
                      : ''
                  }
                </table>
              </div>

              <!-- Message Content Box -->
              <div style="margin-bottom: 28px;">
                <div style="font-family: ui-monospace, 'IBM Plex Mono', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: #ffb443; margin-bottom: 12px;">
                  Message / Project Goals
                </div>
                <div style="padding: 20px; background-color: #050403; border: 1px solid #221c16; border-radius: 6px; font-size: 14px; line-height: 1.7; color: #e8e2d8; white-space: pre-wrap; word-break: break-word;">${escapedMessage}</div>
              </div>

              <!-- Quick Action Button -->
              <div style="text-align: center; margin-top: 32px;">
                <a href="mailto:${escapedEmail}?subject=Re:%20${encodeURIComponent(data.subject)}" style="display: inline-block; padding: 12px 28px; background: linear-gradient(90deg, #ff3b1e 0%, #ff7a18 100%); color: #050403; font-weight: 600; font-size: 13px; text-decoration: none; border-radius: 4px; letter-spacing: 0.05em; text-transform: uppercase; box-shadow: 0 4px 14px rgba(255, 59, 30, 0.35);">
                  Reply to ${escapedName}
                </a>
              </div>

            </td>
          </tr>

          <!-- Metadata & Footer Section -->
          <tr>
            <td style="padding: 24px 36px; background-color: #070605; border-top: 1px solid #1a1612;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-family: ui-monospace, 'IBM Plex Mono', monospace; font-size: 10px; color: #6f675d; line-height: 1.6;">
                    <strong>Submitted:</strong> ${escapedDate}<br>
                    ${escapedIp ? `<strong>Client IP:</strong> ${escapedIp}<br>` : ''}
                    <strong>Reply-To:</strong> ${escapedEmail}
                  </td>
                  <td align="right" valign="bottom" style="font-family: ui-monospace, 'IBM Plex Mono', monospace; font-size: 10px; color: #6f675d;">
                    Ignis AI Labs © ${new Date().getFullYear()}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Plain text fallback template
function generatePlainTextEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  mobile?: string;
  company?: string;
  primaryInterest?: string;
  background?: string;
  submittedAtFormatted: string;
  clientIp?: string;
}): string {
  const lines: (string | null)[] = [
    '==================================================',
    'IGNIS AI LABS - NEW WEBSITE ENQUIRY',
    '==================================================',
    '',
    `Subject: ${data.subject}`,
    `Submitted: ${data.submittedAtFormatted}`,
    data.clientIp ? `Client IP: ${data.clientIp}` : null,
    '',
    '--------------------------------------------------',
    'VISITOR INFORMATION',
    '--------------------------------------------------',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.mobile ? `Mobile: ${data.mobile}` : null,
    data.company ? `Company: ${data.company}` : null,
    data.primaryInterest ? `Primary Interest: ${data.primaryInterest}` : null,
    data.background ? `Background: ${data.background}` : null,
    '',
    '--------------------------------------------------',
    'MESSAGE / PROJECT GOALS',
    '--------------------------------------------------',
    data.message,
    '',
    '--------------------------------------------------',
    `Reply directly to this email to respond to ${data.name} (${data.email}).`,
    '==================================================',
  ];

  return lines.filter((line): line is string => line !== null).join('\n');
}

// Helper to retrieve secrets across Cloudflare Pages (locals.runtime.env) and Node/Vite (process.env / import.meta.env)
function getSecret(locals: App.Locals | unknown, key: string): string | undefined {
  const cfEnv = (locals as { runtime?: { env?: Record<string, string> } })?.runtime?.env;
  if (cfEnv && typeof cfEnv[key] === 'string' && cfEnv[key].trim()) {
    return cfEnv[key].trim();
  }

  const procEnv = typeof process !== 'undefined' ? process.env : undefined;
  if (procEnv && typeof procEnv[key] === 'string' && procEnv[key].trim()) {
    return procEnv[key].trim();
  }

  // @ts-ignore
  const metaEnv = typeof import.meta !== 'undefined' ? import.meta.env : undefined;
  if (metaEnv && typeof metaEnv[key] === 'string' && metaEnv[key].trim()) {
    return metaEnv[key].trim();
  }

  return undefined;
}

// OPTIONS handler for CORS preflight
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};

// POST handler for form submission
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // 1. Enforce payload size limit
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
      return new Response(
        JSON.stringify({ error: 'Payload too large. Maximum size is 64KB.' }),
        { status: 413, headers: corsHeaders }
      );
    }

    // 2. Read request body safely
    let rawBody = '';
    try {
      rawBody = await request.text();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Failed to read request body.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (rawBody.length > MAX_BODY_BYTES) {
      return new Response(
        JSON.stringify({ error: 'Payload too large. Maximum size is 64KB.' }),
        { status: 413, headers: corsHeaders }
      );
    }

    // 3. Parse JSON safely
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawBody);
    } catch {
      return new Response(
        JSON.stringify({ error: 'Malformed JSON payload. Please send valid JSON.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 4. Rate limiting based on client IP
    const clientIp =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Too many submissions. Please wait before submitting again.',
          retryAfter: rateLimit.retryAfter,
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Retry-After': String(rateLimit.retryAfter || 60),
          },
        }
      );
    }

    // 5. Honeypot spam trap
    const normalized = normalizePayload(parsedJson);
    if (typeof normalized.website === 'string' && normalized.website.trim().length > 0) {
      // Honeypot triggered
      return new Response(
        JSON.stringify({ error: 'Invalid submission.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 6. Validate with Zod
    const validationResult = contactFormSchema.safeParse(normalized);
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      const firstError =
        validationResult.error.issues[0]?.message || 'Invalid form submission';
      return new Response(
        JSON.stringify({
          error: firstError,
          details: fieldErrors,
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    const validatedData = validationResult.data;

    // 7. Retrieve server secrets
    const resendApiKey = getSecret(locals, 'RESEND_API_KEY');
    const contactEmail = getSecret(locals, 'CONTACT_EMAIL');
    const resendFromEmail = getSecret(locals, 'RESEND_FROM_EMAIL') || 'hello@ignisailabs.com';

    if (!resendApiKey) {
      console.error('[send-email] Missing RESEND_API_KEY environment variable.');
      return new Response(
        JSON.stringify({
          error: 'Email service configuration error: RESEND_API_KEY is missing.',
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    if (!contactEmail) {
      console.error('[send-email] Missing CONTACT_EMAIL environment variable.');
      return new Response(
        JSON.stringify({
          error: 'Destination email configuration error: CONTACT_EMAIL is missing.',
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    // 8. Format email details
    const submissionDate = validatedData.submittedAt
      ? new Date(validatedData.submittedAt)
      : new Date();

    const formattedDate = submissionDate.toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'long',
      timeZone: 'UTC',
    });

    const emailSubject = `New Website Enquiry - ${validatedData.subject}`;
    const formattedFrom = resendFromEmail.includes('<')
      ? resendFromEmail
      : `Ignis AI Labs <${resendFromEmail}>`;

    const htmlContent = generateBrandedEmailHtml({
      name: validatedData.name,
      email: validatedData.email,
      subject: validatedData.subject,
      message: validatedData.message,
      mobile: validatedData.mobile,
      company: validatedData.company,
      primaryInterest: validatedData.primaryInterest,
      background: validatedData.background,
      submittedAtFormatted: formattedDate,
      clientIp,
    });

    const textContent = generatePlainTextEmail({
      name: validatedData.name,
      email: validatedData.email,
      subject: validatedData.subject,
      message: validatedData.message,
      mobile: validatedData.mobile,
      company: validatedData.company,
      primaryInterest: validatedData.primaryInterest,
      background: validatedData.background,
      submittedAtFormatted: formattedDate,
      clientIp,
    });

    // 9. Send email using Resend SDK
    const resend = new Resend(resendApiKey);

    const { data, error } = await resend.emails.send({
      from: formattedFrom,
      to: [contactEmail],
      replyTo: validatedData.email,
      subject: emailSubject,
      html: htmlContent,
      text: textContent,
    });

    if (error) {
      console.error('[send-email] Resend API error:', error);
      return new Response(
        JSON.stringify({
          error: error.message || 'Failed to send notification via Resend.',
          code: error.name || 'RESEND_ERROR',
        }),
        { status: 502, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Enquiry submitted successfully.',
        id: data?.id,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('[send-email] Unhandled server error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      { status: 500, headers: corsHeaders }
    );
  }
};

// Catch-all for non-POST/OPTIONS methods to enforce HTTP 405 Method Not Allowed
export const ALL: APIRoute = async ({ request }) => {
  return new Response(
    JSON.stringify({ error: `Method ${request.method} Not Allowed` }),
    {
      status: 405,
      headers: {
        ...corsHeaders,
        Allow: 'POST, OPTIONS',
      },
    }
  );
};
