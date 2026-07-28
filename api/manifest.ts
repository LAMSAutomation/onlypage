import { supabase } from "@/lib/supabase";

export default async function handler(req: any, res: any) {
  const { subdomain, site_id } = req.query;

  let name = "OnlyPage App";
  let shortName = "OnlyPage";
  let themeColor = "#6366f1";
  let iconUrl = "https://onlypage.in/favicon.ico";

  if (subdomain || site_id) {
    try {
      let query = supabase.from("sites").select("subdomain, business_name, theme");
      if (subdomain) query = query.eq("subdomain", subdomain);
      if (site_id) query = query.eq("id", site_id);

      const { data: siteData } = await query.single();
      if (siteData) {
        name = siteData.business_name || name;
        shortName = siteData.subdomain || shortName;
        themeColor = siteData.theme?.themeColor || themeColor;
        iconUrl = siteData.theme?.faviconUrl || iconUrl;
      }
    } catch (e) {
      console.error("Manifest error:", e);
    }
  }

  const manifest = {
    name: name,
    short_name: shortName,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: themeColor,
    icons: [
      {
        src: iconUrl,
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: iconUrl,
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate");
  return res.status(200).json(manifest);
}
