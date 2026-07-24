export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { category, tag, products } = req.body;

  const list = Array.isArray(products) ? products : [];
  let filtered = list;

  if (category && category !== "All") {
    filtered = filtered.filter((p: any) => p.category?.toLowerCase() === category.toLowerCase());
  }

  if (tag && tag !== "All") {
    filtered = filtered.filter((p: any) =>
      Array.isArray(p.tags) ? p.tags.some((t: string) => t.toLowerCase() === tag.toLowerCase()) : p.offer_badge === tag
    );
  }

  return res.json({
    success: true,
    total: filtered.length,
    category: category || "All",
    tag: tag || "All",
    products: filtered,
  });
}
