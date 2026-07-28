import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BuilderRenderer } from '@/components/builder-renderer';
import { Loader2, Globe, ArrowRight, Sparkles } from 'lucide-react';
import type { WebBlock } from '@/components/website-builder-editor';

interface PublicSiteViewProps {
  subdomain: string;
}

export default function PublicSiteView({ subdomain }: PublicSiteViewProps) {
  const [loading, setLoading] = useState(true);
  const [site, setSite] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<WebBlock[]>([]);
  const [globalHeader, setGlobalHeader] = useState<WebBlock | null>(null);
  const [globalFooter, setGlobalFooter] = useState<WebBlock | null>(null);
  const [ecomProducts, setEcomProducts] = useState<any[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadPublicSite() {
      setLoading(true);
      setNotFound(false);

      try {
        // 1. Fetch site by subdomain (case-insensitive)
        const { data: siteData, error: siteError } = await supabase
          .from('sites')
          .select('*')
          .ilike('subdomain', subdomain.trim())
          .maybeSingle();

        if (siteError || !siteData) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setSite(siteData);

        // 2. Fetch pages for site
        const { data: pagesData, error: pagesError } = await supabase
          .from('pages')
          .select('*')
          .eq('site_id', siteData.id)
          .order('position', { ascending: true });

        if (pagesError || !pagesData || pagesData.length === 0) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setPages(pagesData);

        // Check path slug or default to home page
        const pathname = window.location.pathname.replace(/^\//, '').trim();
        const activePage = pagesData.find(p => p.slug === pathname) || pagesData[0];
        setActivePageId(activePage.id);

        // Update Document Title & Meta Description for SEO
        document.title = activePage.seo_title || `${siteData.business_name} — Powered by OnlyPage`;
        if (activePage.seo_desc) {
          let metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) metaDesc.setAttribute('content', activePage.seo_desc);
        }

        // Extract Global Header & Footer from theme
        if (siteData.theme?.header) setGlobalHeader(siteData.theme.header);
        if (siteData.theme?.footer) setGlobalFooter(siteData.theme.footer);

        // 3. Fetch blocks for active page
        const { data: blocksData, error: blocksError } = await supabase
          .from('blocks')
          .select('*')
          .eq('page_id', activePage.id)
          .order('position', { ascending: true });

        if (!blocksError && blocksData && blocksData.length > 0) {
          const mapped = blocksData
            .filter(b => b.type !== 'Navigation' && b.type !== 'Footer')
            .map(b => ({
              id: b.id,
              type: b.type as any,
              position: b.position,
              ...(b.config as any)
            }));
          setBlocks(mapped);
        }

        // Fetch products if store exists
        const { data: prods } = await supabase
          .from('products')
          .select('*')
          .eq('site_id', siteData.id)
          .order('created_at', { ascending: false });

        if (prods) {
          setEcomProducts(prods.map((p: any) => ({
            id: p.id,
            name: p.title || p.name,
            price: p.price ? `₹${p.price}` : '₹0',
            description: p.description || '',
            category: p.category || 'All Products',
            imageUrl: p.image_url || p.imageUrl || '',
            rating: p.rating || 4.9,
            reviewsCount: p.reviews_count || 12,
            inStock: p.in_stock !== false,
            badge: p.offer_badge || ''
          })));
        }

      } catch (err) {
        console.error('Error loading public site:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    if (subdomain) {
      loadPublicSite();
    }
  }, [subdomain]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4 font-sans">
        <Loader2 size={36} className="animate-spin text-lime-400" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Loading {subdomain}.onlypage.in...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#18201d] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="size-16 rounded-2xl bg-[#bef264]/10 border border-[#bef264]/20 flex items-center justify-center text-[#bef264] mb-6 shadow-xl">
          <Globe size={32} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white max-w-md">
          <span className="text-[#bef264]">{subdomain}.onlypage.in</span> is available to claim!
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed font-medium">
          This site is not published yet or hasn't been set up. You can create your own business website on this address in under 2 minutes.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <a
            href="https://onlypage.in"
            className="px-6 py-3 rounded-xl bg-[#bef264] hover:bg-[#a3e635] text-[#18201d] font-extrabold text-xs tracking-wide transition shadow-lg flex items-center justify-center gap-2"
          >
            <span>Create Your OnlyPage</span>
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#bef264] selection:text-[#18201d]">
      {/* Global Header */}
      {globalHeader && (
        <BuilderRenderer 
          block={globalHeader} 
          isActive={false} 
          onSelect={() => {}} 
          siteId={site.id}
          pages={pages}
          onNavigatePage={(slug) => {
            const targetPage = pages.find(p => p.slug === slug);
            if (targetPage) {
              setActivePageId(targetPage.id);
              window.history.pushState({}, '', `/${slug === 'home' ? '' : slug}`);
            }
          }}
          site={site}
          activePageId={activePageId}
          ecomProducts={ecomProducts}
        />
      )}

      {/* Main Page Blocks */}
      <main>
        {blocks.length === 0 ? (
          <div className="py-24 text-center text-slate-400 text-sm font-medium">
            No content published on this page yet.
          </div>
        ) : (
          blocks.map(block => (
            <div key={block.id}>
              <BuilderRenderer 
                block={block} 
                isActive={false} 
                onSelect={() => {}} 
                siteId={site.id}
                pages={pages}
                site={site}
                activePageId={activePageId}
                ecomProducts={ecomProducts}
              />
            </div>
          ))
        )}
      </main>

      {/* Global Footer */}
      {globalFooter && (
        <BuilderRenderer 
          block={globalFooter} 
          isActive={false} 
          onSelect={() => {}} 
          siteId={site.id}
          pages={pages}
          site={site}
          activePageId={activePageId}
          ecomProducts={ecomProducts}
        />
      )}

      {/* Discrete Powered By OnlyPage badge for public sites */}
      <div className="py-4 bg-[#18201d] text-center border-t border-slate-800">
        <a 
          href="https://onlypage.in" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-[#bef264] transition"
        >
          <Sparkles size={12} className="text-[#bef264]" />
          <span>Powered by <strong className="text-white">OnlyPage</strong></span>
        </a>
      </div>
    </div>
  );
}
