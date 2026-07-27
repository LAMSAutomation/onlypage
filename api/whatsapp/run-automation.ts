import { isValidAutomationSecret, runNewLeadFollowUps } from '../_lib/whatsapp';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!isValidAutomationSecret(req.headers?.['x-automation-secret'])) {
    return res.status(401).json({ error: 'Invalid automation secret.' });
  }
  try {
    const result = await runNewLeadFollowUps();
    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error('Automatic WhatsApp follow-ups failed', error);
    return res.status(500).json({ error: 'Automatic WhatsApp follow-ups failed.' });
  }
}
