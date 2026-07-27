import { processRazorpayWebhook, verifyRazorpaySignature } from '../_lib/payments';

export const config = { api: { bodyParser: false } };

const readRawBody = async (req: any) => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const rawBody = await readRawBody(req);
    const signature = req.headers['x-razorpay-signature'];
    if (!verifyRazorpaySignature(rawBody, typeof signature === 'string' ? signature : undefined)) {
      return res.status(401).json({ error: 'Invalid webhook signature.' });
    }
    const result = await processRazorpayWebhook(JSON.parse(rawBody));
    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error('Razorpay webhook failed', error);
    return res.status(400).json({ error: 'Invalid webhook payload.' });
  }
}
