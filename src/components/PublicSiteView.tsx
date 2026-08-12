import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { fetchPublicProducts } from "@/lib/ecom-queries";
import { BuilderRenderer } from "@/components/builder-renderer";
import { ArrowRight, Globe, Loader2, Sparkles } from "lucide-react";
import type { WebBlock } from '@/components/builder-types';

interface PublicSiteViewProps {
  subdomain: string;
}

const mapBlock = (row: any): WebBlock => ({
  id: row.id,
  type: row.type,
  ...(row.config || {}),
});

const cleanSlug = (value?: string) =>
  String(value || "home")
    .replace(/^\/+|\/+$/g, "")
    .trim() || "home";

export default function PublicSiteView({ subdomain }: PublicSiteViewProps) {
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [site, setSite] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<WebBlock[]>([]);
  const [globalHeader, setGlobalHeader] = useState<WebBlock | null>(null);
  const [globalFooter, setGlobalFooter] = useState<WebBlock | null>(null);
  const [ecomProducts, setEcomProducts] = useState<any[]>([]);
  const [notFound, setNotFound] = useState(false);

  const loadPage = async (page: any, siteRecord = site) => {
    if (!page) return;
    setPageLoading(true);
    try {
      const { data, error } = await supabase
        .from("blocks")
        .select("*")
        .eq("page_id", page.id)
        .order("position", { ascending: true });
      if (error) throw error;
      setBlocks(
        (data || [])
          .filter((row) => row.type !== "Navigation" && row.type !== "Footer")
          .map(mapBlock),
      );
      setActivePageId(page.id);
      document.title =
        page.seo_title || `${page.name} | ${siteRecord?.business_name || "OnlyPage"}`;
      const description = page.seo_desc || `Explore ${page.name} at ${siteRecord?.business_name || "this website"}.`;
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute("content", description);
    } finally {
      setPageLoading(false);
    }
  };

  const navigateToPage = async (slug: string, pushHistory = true) => {
    const targetSlug = cleanSlug(slug);
    const target = pages.find((page) => cleanSlug(page.slug) === targetSlug);
    if (!target) return;
    if (pushHistory) {
      const path = targetSlug === "home" ? "/" : `/${targetSlug}`;
      window.history.pushState({ pageId: target.id }, "", path);
    }
    await loadPage(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    let cancelled = false;
    let popStateHandler: (() => void) | null = null;

    async function loadPublicSite() {
      setLoading(true);
      setNotFound(false);
      try {
        const { data: siteData, error: siteError } = await supabase
          .from("sites")
          .select("*")
          .ilike("subdomain", subdomain.trim())
          .eq("published", true)
          .maybeSingle();
        if (siteError || !siteData) throw siteError || new Error("Site not found");

        const { data: pagesData, error: pagesError } = await supabase
          .from("pages")
          .select("*")
          .eq("site_id", siteData.id)
          .order("position", { ascending: true });
        if (pagesError || !pagesData?.length) {
          throw pagesError || new Error("No published pages found");
        }
        if (cancelled) return;

        setSite(siteData);
        setPages(pagesData);
        // Current editor keys first, then legacy aliases for older sites.
        setGlobalHeader(siteData.theme?.globalHeader || siteData.theme?.header || null);
        setGlobalFooter(siteData.theme?.globalFooter || siteData.theme?.footer || null);

        const products = await fetchPublicProducts(siteData.id);
        if (!cancelled) {
          setEcomProducts(
            products.map((product: any) => ({
              id: product.id,
              title: product.title,
              description: product.description || "",
              price: String(product.price || 0),
              compare_at: product.compare_at_price ? String(product.compare_at_price) : "",
              stock: product.stock,
              category: product.category || "General",
              tags: product.tags || [],
              offer_badge: product.offer_badge || "",
              status: "Active",
              image: product.images?.[0]?.url || "",
            })),
          );
        }

        const pathSlug = cleanSlug(window.location.pathname);
        const requested = pagesData.find((page) => cleanSlug(page.slug) === pathSlug);
        const home =
          pagesData.find((page) => cleanSlug(page.slug) === "home") || pagesData[0];
        const initialPage = requested || home;
        if (!requested && pathSlug !== "home") {
          window.history.replaceState({ pageId: home.id }, "", "/");
        }
        await loadPage(initialPage, siteData);

        popStateHandler = () => {
          const nextSlug = cleanSlug(window.location.pathname);
          const nextPage =
            pagesData.find((page) => cleanSlug(page.slug) === nextSlug) || home;
          void loadPage(nextPage, siteData);
        };
        window.addEventListener("popstate", popStateHandler);
      } catch (error) {
        console.error("Error loading public site:", error);
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (subdomain) void loadPublicSite();
    return () => {
      cancelled = true;
      if (popStateHandler) window.removeEventListener("popstate", popStateHandler);
    };
  }, [subdomain]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-3 bg-[#f7f7f4] font-sans text-slate-800">
        <Loader2 size={28} className="animate-spin text-[#008060]" />
        <p className="text-xs font-bold tracking-wide text-slate-500">Loading website…</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#18201d] p-6 text-center font-sans text-white">
        <div className="mb-6 flex size-16 items-center justify-center rounded-2xl border border-[#bef264]/20 bg-[#bef264]/10 text-[#bef264] shadow-xl">
          <Globe size={32} />
        </div>
        <h1 className="max-w-md text-2xl font-black tracking-tight text-white sm:text-3xl">
          <span className="text-[#bef264]">{subdomain}.onlypage.in</span> is not live yet.
        </h1>
        <p className="mt-3 max-w-md text-xs font-medium leading-relaxed text-slate-400 sm:text-sm">
          This address has not been published. Create an OnlyPage account to build your own multi-page website.
        </p>
        <a href="https://onlypage.in" className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-[#bef264] px-6 py-3 text-xs font-extrabold tracking-wide text-[#18201d] shadow-lg transition hover:bg-[#a3e635]">
          <span>Create your OnlyPage</span>
          <ArrowRight size={14} />
        </a>
      </div>
    );
  }

  const rendererProps = {
    isActive: false,
    onSelect: () => {},
    siteId: site.id,
    pages,
    onNavigatePage: (slug: string) => void navigateToPage(slug),
    site,
    activePageId,
    ecomProducts,
  };

  return (
    <div className="@container min-h-screen font-sans text-slate-900 selection:bg-[#bef264] selection:text-[#18201d]">
      {globalHeader && (
        <header data-global-part="header">
          <BuilderRenderer block={globalHeader} {...rendererProps} />
        </header>
      )}

      <main aria-busy={pageLoading} className={pageLoading ? "opacity-80 transition-opacity" : "transition-opacity"}>
        {blocks.length === 0 ? (
          <div className="py-24 text-center text-sm font-medium text-slate-400">No content has been added to this page yet.</div>
        ) : (
          blocks.map((block) => (
            <div key={block.id} id={block.id} data-block-type={block.type}>
              <BuilderRenderer block={block} {...rendererProps} />
            </div>
          ))
        )}
      </main>

      {globalFooter && (
        <footer data-global-part="footer">
          <BuilderRenderer block={globalFooter} {...rendererProps} />
        </footer>
      )}

      <div className="border-t border-slate-800 bg-[#18201d] py-4 text-center">
        <a href="https://onlypage.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 transition hover:text-[#bef264]">
          <Sparkles size={12} className="text-[#bef264]" />
          <span>Powered by <strong className="text-white">OnlyPage</strong></span>
        </a>
      </div>
    </div>
  );
}
