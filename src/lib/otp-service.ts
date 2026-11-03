import crypto from 'crypto';

const OTP_SECRET = process.env.OTP_SECRET || process.env.JWT_SECRET || 'toyzz-secure-otp-salt-key-2026';
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const OTP_RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
export const MAX_OTP_ATTEMPTS = 5;

/**
 * Generate a cryptographically secure 6-digit OTP string.
 */
export function generateOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Hash the OTP using HMAC-SHA256 with the secret key.
 * Plain text OTPs are never stored in the database.
 */
export function hashOtp(otp: string): string {
  return crypto.createHmac('sha256', OTP_SECRET).update(otp.trim()).digest('hex');
}

/**
 * Constant-time comparison between entered OTP and stored hash.
 */
export function verifyOtpHash(enteredOtp: string, storedHash: string): boolean {
  const enteredHash = hashOtp(enteredOtp);
  if (enteredHash.length !== storedHash.length) return false;
  return crypto.timingSafeEqual(Buffer.from(enteredHash), Buffer.from(storedHash));
}

/**
 * Mask an email or phone number for user-facing display.
 * e.g., 'rohit@example.com' -> 'r***t@example.com'
 * e.g., '+919876543210' -> '+91 98*** ***10'
 */
export function maskIdentifier(identifier: string, type: 'email' | 'phone'): string {
  if (type === 'email') {
    const parts = identifier.split('@');
    if (parts.length !== 2) return identifier;
    const [name, domain] = parts;
    if (name.length <= 2) {
      return `${name[0]}*@${domain}`;
    }
    const maskedName = `${name[0]}${'*'.repeat(Math.max(name.length - 2, 3))}${name[name.length - 1]}`;
    return `${maskedName}@${domain}`;
  } else {
    // Phone
    const digits = identifier.replace(/\D/g, '');
    if (digits.length < 10) return identifier;
    const last2 = digits.slice(-2);
    const first2 = digits.slice(0, Math.max(2, digits.length - 8));
    return `+${first2}******${last2}`;
  }
}

/**
 * Normalize an Indian phone number to standard E.164 (+91XXXXXXXXXX).
 */
export function normalizePhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.slice(2);
  }

  if (cleaned.length !== 10 || !/^\d{10}$/.test(cleaned)) {
    throw new Error('Please enter a valid 10-digit Indian mobile number');
  }

  return `+91${cleaned}`;
}

export function getOtpExpiryTime(): { expiresAt: number; resendAvailableAt: number } {
  const now = Date.now();
  return {
    expiresAt: now + OTP_EXPIRY_MS,
    resendAvailableAt: now + OTP_RESEND_COOLDOWN_MS,
  };
}

// =========================================================================
// DELIVERY DRIVERS (EMAIL & SMS)
// =========================================================================

export interface DeliveryResult {
  success: boolean;
  provider: string;
  messageId?: string;
  error?: string;
}

/**
 * Send OTP via Email using SMTP (Gmail), Brevo, or Resend API
 */
export async function sendEmailOtp(toEmail: string, otp: string, userName?: string): Promise<DeliveryResult> {
  const subject = `Your Toyzz Verification Code: ${otp}`;
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAFAFA; margin: 0; padding: 24px; color: #1E293B; }
          .container { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #F1F5F9; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #F59E0B 0%, #F43F5E 50%, #0EA5E9 100%); padding: 28px 24px; text-align: center; }
          .logo { font-size: 26px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px; }
          .tagline { color: rgba(255,255,255,0.9); font-size: 12px; margin-top: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
          .content { padding: 32px 24px; text-align: center; }
          h2 { font-size: 20px; font-weight: 800; color: #0F172A; margin: 0 0 12px 0; }
          p { font-size: 14px; color: #64748B; line-height: 1.6; margin: 0 0 24px 0; }
          .otp-card { background: #FEF3C7; border: 2px dashed #F59E0B; border-radius: 16px; padding: 20px; margin: 24px 0; text-align: center; }
          .otp-code { font-family: monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #B45309; }
          .expiry-note { font-size: 12px; color: #92400E; margin-top: 8px; font-weight: 600; }
          .security-note { font-size: 11px; color: #94A3B8; border-top: 1px solid #F1F5F9; padding-top: 20px; text-align: left; }
          .footer { background: #F8FAFC; padding: 16px 24px; text-align: center; font-size: 11px; color: #94A3B8; border-top: 1px solid #E2E8F0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">TOYZZ</div>
            <div class="tagline">Official Toy Store Verification</div>
          </div>
          <div class="content">
            <h2>Verify Your Account</h2>
            <p>Hello ${userName || 'Toyzz Customer'}, please use the 6-digit verification code below to verify your account registration.</p>
            <div class="otp-card">
              <div class="otp-code">${otp}</div>
              <div class="expiry-note">⏱ Code expires in 5 minutes</div>
            </div>
            <div class="security-note">
              <strong>Security Alert:</strong> Never share this OTP with anyone, including Toyzz staff. If you did not request this verification, please safely ignore this email.
            </div>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Toyzz Store. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;

  // 1. Live Gmail / Standard SMTP Driver (Sends to ANY customer email address with zero domain restrictions!)
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (smtpUser && smtpPass) {
    try {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '465', 10),
        secure: (process.env.SMTP_PORT || '465') === '465',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: `"${process.env.STORE_NAME || 'Toyzz Store'}" <${smtpUser}>`,
        to: toEmail,
        subject,
        html: htmlContent,
      });

      console.log(`[OTP] SMTP Email dispatched successfully to ${toEmail} (ID: ${info.messageId})`);
      return { success: true, provider: 'smtp', messageId: info.messageId };
    } catch (err: any) {
      console.error('[OTP] SMTP delivery error:', err);
      return { success: false, provider: 'smtp', error: err.message };
    }
  }

  // 2. Live Brevo REST API Driver (Free tier sends to ANY email without DNS verification)
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (brevoApiKey) {
    try {
      const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_FROM || 'toybloom4@gmail.com';
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'Toyzz Store', email: senderEmail },
          to: [{ email: toEmail, name: userName || 'Customer' }],
          subject,
          htmlContent,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(`[OTP] Brevo email dispatched to ${toEmail} (ID: ${data.messageId})`);
        return { success: true, provider: 'brevo', messageId: data.messageId };
      } else {
        console.error('[OTP] Brevo API error:', data);
        return { success: false, provider: 'brevo', error: data.message };
      }
    } catch (err: any) {
      console.error('[OTP] Brevo network error:', err);
      return { success: false, provider: 'brevo', error: err.message };
    }
  }

  // 3. Live Resend Provider
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'Toyzz Store <onboarding@resend.dev>';

  if (resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: toEmail,
          subject,
          html: htmlContent,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(`[OTP] Resend email dispatched to ${toEmail} (ID: ${data.id})`);
        return { success: true, provider: 'resend', messageId: data.id };
      } else {
        console.error('[OTP] Resend API error:', data);
        if (data.message && data.message.includes('You can only send testing emails to your own email address')) {
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log(`[RESEND DOMAIN NOTICE]`);
          console.log(`To send OTPs to arbitrary customer emails with Resend, verify your domain at resend.com/domains.`);
          console.log(`Or set SMTP_USER & SMTP_PASS (Gmail) in .env.local to send to anyone without domain verification.`);
          console.log(`Generated OTP for "${toEmail}": ${otp}`);
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        }
        return { success: false, provider: 'resend', error: data.message || 'Resend API failed' };
      }
    } catch (err: any) {
      console.error('[OTP] Resend network error:', err);
      return { success: false, provider: 'resend', error: err.message };
    }
  }

  // 2. Development / Setup Mode Notice (Logged securely to server console)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`[DEV OTP NOTIFICATION - EMAIL]`);
  console.log(`To: ${toEmail}`);
  console.log(`Verification Code: ${otp}`);
  console.log(`Expires: In 5 minutes`);
  console.log(`Notice: Configure RESEND_API_KEY in .env.local to dispatch live emails.`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  return { success: true, provider: 'console-development', messageId: `dev-email-${Date.now()}` };
}

/**
 * Send OTP via SMS (Twilio or MSG91)
 */
export async function sendSmsOtp(toPhone: string, otp: string): Promise<DeliveryResult> {
  const normalized = normalizePhoneNumber(toPhone);
  const smsBody = `<#> ${otp} is your verification code for Toyzz Store. Valid for 5 minutes. Do not share this code with anyone.`;

  // 1. Live Twilio Provider
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_PHONE_NUMBER;

  if (twilioSid && twilioAuth && twilioFrom) {
    try {
      const authHeader = Buffer.from(`${twilioSid}:${twilioAuth}`).toString('base64');
      const params = new URLSearchParams();
      params.append('To', normalized);
      params.append('From', twilioFrom);
      params.append('Body', smsBody);

      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const data = await res.json();
      if (res.ok) {
        console.log(`[OTP] Twilio SMS dispatched to ${normalized} (SID: ${data.sid})`);
        return { success: true, provider: 'twilio', messageId: data.sid };
      } else {
        console.error('[OTP] Twilio API error:', data);
        return { success: false, provider: 'twilio', error: data.message };
      }
    } catch (err: any) {
      console.error('[OTP] Twilio network error:', err);
      return { success: false, provider: 'twilio', error: err.message };
    }
  }

  // 2. Live MSG91 Provider (Popular India Gateway)
  const msg91Auth = process.env.MSG91_AUTH_KEY;
  const msg91Template = process.env.MSG91_TEMPLATE_ID;

  if (msg91Auth && msg91Template) {
    try {
      const cleanPhone = normalized.replace('+', '');
      const res = await fetch(`https://control.msg91.com/api/v5/otp?template_id=${msg91Template}&mobile=${cleanPhone}&authkey=${msg91Auth}&otp=${otp}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (data.type === 'success') {
        console.log(`[OTP] MSG91 SMS dispatched to ${cleanPhone}`);
        return { success: true, provider: 'msg91', messageId: data.request_id };
      } else {
        console.error('[OTP] MSG91 API error:', data);
        return { success: false, provider: 'msg91', error: data.message };
      }
    } catch (err: any) {
      console.error('[OTP] MSG91 network error:', err);
      return { success: false, provider: 'msg91', error: err.message };
    }
  }

  // 3. Development / Setup Mode Notice (Logged securely to server console)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`[DEV OTP NOTIFICATION - SMS]`);
  console.log(`To: ${normalized}`);
  console.log(`SMS Text: "${smsBody}"`);
  console.log(`Expires: In 5 minutes`);
  console.log(`Notice: Configure TWILIO or MSG91 in .env.local to dispatch live Indian SMS.`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  return { success: true, provider: 'console-development', messageId: `dev-sms-${Date.now()}` };
}

