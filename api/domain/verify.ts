// Vercel Custom Domain Verification Endpoint
// Checks DNS propagation and SSL status of a custom domain via Vercel REST API

export default async function handler(req: any, res: any) {
  const { domain } = req.query;

  if (!domain) {
    return res.status(400).json({ error: 'Domain parameter is required' });
  }

  const cleanDomain = String(domain).toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const vercelToken = process.env.VERCEL_AUTH_TOKEN;
  const vercelProjectId = process.env.VERCEL_PROJECT_ID || process.env.VERCEL_PROJECT_NAME;

  if (vercelToken && vercelProjectId) {
    try {
      const vercelRes = await fetch(`https://api.vercel.com/v9/projects/${vercelProjectId}/domains/${cleanDomain}/verify`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${vercelToken}`,
          'Content-Type': 'application/json'
        }
      });

      const vercelData = await vercelRes.json();
      const isVerified = vercelData.verified === true;

      return res.status(200).json({
        domain: cleanDomain,
        verified: isVerified,
        status: isVerified ? 'active' : 'pending_dns',
        message: isVerified ? 'Domain and SSL certificate are active!' : 'Waiting for DNS propagation...'
      });
    } catch (e) {
      console.error('Vercel domain verify error:', e);
    }
  }

  return res.status(200).json({
    domain: cleanDomain,
    verified: false,
    status: 'pending_dns',
    message: 'Add VERCEL_AUTH_TOKEN & VERCEL_PROJECT_ID to .env for real-time verification.'
  });
}
