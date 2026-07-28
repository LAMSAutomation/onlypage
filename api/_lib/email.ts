// Transactional email sender. Uses Resend's HTTP API so no extra npm dependency
// is required and the API key never reaches the browser. Mirrors the graceful
// degradation pattern in ./whatsapp.ts: when the provider is not configured the
// caller is told honestly (dispatched: false) instead of pretending success.

type EmailConfig = {
  apiKey: string;
  fromAddress: string;
};

export type SendEmailInput = {
  to: string;
  subject: string;
  /** Plain-text body. Newlines are converted to <br> for the HTML part. */
  text: string;
  replyTo?: string;
};

export type SendEmailResult =
  | { dispatched: true; provider_message_id: string | null; reason?: undefined }
  | { dispatched: false; reason: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (value: unknown): value is string =>
  typeof value === 'string' && EMAIL_RE.test(value.trim());

export const getEmailConfig = (): EmailConfig | null => {
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.EMAIL_FROM_ADDRESS;
  if (!apiKey || !fromAddress) return null;
  return { apiKey, fromAddress };
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const to = input.to?.trim();
  const subject = input.subject?.trim();
  const text = typeof input.text === 'string' ? input.text : '';

  if (!isValidEmail(to)) return { dispatched: false, reason: 'A valid recipient email address is required.' };
  if (!subject) return { dispatched: false, reason: 'An email subject is required.' };

  const config = getEmailConfig();
  if (!config) return { dispatched: false, reason: 'Email provider (RESEND_API_KEY) is not configured on this deployment.' };

  const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.6;color:#0f172a">${escapeHtml(text).replace(/\n/g, '<br>')}</div>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.apiKey}` },
      body: JSON.stringify({
        from: config.fromAddress,
        to: [to],
        subject,
        text,
        html,
        ...(input.replyTo && isValidEmail(input.replyTo) ? { reply_to: input.replyTo } : {}),
      }),
    });
    const payload = await response.json().catch(() => ({} as Record<string, unknown>));
    if (!response.ok) {
      const detail = typeof (payload as any)?.message === 'string' ? (payload as any).message : `Resend API returned ${response.status}.`;
      return { dispatched: false, reason: detail.slice(0, 500) };
    }
    const messageId = typeof (payload as any)?.id === 'string' ? (payload as any).id : null;
    return { dispatched: true, provider_message_id: messageId };
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Email provider request failed.';
    return { dispatched: false, reason: detail.slice(0, 500) };
  }
}
