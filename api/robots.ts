export default async function handler(req: any, res: any) {
  const { subdomain } = req.query;
  const siteUrl = subdomain ? `https://${subdomain}.onlypage.in` : "https://onlypage.in";

  const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: ${siteUrl}/api/sitemap?subdomain=${subdomain || ''}
`;

  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate");
  return res.status(200).send(robots);
}
