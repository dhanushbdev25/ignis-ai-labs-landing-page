import type { APIRoute } from 'astro';
import { Resend } from 'resend';

interface ConsultationData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType: string;
  budget?: string;
  message: string;
  preferredPlan?: string;
  submittedAt: string;
}

// Email template for admin notification
function generateAdminEmail(data: ConsultationData): string {
  const budgetLabels: Record<string, string> = {
    'under-5k': 'Under $5,000',
    '5k-10k': '$5,000 - $10,000',
    '10k-25k': '$10,000 - $25,000',
    '25k-50k': '$25,000 - $50,000',
    '50k-plus': '$50,000+',
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #0a0a0a; color: #fff; margin: 0; padding: 40px; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #7c3aed, #2563eb); padding: 30px; border-radius: 16px 16px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: #141414; padding: 30px; border-radius: 0 0 16px 16px; border: 1px solid #27272a; border-top: none; }
        .field { margin-bottom: 20px; }
        .label { color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
        .value { color: #fff; font-size: 16px; }
        .badge { display: inline-block; background: rgba(124, 58, 237, 0.2); color: #7c3aed; padding: 4px 12px; border-radius: 20px; font-size: 14px; }
        .message-box { background: #0a0a0a; padding: 16px; border-radius: 12px; border: 1px solid #27272a; }
        a { color: #7c3aed; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔥 New Consultation Request</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Name</div>
            <div class="value">${data.name}</div>
          </div>
          <div class="field">
            <div class="label">Email</div>
            <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
          </div>
          ${data.company ? `
          <div class="field">
            <div class="label">Company</div>
            <div class="value">${data.company}</div>
          </div>
          ` : ''}
          ${data.phone ? `
          <div class="field">
            <div class="label">Phone</div>
            <div class="value">${data.phone}</div>
          </div>
          ` : ''}
          <div class="field">
            <div class="label">Project Type</div>
            <div class="value"><span class="badge">${data.projectType.replace('-', ' ')}</span></div>
          </div>
          ${data.budget ? `
          <div class="field">
            <div class="label">Budget</div>
            <div class="value">${budgetLabels[data.budget] || data.budget}</div>
          </div>
          ` : ''}
          ${data.preferredPlan ? `
          <div class="field">
            <div class="label">Preferred Plan</div>
            <div class="value" style="text-transform: capitalize;">${data.preferredPlan}</div>
          </div>
          ` : ''}
          <div class="field">
            <div class="label">Message</div>
            <div class="message-box">${data.message}</div>
          </div>
          <div class="field">
            <div class="label">Submitted At</div>
            <div class="value">${new Date(data.submittedAt).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Email template for user confirmation
function generateUserEmail(data: ConsultationData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #0a0a0a; color: #fff; margin: 0; padding: 40px; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { text-align: center; padding: 40px 0; }
        .logo { font-size: 28px; font-weight: bold; }
        .logo span { background: linear-gradient(135deg, #7c3aed, #2563eb); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .content { background: #141414; padding: 40px; border-radius: 20px; text-align: center; border: 1px solid #27272a; }
        .content h1 { margin: 0 0 10px; font-size: 28px; }
        .content p { color: #a1a1aa; line-height: 1.6; margin: 0 0 20px; }
        .steps { text-align: left; margin: 30px 0; }
        .step { display: flex; align-items: flex-start; margin-bottom: 20px; }
        .step-number { background: linear-gradient(135deg, #7c3aed, #2563eb); color: #fff; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; margin-right: 16px; flex-shrink: 0; }
        .step-text { color: #d4d4d8; }
        .step-text strong { color: #fff; }
        .cta { display: inline-block; background: linear-gradient(135deg, #7c3aed, #2563eb); color: #fff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; margin-top: 20px; }
        .footer { text-align: center; color: #52525b; font-size: 12px; margin-top: 40px; }
        .footer a { color: #7c3aed; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Ignis AI Labs<span>.</span></div>
        </div>
        <div class="content">
          <h1>Thanks for reaching out, ${data.name.split(' ')[0]}! 🎉</h1>
          <p>We've received your consultation request and our team is excited to learn more about your project.</p>
          
          <div class="steps">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-text"><strong>Review</strong> — Our team will review your project details within 24 hours.</div>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <div class="step-text"><strong>Connect</strong> — We'll reach out to schedule a discovery call.</div>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <div class="step-text"><strong>Create</strong> — Once aligned, we'll start bringing your vision to life!</div>
            </div>
          </div>
          
          <p style="font-size: 14px;">In the meantime, check out our recent work:</p>
          <a href="https://ignisailabs.com/#projects" class="cta">View Our Projects</a>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Ignis AI Labs. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const data: ConsultationData = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get Resend API key from environment
    // @ts-ignore - Cloudflare runtime environment
    const env = locals.runtime?.env || import.meta.env;
    const resendApiKey = env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.log('Consultation submission (no email configured):', data);
      return new Response(
        JSON.stringify({ success: true, message: 'Submission received (email not configured)' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(resendApiKey);

    // Send notification to admin
    const adminEmail = await resend.emails.send({
      from: 'Ignis AI Labs <notifications@ignisailabs.com>',
      to: ['team@ignisailabs.com'],
      replyTo: data.email,
      subject: `🔥 New Consultation: ${data.name} - ${data.projectType.replace('-', ' ')}`,
      html: generateAdminEmail(data),
    });

    if (adminEmail.error) {
      console.error('Failed to send admin email:', adminEmail.error);
    }

    // Send confirmation to user
    const userEmail = await resend.emails.send({
      from: 'Ignis AI Labs <hello@ignisailabs.com>',
      to: [data.email],
      subject: "We've received your request! 🎉",
      html: generateUserEmail(data),
    });

    if (userEmail.error) {
      console.error('Failed to send user email:', userEmail.error);
    }

    return new Response(
      JSON.stringify({ success: true, messageId: adminEmail.data?.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Consultation API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Prerender this as false since it's an API route
export const prerender = false;
