import { sendLeadFollowUp } from '../_lib/whatsapp';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const result = await sendLeadFollowUp(req.body, req.headers?.authorization);
    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error('WhatsApp follow-up failed', error);
    return res.status(500).json({ error: 'Could not prepare the WhatsApp follow-up.' });
  }
}
