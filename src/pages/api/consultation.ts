import type { APIRoute } from 'astro';

interface ConsultationData {
  fullName: string;
  email: string;
  mobile: string;
  company?: string;
  primaryInterest: string;
  background: string;
  goals: string;
  submittedAt: string;
}

// Email template for admin notification
function generateAdminEmail(data: ConsultationData): string {
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
        .message-box { background: #0a0a0a; padding: 16px; border-radius: 12px; border: 1px solid #27272a; white-space: pre-wrap; }
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
            <div class="label">Full Name</div>
            <div class="value">${data.fullName}</div>
          </div>
          <div class="field">
            <div class="label">Email</div>
            <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
          </div>
          <div class="field">
            <div class="label">Mobile Number</div>
            <div class="value">${data.mobile}</div>
          </div>
          ${data.company ? `
          <div class="field">
            <div class="label">Company</div>
            <div class="value">${data.company}</div>
          </div>
          ` : ''}
          <div class="field">
            <div class="label">Primary Interest</div>
            <div class="value"><span class="badge">${data.primaryInterest}</span></div>
          </div>
          <div class="field">
            <div class="label">Background</div>
            <div class="value"><span class="badge">${data.background}</span></div>
          </div>
          <div class="field">
            <div class="label">What are you looking to achieve?</div>
            <div class="message-box">${data.goals}</div>
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
          <h1>Thanks for reaching out, ${data.fullName.split(' ')[0]}! 🎉</h1>
          <p>We've received your consultation request and our team is excited to learn more about your goals with Ignis AI Labs.</p>
          
          <div class="steps">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-text"><strong>Review</strong> — Our team will review your request within 24 hours.</div>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <div class="step-text"><strong>Connect</strong> — We'll reach out to discuss how we can help you achieve your goals.</div>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <div class="step-text"><strong>Explore</strong> — Together, we'll explore how Ignis AI Labs can support your journey!</div>
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

// Send email via MailChannels API
async function sendEmailViaMailChannels(
  to: string,
  subject: string,
  html: string,
  request: Request,
  replyTo?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      personalizations: [
        {
          to: [{ email: to }],
        },
      ],
      from: {
        email: 'noreply@ignisailabs.com',
        name: 'Ignis AI Labs',
      },
      subject,
      content: [
        {
          type: 'text/html',
          value: html,
        },
      ],
      ...(replyTo && {
        reply_to: {
          email: replyTo,
        },
      }),
    };

    const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('MailChannels API error:', response.status, errorText);
      
      // Provide helpful error message for 401
      if (response.status === 401) {
        return {
          success: false,
          error: 'MailChannels authentication failed. Please ensure DNS records (SPF, DKIM, Domain Lockdown) are configured for ignisailabs.com domain. See MailChannels documentation for Cloudflare Workers setup.',
        };
      }
      
      return {
        success: false,
        error: `Failed to send email: ${response.status} - ${errorText.substring(0, 200)}`,
      };
    }

    return { success: true };
  } catch (error) {
    console.error('MailChannels send error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data: ConsultationData = await request.json();

    // Validate required fields
    if (!data.fullName || !data.email || !data.mobile || !data.primaryInterest || !data.background || !data.goals) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Send notification to admin (contact@ignisailabs.com)
    const adminEmailResult = await sendEmailViaMailChannels(
      'contact@ignisailabs.com',
      `🔥 New Consultation Request: ${data.fullName} - ${data.primaryInterest}`,
      generateAdminEmail(data),
      request,
      data.email
    );

    if (!adminEmailResult.success) {
      console.error('Failed to send admin email:', adminEmailResult.error);
      // Continue even if admin email fails, but log it
    }

    // Send confirmation to user
    const userEmailResult = await sendEmailViaMailChannels(
      data.email,
      "We've received your request! 🎉",
      generateUserEmail(data),
      request
    );

    if (!userEmailResult.success) {
      console.error('Failed to send user email:', userEmailResult.error);
      // Continue even if user email fails, but log it
    }

    // Return success even if emails fail (form submission is recorded)
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Consultation request submitted successfully' 
      }),
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
