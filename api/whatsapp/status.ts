import { getWhatsAppConnection } from '../_lib/whatsapp';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const siteId = Array.isArray(req.query?.site_id) ? req.query.site_id[0] : req.query?.site_id;
    const result = await getWhatsAppConnection(siteId, req.headers?.authorization);
    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error('WhatsApp connection status failed', error);
    return res.status(500).json({ error: 'Could not check the WhatsApp connection.' });
  }
}
