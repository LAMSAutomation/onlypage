// Vercel Custom Domain Connection Endpoint
// Automatically attaches a customer's custom domain to your Vercel project via Vercel REST API

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { domain, site_id } = req.body;

  if (!domain) {
    return res.status(400).json({ error: 'Domain name is required' });
  }

  const cleanDomain = domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const vercelToken = process.env.VERCEL_AUTH_TOKEN;
  const vercelProjectId = process.env.VERCEL_PROJECT_ID || process.env.VERCEL_PROJECT_NAME;

  // If Vercel credentials are set, call Vercel API
  if (vercelToken && vercelProjectId) {
    try {
      const vercelRes = await fetch(`https://api.vercel.com/v10/projects/${vercelProjectId}/domains`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${vercelToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: cleanDomain })
      });

      const vercelData = await vercelRes.json();
      
      if (vercelRes.ok || vercelData.error?.code === 'domain_already_in_use') {
        return res.status(200).json({
          success: true,
          domain: cleanDomain,
          dnsRecords: {
            aRecord: { type: 'A', name: '@', value: '76.76.21.21' },
            cnameRecord: { type: 'CNAME', name: 'www', value: 'cname.vercel-dns.com' }
          },
          status: 'pending_dns'
        });
      }

      return res.status(400).json({ error: vercelData.error?.message || 'Failed to attach domain on Vercel' });
    } catch (e: any) {
      console.error('Vercel domain attach error:', e);
    }
  }

  // Fallback return DNS instructions if Vercel token not yet provided in env
  return res.status(200).json({
    success: true,
    domain: cleanDomain,
    dnsRecords: {
      aRecord: { type: 'A', name: '@', value: '76.76.21.21' },
      cnameRecord: { type: 'CNAME', name: 'www', value: 'cname.vercel-dns.com' }
    },
    status: 'pending_dns',
    note: 'Add VERCEL_AUTH_TOKEN and VERCEL_PROJECT_ID to .env for automated 1-click Vercel domain provisioning.'
  });
}
