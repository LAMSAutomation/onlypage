import { supabase } from "@/lib/supabase";

export default async function handler(req: any, res: any) {
  const { subdomain, site_id } = req.query;

  let siteUrl = "https://onlypage.in";
  let pages: any[] = [];

  if (subdomain || site_id) {
    try {
      let query = supabase.from("sites").select("id, subdomain, business_name, updated_at");
      if (subdomain) query = query.eq("subdomain", subdomain);
      if (site_id) query = query.eq("id", site_id);

      const { data: siteData } = await query.single();
      if (siteData) {
        siteUrl = `https://${siteData.subdomain}.onlypage.in`;
        const { data: pageData } = await supabase
          .from("pages")
          .select("slug, updated_at")
          .eq("site_id", siteData.id);
        pages = pageData || [];
      }
    } catch (e) {
      console.error("Sitemap fetch error:", e);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

  pages.forEach((p) => {
    if (p.slug && p.slug !== "/") {
      const formattedSlug = p.slug.startsWith("/") ? p.slug : "/" + p.slug;
      xml += `
  <url>
    <loc>${siteUrl}${formattedSlug}</loc>
    <lastmod>${p.updated_at ? p.updated_at.split("T")[0] : today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }
  });

  xml += `
</urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate");
  return res.status(200).send(xml);
}
