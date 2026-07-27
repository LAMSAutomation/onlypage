import { createPaymentOrder } from '../_lib/payments';

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const result = await createPaymentOrder(req.body);
    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error('Payment order creation failed', error);
    return res.status(500).json({ error: 'Could not prepare checkout. Please try again.' });
  }
}
