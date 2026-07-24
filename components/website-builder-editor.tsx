import React, { useState, useEffect, useRef } from 'react';
import { 
  Laptop, Tablet, Smartphone, Search, Plus, Trash2, Copy, MoveUp, MoveDown, 
  Sparkles, Check, ChevronDown, Settings, Layers, Database, Image as ImageIcon, 
  Sliders, ChevronRight, RotateCcw, FileText, CheckCircle2, ArrowLeft, Send, 
  Layout, Type, Palette, SlidersHorizontal, PlusCircle, Save, ExternalLink, 
  Eye, Globe, RefreshCw, X, Sliders as SliderIcon, Type as FontIcon, 
  Grid, Compass, Info, CheckSquare, MessageSquare, Briefcase, DollarSign, List,
  MapPin, Phone, Mail, Award, ThumbsUp, Star, Palette as ThemeIcon,
  UploadCloud, Loader2, Files
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BLOCK_CATEGORIES, BLOCK_VARIANTS_MAP, INDUSTRY_PRESETS } from './builder-data';
import { BuilderRenderer } from './builder-renderer';
import { supabase } from '@/lib/supabase';
import type { SiteRecord } from './ui/onboarding-wizard';

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface BlockCSSStyles {
  // Spacing & Layout
  paddingTop: number;       // in px
  paddingBottom: number;    // in px
  paddingLeft: number;      // in px
  paddingRight: number;     // in px
  gapSize: number;          // in px
  maxWidth: number;         // in px (content constraint)
  textAlign: 'left' | 'center' | 'right';
  
  // Theme & Colors (Hex values)
  backgroundColor: string;
  backgroundGradient: string; // e.g. "linear-gradient(...)"
  useGradient: boolean;
  textColor: string;
  subtitleColor: string;
  accentColor: string;
  badgeBgColor: string;
  badgeTextColor: string;
  
  // Typography
  fontFamily: string;
  titleSize: number;        // in px
  titleWeight: 'light' | 'normal' | 'semibold' | 'bold' | 'black';
  subtitleSize: number;     // in px
  bodySize: number;         // in px
  lineHeight: number;       // standard line height scale (e.g. 1.2, 1.5, 1.6)

  // Card Styling (For sub-items in Features/Pricing/Testimonials)
  cardBgColor: string;
  cardTextColor: string;
  cardBorderRadius: number; // in px
  cardShadow: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  cardBorderWidth: number;  // in px
  cardBorderColor: string;

  // Global Section Borders & Shadow
  borderRadius: number;     // in px (outer section container if any)
  borderWidth: number;      // in px
  borderColor: string;
  borderStyle: 'solid' | 'dashed' | 'dotted';
  boxShadow: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

  // Interactive Buttons
  buttonBgColor: string;
  buttonTextColor: string;
  buttonBorderRadius: number; // in px
  buttonHoverScale: boolean;

  // Interactive Backgrounds & Animations
  bgType?: 'color' | 'gradient' | 'image' | string;
  bgImageUrl?: string;
  bgImageOpacity?: number;
  bgImageSize?: 'cover' | 'contain' | 'auto' | string;
  bgImageAttachment?: 'scroll' | 'fixed' | string;
  clickResponse?: 'none' | 'scale-down' | 'scale-up' | 'bounce' | 'pulse' | 'flash' | 'ripple' | string;
  hoverEffect?: 'none' | 'lift' | 'glow' | 'tilt' | 'scale' | string;
}

export interface WebBlock {
  id: string;
  type: 'Hero' | 'Features' | 'Pricing' | 'Testimonials' | 'Contact' | 'Footer' | 'Gallery' | 'Business' | 'Forms' | 'Special' | 'CTA' | 'Navigation' | 'Map' | 'EComStore';
  title: string;
  subtitle: string;
  badge?: string;
  imageUrl?: string;
  btnText?: string;
  variant?: string;
  // Button Actions
  btnActionType?: 'scroll' | 'link' | 'external' | 'none' | string;
  btnActionValue?: string;
  // Map configuration
  mapAddress?: string;
  // Gallery Slide Images
  galleryImages?: { id: string; url: string; title: string; subtitle: string; aspect?: string }[];
  // Features lists
  features?: { id: string; title: string; desc: string; icon: string }[];
  // Pricing plans
  pricing?: { id: string; tier: string; price: string; features: string[]; btnText: string; popular?: boolean }[];
  // Testimonial list
  testimonials?: { id: string; name: string; role: string; content: string; avatar: string; rating: number }[];
  // Contact details
  contactEmail?: string;
  // ...
  contactPhone?: string;
  contactAddress?: string;
  showMap?: boolean;
  // Footer content
  copyright?: string;
  links?: { id: string; label: string; url: string }[];
  linkColumns?: { id: string; heading: string; links: { id: string; label: string; url: string }[] }[];
  // FAQ, Stats, Steps
  faqs?: { id: string; q: string; a: string }[];
  stats?: { id: string; label: string; val: number; suffix: string }[];
  steps?: { id: string; step: string; title: string; desc: string }[];
  styles: BlockCSSStyles;
}

export interface WebPage {
  id: string;
  name: string;
  slug: string;
  seoTitle: string;
  seoDesc: string;
}

export const GOOGLE_FONTS_LIST = [
  "Inter", "Plus Jakarta Sans", "Poppins", "Montserrat", "Open Sans", "Roboto", "Lato", "Raleway", "DM Sans", "Nunito", "Albert Sans",
  "Playfair Display", "Merriweather", "Lora", "Cormorant Garamond", "EB Garamond", "Georgia",
  "Space Grotesk", "Outfit", "Syne", "Oswald", "Bebas Neue", "Cinzel", "Lexend",
  "JetBrains Mono", "Fira Code", "Space Mono", "Source Code Pro",
  "Caveat", "Pacifico", "Shadows Into Light", "Great Vibes", "Architects Daughter", "Dancing Script"
];

const INITIAL_BLOCKS: WebBlock[] = [];

export function WebsiteBuilderEditor({ onExit, site, onUpdateSite }: { onExit: () => void; site: SiteRecord; onUpdateSite?: (site: SiteRecord) => void }) {
  // --- CORE STATE ---
  const [blocks, setBlocks] = useState<WebBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedSubElement, setSelectedSubElement] = useState<'background' | 'badge' | 'title' | 'subtitle' | 'button' | 'card' | 'media' | null>(null);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  
  // Navigation & Workspace Preferences
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [leftSidebarTab, setLeftSidebarTab] = useState<'add-blocks' | 'pages' | 'layers' | 'seo' | 'database'>('add-blocks');
  const [rightInspectorTab, setRightInspectorTab] = useState<'content' | 'css-styles'>('css-styles');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showLivePreviewModal, setShowLivePreviewModal] = useState(false);
  const [showAddPageModal, setShowAddPageModal] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  
  // Undo/Redo tracking
  const [history, setHistory] = useState<WebBlock[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty'>('saved');

  // Page Setup & SEO
  const [seoTitle, setSeoTitle] = useState(() => site ? `${site.business_name} | Home` : '');
  const [seoDesc, setSeoDesc] = useState(() => site ? `Welcome to ${site.business_name} website.` : '');
  const [pages, setPages] = useState<any[]>([]);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Global layout components
  const [globalHeader, setGlobalHeader] = useState<WebBlock | null>(null);
  const [globalFooter, setGlobalFooter] = useState<WebBlock | null>(null);

  // Preview modal states
  const [previewPageId, setPreviewPageId] = useState<string | null>(null);
  const [previewBlocks, setPreviewBlocks] = useState<WebBlock[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Gallery image upload ref
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Alert Notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [revisions, setRevisions] = useState<any[]>([]);

  // Search and tabs for Lego Builder Block Library
  const [blockSearch, setBlockSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Hero');

  // AI Prompt transformation state
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Database custom collections states
  const [selectedCollectionName, setSelectedCollectionName] = useState<string | null>(null);
  const [showAddCollectionForm, setShowAddCollectionForm] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionColumns, setNewCollectionColumns] = useState<{ name: string; type: 'text' | 'number' | 'image' | 'email' | 'phone' }[]>([
    { name: 'name', type: 'text' }
  ]);
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState<'text' | 'number' | 'image' | 'email' | 'phone'>('text');
  
  // States for row editing
  const [showAddRowForm, setShowAddRowForm] = useState(false);
  const [newRowData, setNewRowData] = useState<Record<string, string>>({});

  // States for On-Canvas AI Assistant
  const [aiAssistantBlockId, setAiAssistantBlockId] = useState<string | null>(null);
  const [aiAssistantPrompt, setAiAssistantPrompt] = useState('');

  const handleUpdateCustomCollections = async (updatedCollections: any[]) => {
    const updatedTheme = {
      ...site.theme,
      customCollections: updatedCollections
    };
    
    onUpdateSite?.({
      ...site,
      theme: updatedTheme
    });
    
    setSaveStatus('saving');
    try {
      const { error } = await supabase
        .from('sites')
        .update({ theme: updatedTheme })
        .eq('id', site.id);
      if (error) throw error;
      setSaveStatus('saved');
    } catch (err: any) {
      console.error('Error saving collections:', err);
      setSaveStatus('dirty');
    }
  };

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) {
      triggerToast('Collection name is required', 'error');
      return;
    }
    const currentCollections = site.theme?.customCollections || [];
    if (currentCollections.some((c: any) => c.name.toLowerCase() === newCollectionName.toLowerCase())) {
      triggerToast('Collection name already exists', 'error');
      return;
    }
    
    const newColl = {
      name: newCollectionName.trim(),
      columns: [...newCollectionColumns],
      rows: []
    };
    
    const updated = [...currentCollections, newColl];
    handleUpdateCustomCollections(updated);
    setNewColumnName('');
    setNewCollectionName('');
    setNewCollectionColumns([{ name: 'name', type: 'text' }]);
    setShowAddCollectionForm(false);
    setSelectedCollectionName(newColl.name);
    triggerToast(`Created database table ${newColl.name}!`, 'success');
  };

  const handleDeleteCollection = (name: string) => {
    const currentCollections = site.theme?.customCollections || [];
    const updated = currentCollections.filter((c: any) => c.name.toLowerCase() !== name.toLowerCase());
    handleUpdateCustomCollections(updated);
    if (selectedCollectionName?.toLowerCase() === name.toLowerCase()) {
      setSelectedCollectionName(null);
    }
    triggerToast(`Deleted database table ${name}`, 'info');
  };

  const handleAddColumn = (collName: string) => {
    if (!newColumnName.trim()) {
      triggerToast('Column name is required', 'error');
      return;
    }
    const currentCollections = site.theme?.customCollections || [];
    const updated = currentCollections.map((c: any) => {
      if (c.name.toLowerCase() === collName.toLowerCase()) {
        if (c.columns.some((col: any) => col.name.toLowerCase() === newColumnName.toLowerCase())) {
          triggerToast('Column already exists', 'error');
          return c;
        }
        return {
          ...c,
          columns: [...c.columns, { name: newColumnName.trim(), type: newColumnType }]
        };
      }
      return c;
    });
    handleUpdateCustomCollections(updated);
    setNewColumnName('');
    triggerToast(`Added column ${newColumnName}!`, 'success');
  };

  const handleAddRow = (collName: string) => {
    const currentCollections = site.theme?.customCollections || [];
    const updated = currentCollections.map((c: any) => {
      if (c.name.toLowerCase() === collName.toLowerCase()) {
        const newRow = {
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          ...newRowData
        };
        return {
          ...c,
          rows: [...(c.rows || []), newRow]
        };
      }
      return c;
    });
    handleUpdateCustomCollections(updated);
    setNewRowData({});
    setShowAddRowForm(false);
    triggerToast('Added row to collection', 'success');
  };

  const handleDeleteRow = (collName: string, rowId: string) => {
    const currentCollections = site.theme?.customCollections || [];
    const updated = currentCollections.map((c: any) => {
      if (c.name.toLowerCase() === collName.toLowerCase()) {
        return {
          ...c,
          rows: (c.rows || []).filter((r: any) => r.id !== rowId)
        };
      }
      return c;
    });
    handleUpdateCustomCollections(updated);
    triggerToast('Deleted row from collection', 'info');
  };

  // Helper to trigger toast alerts
  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const fetchRevisions = async () => {
    if (!site?.id) return;
    try {
      const { data, error } = await supabase
        .from('site_history')
        .select('*')
        .eq('site_id', site.id)
        .order('created_at', { ascending: false })
        .limit(30);
      if (error) throw error;
      setRevisions(data || []);
    } catch (err: any) {
      console.error('Error fetching revisions:', err);
    }
  };

  // 1. Fetch pages and blocks on mount
  useEffect(() => {
    async function loadSiteData() {
      setLoading(true);
      fetchRevisions();
      try {
        let { data: pagesData, error: pagesError } = await supabase
          .from('pages')
          .select('*')
          .eq('site_id', site.id)
          .order('position', { ascending: true });

        if (pagesError) throw pagesError;

        if (!pagesData || pagesData.length === 0) {
          const { data: newPage, error: createPageError } = await supabase
            .from('pages')
            .insert({
              site_id: site.id,
              name: 'Home',
              slug: 'home',
              position: 0,
              seo_title: `${site.business_name} | Home`,
              seo_desc: `Welcome to ${site.business_name}. Find our contact details, bookings, and services online.`,
            })
            .select()
            .single();

          if (createPageError) throw createPageError;
          pagesData = [newPage];
        }

        setPages(pagesData);
        const activePage = pagesData[0];
        setActivePageId(activePage.id);

        setSeoTitle(activePage.seo_title || '');
        setSeoDesc(activePage.seo_desc || '');

        // Load Global Header & Footer from site.theme
        const themeHeader = site.theme?.header;
        const themeFooter = site.theme?.footer;
        
        if (themeHeader) {
          setGlobalHeader(themeHeader);
        } else {
          setGlobalHeader({
            id: 'global-header',
            type: 'Navigation',
            title: site.business_name,
            subtitle: '',
            btnText: 'Contact Us',
            variant: 'nav-minimal',
            styles: {
              backgroundColor: '#ffffff',
              textColor: '#0f172a',
              subtitleColor: '#475569',
              accentColor: '#2563eb',
              badgeBgColor: '#f1f5f9',
              badgeTextColor: '#2563eb',
              buttonBgColor: '#0f172a',
              buttonTextColor: '#ffffff',
              fontFamily: 'Inter',
              titleSize: 18,
              titleWeight: 'black',
              subtitleSize: 12,
              bodySize: 12,
              paddingTop: 16,
              paddingBottom: 16,
              paddingLeft: 24,
              paddingRight: 24,
              gapSize: 12,
              maxWidth: 1200,
              textAlign: 'left',
              useGradient: false,
              cardBgColor: '#ffffff',
              cardTextColor: '#0f172a',
              cardBorderRadius: 8,
              cardShadow: 'none',
              cardBorderWidth: 1,
              cardBorderColor: '#e2e8f0',
              borderRadius: 0,
              borderWidth: 0,
              borderColor: '',
              borderStyle: 'solid',
              boxShadow: 'none',
              buttonBorderRadius: 8,
              buttonHoverScale: true
            }
          });
        }

        if (themeFooter) {
          setGlobalFooter(themeFooter);
        } else {
          setGlobalFooter({
            id: 'global-footer',
            type: 'Footer',
            title: site.business_name,
            subtitle: 'Powered by OnlyPage',
            copyright: `© ${new Date().getFullYear()} ${site.business_name}. All rights reserved.`,
            variant: 'footer-classic',
            styles: {
              backgroundColor: '#0f172a',
              textColor: '#94a3b8',
              subtitleColor: '#64748b',
              accentColor: '#38bdf8',
              badgeBgColor: '#1e293b',
              badgeTextColor: '#38bdf8',
              buttonBgColor: '#38bdf8',
              buttonTextColor: '#0f172a',
              fontFamily: 'Inter',
              titleSize: 14,
              titleWeight: 'bold',
              subtitleSize: 11,
              bodySize: 11,
              paddingTop: 48,
              paddingBottom: 48,
              paddingLeft: 24,
              paddingRight: 24,
              gapSize: 16,
              maxWidth: 1200,
              textAlign: 'center',
              useGradient: false,
              cardBgColor: '#1e293b',
              cardTextColor: '#94a3b8',
              cardBorderRadius: 8,
              cardShadow: 'none',
              cardBorderWidth: 1,
              cardBorderColor: '#334155',
              borderRadius: 0,
              borderWidth: 0,
              borderColor: '',
              borderStyle: 'solid',
              boxShadow: 'none',
              buttonBorderRadius: 8,
              buttonHoverScale: true
            }
          });
        }

        const { data: blocksData, error: blocksError } = await supabase
          .from('blocks')
          .select('*')
          .eq('page_id', activePage.id)
          .order('position', { ascending: true });

        if (blocksError) throw blocksError;

        if (blocksData && blocksData.length > 0) {
          const mappedBlocks = blocksData
            .filter(b => b.type !== 'Navigation' && b.type !== 'Footer')
            .map(b => ({
              id: b.id,
              type: b.type as any,
              position: b.position,
              ...(b.config as any)
            }));
          setBlocks(mappedBlocks);
          setHistory([mappedBlocks]);
          setHistoryIndex(0);
          if (mappedBlocks.length > 0) {
            setSelectedBlockId(mappedBlocks[0].id);
          }
        } else {
          const themeMode = site.theme?.mode || 'salon';
          const presetBlocks = (INDUSTRY_PRESETS[themeMode] || INDUSTRY_PRESETS['salon']).blocks.map((b) => ({
            ...b,
            id: crypto.randomUUID()
          }));

          setBlocks(presetBlocks);
          setHistory([presetBlocks]);
          setHistoryIndex(0);
          if (presetBlocks.length > 0) {
            setSelectedBlockId(presetBlocks[0].id);
          }

          const rows = presetBlocks.map((b, idx) => ({
            page_id: activePage.id,
            type: b.type,
            position: idx,
            config: {
              title: b.title,
              subtitle: b.subtitle,
              badge: b.badge,
              imageUrl: b.imageUrl,
              btnText: b.btnText,
              variant: b.variant,
              styles: b.styles,
              features: b.features,
              pricing: b.pricing,
              testimonials: b.testimonials,
              galleryImages: b.galleryImages,
            }
          }));
          await supabase.from('blocks').insert(rows);
        }
      } catch (err: any) {
        console.error('Error loading site data:', err);
        triggerToast('Failed to load website blocks: ' + err.message, 'error');
      } finally {
        setLoading(false);
      }
    }

    loadSiteData();
  }, [site.id]);

  // 2. Auto-save to Supabase when dirty
  useEffect(() => {
    if (saveStatus !== 'dirty' || !activePageId) return;

    const timer = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        const { error: deleteError } = await supabase
          .from('blocks')
          .delete()
          .eq('page_id', activePageId);

        if (deleteError) throw deleteError;

        if (blocks.length > 0) {
          const rows = blocks.map((b, idx) => ({
            page_id: activePageId,
            type: b.type,
            position: idx,
            config: {
              title: b.title,
              subtitle: b.subtitle,
              badge: b.badge,
              imageUrl: b.imageUrl,
              btnText: b.btnText,
              variant: b.variant,
              styles: b.styles,
              features: b.features,
              pricing: b.pricing,
              testimonials: b.testimonials,
              galleryImages: b.galleryImages,
            }
          }));

          const { error: insertError } = await supabase
            .from('blocks')
            .insert(rows);

          if (insertError) throw insertError;
        }

        // Save globalHeader & globalFooter to sites table
        const updatedTheme = {
          ...site.theme,
          header: globalHeader,
          footer: globalFooter
        };
        const { error: siteError } = await supabase
          .from('sites')
          .update({
            theme: updatedTheme
          })
          .eq('id', site.id);

        if (siteError) throw siteError;

        onUpdateSite?.({
          ...site,
          theme: updatedTheme
        });

        const { error: pageError } = await supabase
          .from('pages')
          .update({
            seo_title: seoTitle,
            seo_desc: seoDesc
          })
          .eq('id', activePageId);

        if (pageError) throw pageError;

        // Log to site_history table
        await supabase
          .from('site_history')
          .insert({
            site_id: site.id,
            page_id: activePageId,
            blocks: blocks,
            header: globalHeader,
            footer: globalFooter,
            seo_title: seoTitle,
            seo_desc: seoDesc
          });
        
        fetchRevisions();

        setSaveStatus('saved');
      } catch (err: any) {
        console.error('Error saving site data:', err);
        setSaveStatus('dirty');
        triggerToast('Auto-save failed: ' + err.message, 'error');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [blocks, seoTitle, seoDesc, activePageId, globalHeader, globalFooter, site, onUpdateSite]);

  // State update helper with history push
  const updateBlocksState = (newBlocks: WebBlock[]) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    setHistory([...updatedHistory, newBlocks]);
    setHistoryIndex(updatedHistory.length);
    setBlocks(newBlocks);
    setSaveStatus('dirty');
  };

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setBlocks(history[historyIndex - 1]);
      triggerToast('Undo action applied', 'info');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setBlocks(history[historyIndex + 1]);
      triggerToast('Redo action applied', 'info');
    }
  };

  // Canvas block action modifiers
  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    updateBlocksState(updated);
    triggerToast(`Moved section ${direction}`, 'success');
  };

  const handleDeleteBlock = (id: string, name: string) => {
    if (blocks.length <= 1) {
      triggerToast('Canvas must contain at least one block!', 'error');
      return;
    }
    const updated = blocks.filter(b => b.id !== id);
    updateBlocksState(updated);
    if (selectedBlockId === id) {
      setSelectedBlockId(updated[0]?.id || null);
    }
    triggerToast(`Deleted ${name} section`, 'info');
  };

  const handleDuplicateBlock = (block: WebBlock) => {
    const index = blocks.findIndex(b => b.id === block.id);
    const duplicated: WebBlock = JSON.parse(JSON.stringify(block));
    duplicated.id = `${block.type}-${Date.now()}`;
    duplicated.title = `${block.title} (Copy)`;
    
    const updated = [...blocks];
    updated.splice(index + 1, 0, duplicated);
    updateBlocksState(updated);
    setSelectedBlockId(duplicated.id);
    triggerToast(`Duplicated ${block.type} section`, 'success');
  };

  // Interactive style tuning helpers (CSS Inspector updates)
  const handleUpdateBlockStyle = (key: keyof BlockCSSStyles, value: any) => {
    if (!selectedBlockId) return;
    if (selectedBlockId === 'global-header') {
      if (globalHeader) {
        setGlobalHeader({
          ...globalHeader,
          styles: {
            ...globalHeader.styles,
            [key]: value
          }
        });
        setSaveStatus('dirty');
      }
      return;
    }
    if (selectedBlockId === 'global-footer') {
      if (globalFooter) {
        setGlobalFooter({
          ...globalFooter,
          styles: {
            ...globalFooter.styles,
            [key]: value
          }
        });
        setSaveStatus('dirty');
      }
      return;
    }
    const updated = blocks.map(b => {
      if (b.id === selectedBlockId) {
        return {
          ...b,
          styles: {
            ...b.styles,
            [key]: value
          }
        };
      }
      return b;
    });
    setBlocks(updated); // fast state update
    setSaveStatus('dirty');
  };

  const handleUpdateBlockContent = (key: string, value: any) => {
    if (!selectedBlockId) return;
    if (selectedBlockId === 'global-header') {
      if (globalHeader) {
        setGlobalHeader({ ...globalHeader, [key]: value });
        setSaveStatus('dirty');
      }
      return;
    }
    if (selectedBlockId === 'global-footer') {
      if (globalFooter) {
        setGlobalFooter({ ...globalFooter, [key]: value });
        setSaveStatus('dirty');
      }
      return;
    }
    const updated = blocks.map(b => {
      if (b.id === selectedBlockId) {
        return {
          ...b,
          [key]: value
        };
      }
      return b;
    });
    setBlocks(updated);
    setSaveStatus('dirty');
  };

  // Manual save handler
  const handleManualSave = async () => {
    if (!activePageId) return;
    setSaveStatus('saving');
    try {
      const { error: deleteError } = await supabase
        .from('blocks')
        .delete()
        .eq('page_id', activePageId);
      if (deleteError) throw deleteError;

      if (blocks.length > 0) {
        const rows = blocks.map((b, idx) => ({
          page_id: activePageId,
          type: b.type,
          position: idx,
          config: {
            title: b.title,
            subtitle: b.subtitle,
            badge: b.badge,
            imageUrl: b.imageUrl,
            btnText: b.btnText,
            variant: b.variant,
            styles: b.styles,
            features: b.features,
            pricing: b.pricing,
            testimonials: b.testimonials,
            galleryImages: b.galleryImages,
          }
        }));
        const { error: insertError } = await supabase.from('blocks').insert(rows);
        if (insertError) throw insertError;
      }

      // Save global header and footer
      const updatedTheme = {
        ...site.theme,
        header: globalHeader,
        footer: globalFooter
      };
      const { error: siteError } = await supabase
        .from('sites')
        .update({
          theme: updatedTheme
        })
        .eq('id', site.id);
      if (siteError) throw siteError;

      onUpdateSite?.({
        ...site,
        theme: updatedTheme
      });

      const { error: pageError } = await supabase
        .from('pages')
        .update({ seo_title: seoTitle, seo_desc: seoDesc })
        .eq('id', activePageId);
      if (pageError) throw pageError;

      // Log to site_history table
      await supabase
        .from('site_history')
        .insert({
          site_id: site.id,
          page_id: activePageId,
          blocks: blocks,
          header: globalHeader,
          footer: globalFooter,
          seo_title: seoTitle,
          seo_desc: seoDesc
        });
      
      fetchRevisions();

      setSaveStatus('saved');
      triggerToast('All changes saved to database!', 'success');
    } catch (err: any) {
      setSaveStatus('dirty');
      triggerToast('Save failed: ' + err.message, 'error');
    }
  };

  // Load blocks for a specific page (used in preview modal)
  const loadBlocksForPage = async (pageId: string) => {
    setPreviewLoading(true);
    try {
      if (pageId === activePageId) {
        setPreviewBlocks(blocks);
      } else {
        const { data, error } = await supabase
          .from('blocks')
          .select('*')
          .eq('page_id', pageId)
          .order('position', { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) {
          setPreviewBlocks(data.map(b => ({
            id: b.id,
            type: b.type as any,
            position: b.position,
            ...(b.config as any)
          })));
        } else {
          setPreviewBlocks([]);
        }
      }

      // Log page view in our self-hosted page_views analytics table
      const pageObj = pages.find(p => p.id === pageId);
      if (pageObj) {
        supabase
          .from('page_views')
          .insert({
            site_id: site.id,
            page_slug: pageObj.slug,
            referrer: 'editor_preview',
            user_agent: navigator.userAgent
          })
          .then(({ error }) => {
            if (error) console.error('Failed to log page view:', error.message);
          });
      }
    } catch (err: any) {
      triggerToast('Failed to load page blocks: ' + err.message, 'error');
    } finally {
      setPreviewLoading(false);
    }
  };

  // Gallery image upload to Supabase Storage
  const handleGalleryImageUpload = async (files: FileList) => {
    if (!selectedBlockId || files.length === 0) return;
    setUploadingImage(true);
    const currentBlock = selectedBlockId === 'global-header' ? globalHeader : selectedBlockId === 'global-footer' ? globalFooter : blocks.find(b => b.id === selectedBlockId);
    const currentSlides = currentBlock?.galleryImages || [];
    const newSlides = [...currentSlides];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${site.id}/gallery/${Date.now()}-${i}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('site-assets')
          .upload(fileName, file, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('site-assets')
          .getPublicUrl(fileName);

        newSlides.push({
          id: `slide-${Date.now()}-${i}`,
          url: publicUrlData.publicUrl,
          title: file.name.replace(/\.[^/.]+$/, ''),
          subtitle: ''
        });
      }

      handleUpdateBlockContent('galleryImages', newSlides);
      triggerToast(`Uploaded ${files.length} image${files.length > 1 ? 's' : ''} to gallery!`, 'success');
    } catch (err: any) {
      triggerToast('Upload failed: ' + err.message, 'error');
    } finally {
      setUploadingImage(false);
      if (galleryFileInputRef.current) galleryFileInputRef.current.value = '';
    }
  };

  // Single image upload to Supabase Storage
  const handleSingleImageUpload = async (file: File, target: 'content' | 'style', fieldName: any) => {
    if (!selectedBlockId || !file) return;
    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${site.id}/assets/${Date.now()}-${Math.random().toString(36).substring(2, 6)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('site-assets')
        .getPublicUrl(fileName);

      const url = publicUrlData.publicUrl;

      if (target === 'content') {
        handleUpdateBlockContent(fieldName, url);
      } else {
        handleUpdateBlockStyle(fieldName, url);
      }
      triggerToast('Image uploaded successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      triggerToast('Failed to upload image: ' + err.message, 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  // Switch active page
  const switchActivePage = async (pageId: string) => {
    if (saveStatus === 'dirty') {
      await handleManualSave();
    }
    setLoading(true);
    try {
      const activePage = pages.find(p => p.id === pageId);
      if (!activePage) return;
      setActivePageId(pageId);
      setSeoTitle(activePage.seo_title || '');
      setSeoDesc(activePage.seo_desc || '');

      const { data: blocksData, error: blocksError } = await supabase
        .from('blocks')
        .select('*')
        .eq('page_id', pageId)
        .order('position', { ascending: true });

      if (blocksError) throw blocksError;

      const mappedBlocks = (blocksData || [])
        .filter(b => b.type !== 'Navigation' && b.type !== 'Footer')
        .map(b => ({
          id: b.id,
          type: b.type as any,
          position: b.position,
          ...(b.config as any)
        }));

      setBlocks(mappedBlocks);
      setHistory([mappedBlocks]);
      setHistoryIndex(0);
      if (mappedBlocks.length > 0) {
        setSelectedBlockId(mappedBlocks[0].id);
      } else {
        setSelectedBlockId(null);
      }
    } catch (err: any) {
      console.error(err);
      triggerToast('Failed to switch page: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Create new page inside builder
  const handleCreatePageInBuilder = async (name: string, slug: string) => {
    if (!name.trim()) return;
    const formattedSlug = slug.trim().startsWith('/') ? slug.trim() : '/' + slug.trim();
    try {
      const { data: newPage, error: createError } = await supabase
        .from('pages')
        .insert({
          site_id: site.id,
          name: name.trim(),
          slug: formattedSlug,
          position: pages.length,
          seo_title: `${name.trim()} | ${site.business_name}`,
          seo_desc: `Welcome to ${name.trim()} page.`,
        })
        .select()
        .single();
        
      if (createError) throw createError;

      // Add default Hero block for new page
      const defaultBlock = generateDefaultBlock('Hero', 'saas-saas');
      const rows = [{
        page_id: newPage.id,
        type: defaultBlock.type,
        position: 0,
        config: {
          title: `Welcome to the ${name.trim()} Page`,
          subtitle: `Explore dynamic content customized and structured for ${site.business_name}.`,
          badge: 'NEW PAGE ROUTE',
          variant: defaultBlock.variant,
          styles: defaultBlock.styles
        }
      }];

      await supabase.from('blocks').insert(rows);

      setPages([...pages, newPage]);
      triggerToast(`Page "${name}" created!`, 'success');
      switchActivePage(newPage.id);
    } catch (err: any) {
      triggerToast('Error creating page: ' + err.message, 'error');
    }
  };

  // Load a complete Industry Preset
  const handleLoadIndustryPreset = (presetKey: keyof typeof INDUSTRY_PRESETS) => {
    const selectedPreset = INDUSTRY_PRESETS[presetKey];
    if (selectedPreset) {
      const clonedBlocks = JSON.parse(JSON.stringify(selectedPreset.blocks)) as unknown as WebBlock[];
      updateBlocksState(clonedBlocks);
      setSelectedBlockId(clonedBlocks[0]?.id || null);
      triggerToast(`Loaded ${presetKey} website preset!`, 'success');
    }
  };

  const generateDefaultBlock = (category: string, variantKey: string): WebBlock => {
    const isDark = ['gradient-glow', 'saas-modern', '3d-mesh', 'aurora-sky', 'video-simulate', 'bento-box', 'gradient-cta', 'app-download'].includes(variantKey);
    
    const blockStyles: BlockCSSStyles = {
      paddingTop: 80,
      paddingBottom: 80,
      paddingLeft: 24,
      paddingRight: 24,
      gapSize: 24,
      maxWidth: 1200,
      textAlign: (category === 'Hero' || category === 'CTA' || category === 'Pricing') ? 'center' : 'left',
      backgroundColor: isDark ? '#030712' : '#ffffff',
      textColor: isDark ? '#f9fafb' : '#0f172a',
      subtitleColor: isDark ? '#9ca3af' : '#475569',
      accentColor: '#3b82f6',
      badgeBgColor: isDark ? '#1e1b4b' : '#eff6ff',
      badgeTextColor: isDark ? '#c084fc' : '#3b82f6',
      useGradient: isDark,
      backgroundGradient: isDark ? 'linear-gradient(135deg, #090514 0%, #030712 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: 'Inter',
      titleSize: category === 'Hero' ? 48 : 34,
      titleWeight: 'bold',
      subtitleSize: 15,
      bodySize: 13,
      lineHeight: 1.4,
      cardBgColor: isDark ? '#111827' : '#f8fafc',
      cardTextColor: isDark ? '#f9fafb' : '#0f172a',
      cardBorderRadius: 12,
      cardShadow: 'md',
      cardBorderWidth: 1,
      cardBorderColor: isDark ? '#1f2937' : '#cbd5e1',
      borderRadius: 0,
      borderWidth: 0,
      borderColor: '',
      borderStyle: 'solid',
      boxShadow: 'none',
      buttonBgColor: '#3b82f6',
      buttonTextColor: '#ffffff',
      buttonBorderRadius: 8,
      buttonHoverScale: true
    };

    const id = category === 'Navigation' 
      ? 'global-header' 
      : category === 'Footer' 
        ? 'global-footer' 
        : `${category.toLowerCase()}-${Date.now()}`;
    
    const defaultData: any = {
      Navigation: {
        title: site.business_name || 'OnlyPage Brand',
        btnText: 'Contact Us',
        links: [
          { id: 'n-1', label: 'Services', url: '#' },
          { id: 'n-2', label: 'Pricing', url: '#' },
          { id: 'n-3', label: 'Contact', url: '#' }
        ]
      },
      Hero: {
        title: variantKey === 'aurora-sky' ? 'Rejuvenate Your Senses. Restore Your Glow.' : 'Transform Your Online Experience',
        subtitle: 'Build responsive, highly optimized landing pages instantly with the easiest visual block builder.',
        badge: 'NEXT-GEN PAGE BUILDER',
        btnText: 'Start Building Free',
        imageUrl: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=800',
      },
      Features: {
        title: 'Exceptional Visual Capabilities',
        subtitle: 'All visual blocks are responsive, interactive, and customizable.',
        badge: 'CORE ADVANTAGES',
        features: [
          { id: 'f-1', title: 'Aesthetic Lego System', desc: 'Combine premade sections and create a beautiful layout.', icon: 'Sliders' },
          { id: 'f-2', title: 'Interactive Spotlight Effect', desc: 'Dynamic radial lights follow the cursor smoothly.', icon: 'Sparkles' },
          { id: 'f-3', title: 'Figma-Like Controls', desc: 'Precision styles like padding, borders, shadow adjustments.', icon: 'Layout' }
        ]
      },
      Pricing: {
        title: 'Flexible Pricing Plans',
        subtitle: 'Choose the model that fits your business scaling needs.',
        badge: 'TRANSPARENT PLANS',
        pricing: [
          { id: 'p-1', tier: 'Starter Pack', price: '$0', features: ['3 visual custom pages', 'Standard responsive canvas', 'Local draft autosaves'], btnText: 'Launch Free' },
          { id: 'p-2', tier: 'Pro Studio', price: '$29', features: ['Unlimited visual pages', 'Custom domain mapping', 'Advanced moving effects', 'Premium bento structures'], btnText: 'Go Pro Today', popular: true },
          { id: 'p-3', tier: 'Enterprise Spec', price: '$99', features: ['Dedicated cloud database', 'Team collaboration seats', 'A/B landing analysis', 'Priority support line'], btnText: 'Contact Enterprise' }
        ]
      },
      Testimonials: {
        title: 'Loved By Digital Creators',
        subtitle: 'Read why elite designers use OnlyPage for their web layouts.',
        badge: 'COMMUNITY VOICES',
        testimonials: [
          { id: 't-1', name: 'Aravind Sharma', role: 'UX Director, DesignCraft', content: 'The easiest block builder I have ever experienced. Accidentally created a beautiful portfolio in 5 minutes!', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', rating: 5 },
          { id: 't-2', name: 'Sarah Jenkins', role: 'SaaS Creator', content: 'The bento box feature maps apple-grade portfolios instantly. Completely replaced our web agency workflow!', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150', rating: 5 }
        ]
      },
      Gallery: {
        title: 'Visual Brand Portfolio',
        subtitle: 'High-definition showcases of premium craft and digital structures.',
        badge: 'BRAND REVELATION',
        features: [
          { id: 'g-1', title: 'Luxury Residences', desc: 'Modern high-rises and custom private villas.', icon: 'Check' },
          { id: 'g-2', title: 'Creative Studio', desc: 'Fluid interactive assets rendering 3D shaders.', icon: 'Check' },
          { id: 'g-3', title: 'Design System', desc: 'Full-bleed layout mockups with beautiful margins.', icon: 'Check' }
        ]
      },
      Business: {
        title: 'Premium Specialized Services',
        subtitle: 'Curated solutions designed for wellness clinics, doctors, and luxury salons.',
        badge: 'SPECIALTIES',
        features: [
          { id: 'b-1', title: 'Signature Treatment', desc: '1 hour • Complete exfoliating facial rejuvenation.', icon: 'Sparkles' },
          { id: 'b-2', title: 'Deep Tissue Balance', desc: '1.5 hours • Restorative oil massages.', icon: 'Heart' },
          { id: 'b-3', title: 'Advanced Skin Therapy', desc: '45 mins • Dynamic peptide infusions.', icon: 'Check' }
        ]
      },
      Forms: {
        title: 'Initiate Your Consultation',
        subtitle: 'Confirm your custom slot online. No upfront deposit required.',
        badge: 'SECURE RESERVATIONS',
        btnText: 'Confirm Booking Now',
        contactEmail: 'contact@onlypage.io',
        contactPhone: '+1 (555) 019-2834',
        contactAddress: 'Indiranagar, Bengaluru',
      },
      Special: {
        title: 'Timeline & Frequently Asked Questions',
        subtitle: 'Find instant answers to common questions about our visual block editor.',
        badge: 'TIMELINES & FAQ',
        features: [
          { id: 's-1', title: 'Is the hosting permanent?', desc: 'Yes, all published sites are hosted directly on Google Cloud Run with custom SSL.', icon: 'Globe' },
          { id: 's-2', title: 'Can I export the clean code?', desc: 'Absolutely, you can export the production-ready React + Tailwind package anytime.', icon: 'Sliders' }
        ]
      },
      CTA: {
        title: 'Ready to Unleash Your Brand Potential?',
        subtitle: 'Join over 10,000 creators designing the future of landing pages on OnlyPage.',
        badge: 'HIGH-CONVERSION CTA',
        btnText: 'Create Your First Page',
      },
      Footer: {
        title: 'OnlyPage',
        copyright: '© 2026 OnlyPage Inc. All rights reserved. Crafting beautiful visual layouts.',
        btnText: 'Get Started',
        btnActionType: 'none',
        btnActionValue: '',
        links: [
          { id: 'l-1', label: 'Dashboard', url: '#' },
          { id: 'l-2', label: 'Privacy Policy', url: '#' },
          { id: 'l-3', label: 'Terms of Service', url: '#' }
        ],
        linkColumns: [
          { id: 'col-1', heading: 'Products', links: [
            { id: 'c1-1', label: 'Feature Links', url: '#' },
            { id: 'c1-2', label: 'Pricing Matrix', url: '#' },
            { id: 'c1-3', label: 'Support Desk', url: '#' }
          ] },
          { id: 'col-2', heading: 'Solutions', links: [
            { id: 'c2-1', label: 'Feature Links', url: '#' },
            { id: 'c2-2', label: 'Pricing Matrix', url: '#' },
            { id: 'c2-3', label: 'Support Desk', url: '#' }
          ] },
          { id: 'col-3', heading: 'Legal', links: [
            { id: 'c3-1', label: 'Feature Links', url: '#' },
            { id: 'c3-2', label: 'Pricing Matrix', url: '#' },
            { id: 'c3-3', label: 'Support Desk', url: '#' }
          ] }
        ]
      }
    }[category] || {};

    return {
      id,
      type: category as any,
      variant: variantKey,
      title: '',
      subtitle: '',
      styles: blockStyles,
      ...defaultData
    } as WebBlock;
  };

  // Add block preset templates from Variant library
  const addBlockVariant = (category: string, variantKey: string) => {
    const categoryVariants = BLOCK_VARIANTS_MAP[category];
    if (!categoryVariants) return;
    const template = categoryVariants.find(v => v.id === variantKey);
    if (!template) return;

    if (category === 'Navigation') {
      const newHeader = generateDefaultBlock('Navigation', variantKey);
      setGlobalHeader(newHeader);
      setSelectedBlockId('global-header');
      triggerToast(`Switched Header style to [${template.name}]`, 'success');
      setSaveStatus('dirty');
      return;
    }

    if (category === 'Footer') {
      const newFooter = generateDefaultBlock('Footer', variantKey);
      setGlobalFooter(newFooter);
      setSelectedBlockId('global-footer');
      triggerToast(`Switched Footer style to [${template.name}]`, 'success');
      setSaveStatus('dirty');
      return;
    }

    const newBlock = generateDefaultBlock(category, variantKey);

    const updated = [...blocks];
    const footerIndex = updated.findIndex(b => b.type === 'Footer');
    if (footerIndex !== -1) {
      updated.splice(footerIndex, 0, newBlock);
    } else {
      updated.push(newBlock);
    }

    updateBlocksState(updated);
    setSelectedBlockId(newBlock.id);
    triggerToast(`Added ${newBlock.type} variant [${variantKey}] to canvas`, 'success');
  };

  // Submit Prompt to Gemini API backend route
  const handleAiStyling = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    triggerToast('Sending design instructions to OnlyPage AI...', 'info');

    try {
      const response = await fetch('/api/ai/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, blocks })
      });

      if (!response.ok) {
        throw new Error('AI styling request failed');
      }

      const data = await response.json();
      if (data.blocks) {
        updateBlocksState(data.blocks);
        triggerToast(data.message || 'Styles transformed by AI successfully!', 'success');
        setAiPrompt('');
      } else {
        throw new Error('Invalid response payload');
      }
    } catch (err: any) {
      console.error(err);
      triggerToast('AI Service offline. Initializing local aesthetic backup transformation...', 'error');
      
      // Resilient backup transformations
      const isLuxury = aiPrompt.toLowerCase().includes("luxur") || aiPrompt.toLowerCase().includes("gold");
      const isCosmic = aiPrompt.toLowerCase().includes("cosmic") || aiPrompt.toLowerCase().includes("dark") || aiPrompt.toLowerCase().includes("purple");
      const isMinimal = aiPrompt.toLowerCase().includes("minim");

      const simulated = blocks.map((b: any) => {
        const styles = { ...b.styles };
        if (isLuxury) {
          styles.fontFamily = "Playfair Display";
          styles.backgroundColor = "#09090b";
          styles.textColor = "#f5f5f5";
          styles.subtitleColor = "#a3a3a3";
          styles.accentColor = "#d4af37";
          styles.badgeBgColor = "#1a1a1a";
          styles.badgeTextColor = "#d4af37";
          styles.buttonBgColor = "#d4af37";
          styles.buttonTextColor = "#09090b";
        } else if (isCosmic) {
          styles.fontFamily = "Space Grotesk";
          styles.backgroundColor = "#030712";
          styles.textColor = "#f9fafb";
          styles.subtitleColor = "#9ca3af";
          styles.accentColor = "#a855f7";
          styles.badgeBgColor = "#1e1b4b";
          styles.badgeTextColor = "#c084fc";
          styles.buttonBgColor = "#a855f7";
          styles.buttonTextColor = "#ffffff";
          styles.useGradient = true;
          styles.backgroundGradient = "linear-gradient(135deg, #090514 0%, #030712 100%)";
        } else if (isMinimal) {
          styles.fontFamily = "Inter";
          styles.backgroundColor = "#ffffff";
          styles.textColor = "#0f172a";
          styles.subtitleColor = "#475569";
          styles.accentColor = "#2563eb";
          styles.badgeBgColor = "#f1f5f9";
          styles.badgeTextColor = "#2563eb";
          styles.buttonBgColor = "#0f172a";
          styles.buttonTextColor = "#ffffff";
          styles.useGradient = false;
        }
        return { ...b, styles };
      });
      updateBlocksState(simulated);
      setAiPrompt('');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleExecuteAiAssistant = async () => {
    if (!aiAssistantPrompt.trim() || !aiAssistantBlockId) return;
    setIsAiLoading(true);
    triggerToast('OnlyPage AI is processing your request...', 'info');

    // Scoped prompt instructions targeting only the specific block
    const scopedPrompt = `For the section block with ID "${aiAssistantBlockId}", please apply the following copywriting/style modification: ${aiAssistantPrompt}`;

    try {
      // Find block if it is global header/footer to include it in the body payload
      let blocksToSend = [...blocks];
      if (globalHeader) blocksToSend.unshift(globalHeader);
      if (globalFooter) blocksToSend.push(globalFooter);

      const response = await fetch('/api/ai/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: scopedPrompt, blocks: blocksToSend })
      });

      if (!response.ok) throw new Error('AI assistant call failed');
      const data = await response.json();
      if (data.blocks) {
        // Extract updated global header & footer back if they were modified
        const newHeader = data.blocks.find((b: any) => b.id === 'global-header');
        const newFooter = data.blocks.find((b: any) => b.id === 'global-footer');
        const newPageBlocks = data.blocks.filter((b: any) => b.id !== 'global-header' && b.id !== 'global-footer');

        if (newHeader) setGlobalHeader(newHeader);
        if (newFooter) setGlobalFooter(newFooter);
        updateBlocksState(newPageBlocks);

        triggerToast('Section transformed by AI successfully!', 'success');
        setAiAssistantPrompt('');
        setAiAssistantBlockId(null);
      } else {
        throw new Error('Invalid AI response payload');
      }
    } catch (err: any) {
      console.error(err);
      triggerToast('AI Assistant request failed: ' + err.message, 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  const selectedBlock = selectedBlockId === 'global-header' 
    ? globalHeader 
    : selectedBlockId === 'global-footer' 
      ? globalFooter 
      : blocks.find(b => b.id === selectedBlockId);


  return (
    <div className="flex flex-col h-screen w-screen bg-slate-900 text-slate-100 font-sans overflow-hidden select-none" id="builder-root">
      
      {/* ==========================================
          TOP BAR (64px) - Figma-Like Nav
          ========================================== */}
      <header className="h-16 border-b border-slate-800 bg-slate-950 px-6 flex items-center justify-between shrink-0 z-40" id="top-nav-bar">
        
        {/* Left Section: Back, Brand & Active Domain */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onExit}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            id="back-dashboard-btn"
          >
            <ArrowLeft size={14} />
            <span>Dashboard</span>
          </button>
          
          <div className="h-4 w-px bg-slate-800" />
          
          <div className="flex items-center gap-2">
            <span className="font-black text-sm tracking-tight text-white flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xs text-white shadow-md shadow-blue-500/20">O</span>
              <span>OnlyPage <span className="text-[10px] text-blue-400 font-normal ml-0.5 px-1 py-0.5 bg-blue-900/30 border border-blue-500/20 rounded">Figma Mode</span></span>
            </span>
            <div className="hidden md:flex items-center gap-1.5 px-2 py-1 bg-slate-900 border border-slate-800 rounded-md">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-slate-400 font-mono">my-portfolio.onlypage.in</span>
              <ExternalLink size={10} className="text-slate-500 hover:text-slate-300 cursor-pointer" onClick={() => setShowPublishModal(true)} />
            </div>
          </div>
        </div>

        {/* Middle Section: Viewport Controls */}
        <div className="flex items-center gap-5">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            {[
              { id: 'desktop' as const, icon: Laptop, label: 'Desktop (100%)' },
              { id: 'tablet' as const, icon: Tablet, label: 'Tablet (768px)' },
              { id: 'mobile' as const, icon: Smartphone, label: 'Mobile (390px)' }
            ].map(dev => {
              const Icon = dev.icon;
              const isSelected = viewportMode === dev.id;
              return (
                <button
                  key={dev.id}
                  onClick={() => {
                    setViewportMode(dev.id);
                    triggerToast(`Viewport scaled to ${dev.id} layout`, 'info');
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected 
                      ? 'bg-blue-600 text-white shadow shadow-blue-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                  id={`viewport-toggle-${dev.id}`}
                  title={dev.label}
                >
                  <Icon size={13} />
                  <span className="hidden lg:inline text-[10px]">{dev.id.toUpperCase()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Section: Undo/Redo & Save status & Actions */}
        <div className="flex items-center gap-3">
          
          {/* Saved Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 font-mono bg-slate-900/60 border border-slate-800/50 px-2.5 py-1.5 rounded-lg">
            {saveStatus === 'saved' ? (
              <>
                <CheckCircle2 size={12} className="text-emerald-500" />
                <span className="text-emerald-400">All changes synced</span>
              </>
            ) : saveStatus === 'saving' ? (
              <>
                <RefreshCw size={12} className="text-blue-500 animate-spin" />
                <span className="text-blue-400">Syncing to cloud...</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                <span className="text-amber-400 font-bold">Unsaved draft</span>
              </>
            )}
          </div>

          {/* Undo/Redo Controls */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={handleUndo}
              disabled={historyIndex === 0}
              className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                historyIndex > 0 ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-600 cursor-not-allowed'
              }`}
              id="undo-btn"
              title="Undo Last Action"
            >
              <RotateCcw size={14} className="transform -scale-x-100" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                historyIndex < history.length - 1 ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-600 cursor-not-allowed'
              }`}
              id="redo-btn"
              title="Redo Action"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {/* Save, Live Preview & Publish */}
          <button 
            onClick={handleManualSave}
            disabled={saveStatus === 'saving'}
            className={`h-9 px-3.5 border rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              saveStatus === 'saved' 
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' 
                : saveStatus === 'saving'
                  ? 'bg-slate-900 border-slate-700 text-slate-400 cursor-wait'
                  : 'bg-slate-900 hover:bg-slate-800 border-amber-700 text-amber-300'
            }`}
            id="save-site-btn"
            title={saveStatus === 'saved' ? 'All changes saved' : saveStatus === 'saving' ? 'Saving...' : 'Unsaved changes'}
          >
            {saveStatus === 'saving' ? (
              <Loader2 size={13} className="animate-spin" />
            ) : saveStatus === 'saved' ? (
              <CheckCircle2 size={13} />
            ) : (
              <Save size={13} />
            )}
            <span>{saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Save'}</span>
          </button>

          <button 
            onClick={() => {
              setPreviewPageId(activePageId);
              setPreviewBlocks(blocks);
              setShowLivePreviewModal(true);
              
              // Log page view in our self-hosted page_views analytics table
              const pageObj = pages.find(p => p.id === activePageId);
              if (pageObj) {
                supabase
                  .from('page_views')
                  .insert({
                    site_id: site.id,
                    page_slug: pageObj.slug,
                    referrer: 'editor_preview',
                    user_agent: navigator.userAgent
                  })
                  .then(({ error }) => {
                    if (error) console.error('Failed to log page view:', error.message);
                  });
              }
            }}
            className="h-9 px-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
            id="preview-site-btn"
          >
            <Eye size={13} />
            <span>Live Preview</span>
          </button>
          
          <button 
            onClick={() => setShowPublishModal(true)}
            className="h-9 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-lg shadow-blue-500/10 flex items-center gap-1.5"
            id="publish-site-btn"
          >
            <Globe size={13} />
            <span>Publish Site</span>
          </button>
        </div>
      </header>

      {/* ==========================================
          MAIN AREA LAYOUT
          ========================================== */}
      <div className="flex-1 flex w-full overflow-hidden relative">
        
        {/* ==========================================
            LEFT SIDEBAR (280px) - Block selection & Layers
            ========================================== */}
        <aside className="w-[280px] bg-slate-950 border-r border-slate-800 flex flex-col h-full shrink-0 z-10" id="left-sidebar">
          
          {/* Tab Selector buttons */}
          <div className="grid grid-cols-5 border-b border-slate-800 p-1.5 bg-slate-950">
            {[
              { id: 'add-blocks' as const, label: 'Add Blocks', icon: PlusCircle },
              { id: 'pages' as const, label: 'Pages', icon: Files },
              { id: 'layers' as const, label: 'Layers', icon: Layers },
              { id: 'database' as const, label: 'Database', icon: Database },
              { id: 'seo' as const, label: 'SEO', icon: Settings }
            ].map(tab => {
              const Icon = tab.icon;
              const isSelected = leftSidebarTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setLeftSidebarTab(tab.id as any)}
                  className={`py-2 rounded-lg text-[9px] font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    isSelected 
                      ? 'bg-slate-900 text-white border border-slate-800 shadow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                  id={`left-tab-${tab.id}`}
                >
                  <Icon size={13} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Contents */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            
            {/* PAGES TAB */}
            {leftSidebarTab === 'pages' && (
              <div className="space-y-4 text-left" id="pages-manager-panel">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide">Website Pages</p>
                  <button
                    onClick={() => setShowAddPageModal(true)}
                    className="flex items-center gap-1 text-[9px] text-blue-400 hover:text-blue-300 font-extrabold cursor-pointer uppercase bg-blue-950/40 border border-blue-900/40 px-2 py-0.5 rounded"
                  >
                    <Plus size={10} /> Add Page
                  </button>
                </div>
                
                <div className="space-y-1.5">
                  {pages.map(page => {
                    const isActive = page.id === activePageId;
                    return (
                      <div
                        key={page.id}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                          isActive 
                            ? 'bg-blue-950/40 border-blue-800/80 text-blue-300' 
                            : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                        }`}
                      >
                        <button
                          onClick={() => switchActivePage(page.id)}
                          className="flex-1 text-left font-black text-xs cursor-pointer truncate"
                        >
                          <span className="block">{page.name}</span>
                          <span className="block text-[8px] font-mono opacity-60 mt-0.5">{page.slug}</span>
                        </button>
                        
                        {page.name !== 'Home' && page.slug !== '/home' && page.slug !== '/' && (
                          <button
                            onClick={async () => {
                              if (confirm(`Are you sure you want to delete page "${page.name}"? This will delete all its sections.`)) {
                                try {
                                  const { error } = await supabase.from('pages').delete().eq('id', page.id);
                                  if (error) throw error;
                                  setPages(pages.filter(p => p.id !== page.id));
                                  if (isActive) {
                                    const homePage = pages.find(p => p.name === 'Home' || p.slug === '/' || p.slug === 'home') || pages[0];
                                    if (homePage) {
                                      switchActivePage(homePage.id);
                                    }
                                  }
                                  triggerToast(`Page "${page.name}" deleted`, 'success');
                                } catch (err: any) {
                                  triggerToast('Delete failed: ' + err.message, 'error');
                                }
                              }
                            }}
                            className="p-1 hover:bg-red-950 rounded text-slate-500 hover:text-red-400 cursor-pointer"
                          >
                            <Trash2 size={11} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* HISTORICAL REVISIONS FROM SUPABASE */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide flex items-center gap-1.5">
                      <RotateCcw size={11} className="text-amber-400" />
                      <span>Revision History</span>
                    </p>
                    <button
                      onClick={fetchRevisions}
                      className="text-[8px] text-slate-500 hover:text-slate-300 font-bold uppercase transition"
                    >
                      Refresh
                    </button>
                  </div>

                  {revisions.length === 0 ? (
                    <div className="p-3 bg-slate-900/30 border border-slate-800/40 rounded-xl text-center">
                      <p className="text-[9px] text-slate-500 font-medium">No saved revisions logged in database history yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-[220px] overflow-y-auto scrollbar-thin pr-1">
                      {revisions.map((rev) => (
                        <div
                          key={rev.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-900/30 border border-slate-800/50 hover:bg-slate-900/60 transition"
                        >
                          <div className="min-w-0 pr-2">
                            <span className="block text-[9px] font-bold text-slate-300 truncate">
                              {new Date(rev.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(rev.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                            <span className="block text-[8px] font-mono text-slate-500 truncate mt-0.5">
                              {rev.blocks?.length || 0} blocks • {rev.header ? 'header' : 'no-hdr'}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => {
                              if (confirm("Are you sure you want to restore this saved history revision? Current unsaved modifications will be overridden.")) {
                                if (rev.blocks) {
                                  setBlocks(rev.blocks);
                                }
                                if (rev.header) {
                                  setGlobalHeader(rev.header);
                                }
                                if (rev.footer) {
                                  setGlobalFooter(rev.footer);
                                }
                                if (rev.seo_title !== undefined) {
                                  setSeoTitle(rev.seo_title || '');
                                }
                                if (rev.seo_desc !== undefined) {
                                  setSeoDesc(rev.seo_desc || '');
                                }
                                setSaveStatus('dirty');
                                triggerToast("Loaded historical revision onto canvas!", "success");
                              }
                            }}
                            className="px-2 py-1 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-900/30 hover:border-amber-700 text-[8px] font-black text-amber-300 rounded cursor-pointer transition uppercase"
                          >
                            Restore
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}
            
            {/* 1. ADD BLOCKS TAB */}
            {leftSidebarTab === 'add-blocks' && (
              <div className="space-y-6" id="add-blocks-panel">
                
                {/* ✨ BRAND NEW: ONLYPAGE AI COPILOT */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-indigo-500/30 shadow-lg shadow-indigo-950/20 space-y-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />
                  <div className="flex items-center gap-1.5 text-xs font-black text-indigo-400">
                    <Sparkles size={14} className="animate-pulse" />
                    <span>ONLYPAGE AI COPILOT</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">Type visual instructions to completely transform the typography, colors, and layout aesthetics.</p>
                  
                  <div className="space-y-2">
                    <textarea 
                      rows={2}
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g. 'Make it look luxury gold', 'Soft warm pastel', 'Dark high-tech cyber'"
                      className="w-full bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-lg p-2.5 outline-none focus:border-indigo-500 resize-none font-sans"
                    />
                    <button 
                      onClick={handleAiStyling}
                      disabled={isAiLoading}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/50 text-white font-extrabold text-[10px] rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/10"
                    >
                      {isAiLoading ? (
                        <>
                          <RefreshCw size={11} className="animate-spin" />
                          <span>RE-STYLING ASSETS...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={11} />
                          <span>RE-STYLE CANVAS</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 🏢 BRAND NEW: INDUSTRY TEMPLATE PRESETS */}
                <div className="space-y-2">
                  <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Database size={11} className="text-blue-400" />
                    <span>Industry Presets</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(INDUSTRY_PRESETS) as Array<keyof typeof INDUSTRY_PRESETS>).map(key => (
                      <button
                        key={key}
                        onClick={() => handleLoadIndustryPreset(key)}
                        className="p-2 text-left bg-slate-900 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 rounded-lg transition-all cursor-pointer"
                      >
                        <p className="text-[10px] font-black text-slate-200">{key}</p>
                        <p className="text-[8px] text-slate-500 mt-0.5">Template pack</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 🔥 BRAND NEW: LEGO BLOCK VARIANT MARKETPLACE */}
                <div className="space-y-3.5 border-t border-slate-800/80 pt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                      <Layout size={11} className="text-blue-400" />
                      <span>Block Library</span>
                    </p>
                    <span className="text-[9px] text-slate-500 font-mono">Variants Mode</span>
                  </div>

                  {/* Wrapping Categories grid — all categories visible, no horizontal scroll */}
                  <div className="grid grid-cols-2 gap-1.5 pb-1">
                    {BLOCK_CATEGORIES.map(cat => {
                      // Categories whose blocks can bind to CMS collections (dynamic data)
                      const cmsConnectable = cat.id === 'Features' || cat.id === 'Pricing' || cat.id === 'Testimonials';
                      const isForm = cat.id === 'Forms';
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setActiveCategory(cat.id)}
                          className={`relative px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer border text-left flex items-center gap-1 ${
                            activeCategory === cat.id
                              ? 'bg-blue-600 border-blue-500 text-white shadow shadow-blue-500/10'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span className="truncate">{cat.name}</span>
                          {cmsConnectable && (
                            <span
                              title="Connects to your CMS data (Services / Products / Blogs)"
                              className="ml-auto shrink-0 flex items-center gap-0.5 text-[7px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1 py-0.5 rounded"
                            >
                              <Database size={7} /> CMS
                            </span>
                          )}
                          {isForm && (
                            <span
                              title="Captures visitor input into your Forms inbox"
                              className="ml-auto shrink-0 flex items-center gap-0.5 text-[7px] bg-amber-500/15 text-amber-400 border border-amber-500/30 px-1 py-0.5 rounded"
                            >
                              <Mail size={7} /> INPUT
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Curated list of specific premium variants for the active Category */}
                  <div className="space-y-2 pt-1">
                    {BLOCK_VARIANTS_MAP[activeCategory]?.map(v => (
                      <div
                        key={v.id}
                        onClick={() => addBlockVariant(activeCategory, v.id)}
                        className="group p-3 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-blue-600/60 rounded-2xl transition-all cursor-pointer flex items-center justify-between shadow-xs select-none"
                      >
                        <div className="space-y-0.5 text-left">
                          <span className="text-xs font-black text-slate-100 group-hover:text-white uppercase tracking-wider block font-sans">
                            {v.name || v.id.replace(/-/g, ' ')}
                          </span>
                          <span className="text-[9px] text-slate-500 font-medium block">
                            {v.tags?.join(' • ') || 'E-Commerce Component'}
                          </span>
                        </div>
                        <span className="px-2.5 py-1 bg-slate-900 group-hover:bg-blue-600 group-hover:text-white border border-slate-700/80 group-hover:border-blue-500 text-[9px] font-black text-slate-400 rounded-lg transition-all tracking-wider shrink-0">
                          ADD
                        </span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}

            {/* 2. LAYERS TREE TAB */}
            {leftSidebarTab === 'layers' && (
              <div className="space-y-4" id="layers-panel">
                <div>
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wide">Document Layers</h3>
                  <p className="text-[10px] text-slate-500 mt-1">Reorder, select, duplicate, or delete specific node sections on your canvas.</p>
                </div>

                <div className="space-y-1.5">
                  {/* Global Header Layer */}
                  {globalHeader && (
                    <div
                      onClick={() => { setSelectedBlockId('global-header'); setSelectedSubElement(null); }}
                      className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between border ${
                        selectedBlockId === 'global-header' 
                          ? 'bg-blue-600/10 border-blue-500 text-white' 
                          : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] font-mono text-slate-500 shrink-0 bg-slate-900 border border-slate-800/60 w-5 h-5 rounded flex items-center justify-center">L</span>
                        <span className="text-xs font-black truncate">Global Header</span>
                      </div>
                      <span className="text-[8px] font-black text-slate-500 uppercase bg-slate-900 border border-slate-800/60 px-1.5 py-0.5 rounded">Locked Layout</span>
                    </div>
                  )}

                  {blocks.map((block, index) => {
                    const isSelected = selectedBlockId === block.id;
                    const isHovered = hoveredBlockId === block.id;
                    return (
                      <div
                        key={block.id}
                        onMouseEnter={() => setHoveredBlockId(block.id)}
                        onMouseLeave={() => setHoveredBlockId(null)}
                        onClick={() => setSelectedBlockId(block.id)}
                        className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between border ${
                          isSelected 
                            ? 'bg-blue-600/10 border-blue-500 text-white' 
                            : isHovered
                              ? 'bg-slate-900 border-slate-800 text-slate-200'
                              : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[10px] font-mono text-slate-500 shrink-0 bg-slate-900 border border-slate-800/60 w-5 h-5 rounded flex items-center justify-center">#{index + 1}</span>
                          <span className="text-xs font-black truncate">{block.type} Section</span>
                        </div>

                        {/* Layer Actions */}
                        <div className="flex items-center gap-1 opacity-80 hover:opacity-100">
                          <button
                            disabled={index === 0}
                            onClick={(e) => { e.stopPropagation(); handleMoveBlock(index, 'up'); }}
                            className={`p-1 hover:bg-slate-800 rounded text-slate-400 disabled:opacity-20 disabled:pointer-events-none`}
                            title="Move Up"
                          >
                            <MoveUp size={11} />
                          </button>
                          <button
                            disabled={index === blocks.length - 1}
                            onClick={(e) => { e.stopPropagation(); handleMoveBlock(index, 'down'); }}
                            className={`p-1 hover:bg-slate-800 rounded text-slate-400 disabled:opacity-20 disabled:pointer-events-none`}
                            title="Move Down"
                          >
                            <MoveDown size={11} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteBlock(block.id, block.type); }}
                            className="p-1 hover:bg-red-950/40 hover:text-red-400 rounded text-slate-400"
                            title="Delete"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Global Footer Layer */}
                  {globalFooter && (
                    <div
                      onClick={() => { setSelectedBlockId('global-footer'); setSelectedSubElement(null); }}
                      className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between border ${
                        selectedBlockId === 'global-footer' 
                          ? 'bg-blue-600/10 border-blue-500 text-white' 
                          : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] font-mono text-slate-500 shrink-0 bg-slate-900 border border-slate-800/60 w-5 h-5 rounded flex items-center justify-center">L</span>
                        <span className="text-xs font-black truncate">Global Footer</span>
                      </div>
                      <span className="text-[8px] font-black text-slate-500 uppercase bg-slate-900 border border-slate-800/60 px-1.5 py-0.5 rounded">Locked Layout</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. SEO CONFIGURATION TAB */}
            {leftSidebarTab === 'seo' && (
              <div className="space-y-4" id="seo-panel">
                <div>
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wide">SEO Metadata</h3>
                  <p className="text-[10px] text-slate-500 mt-1">Configure search engine crawlers tags to score premium lighthouse rankings.</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">SEO Page Title</label>
                    <input 
                      type="text" 
                      value={seoTitle}
                      onChange={(e) => { setSeoTitle(e.target.value); setSaveStatus('dirty'); }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-blue-500 font-sans"
                      placeholder="Enter optimized title tag..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">SEO Meta Description</label>
                    <textarea 
                      rows={4}
                      value={seoDesc}
                      onChange={(e) => { setSeoDesc(e.target.value); setSaveStatus('dirty'); }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-blue-500 font-sans resize-none"
                      placeholder="Summarize page content to render on search grids..."
                    />
                  </div>

                  <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                      <Globe size={11} className="text-blue-400" />
                      <span>Google Preview Match</span>
                    </p>
                    <p className="text-xs font-bold text-blue-400 truncate hover:underline cursor-pointer">https://my-portfolio.onlypage.in</p>
                    <p className="text-[11px] text-emerald-500 truncate font-mono">{seoTitle || 'Default Title'}</p>
                    <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">{seoDesc || 'Provide description details...'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* DATABASE / COLLECTION MANAGER TAB */}
            {leftSidebarTab === 'database' && (
              <div className="space-y-4 text-left font-sans animate-fade-in" id="database-panel">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <div>
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wide flex items-center gap-1.5">
                      <Database size={12} className="text-indigo-400" />
                      <span>Data Collections</span>
                    </h3>
                    <p className="text-[9px] text-slate-500 mt-0.5 font-medium">Manage zero-code relational collections.</p>
                  </div>
                  {!showAddCollectionForm && (
                    <button
                      onClick={() => setShowAddCollectionForm(true)}
                      className="flex items-center gap-1 text-[9px] text-blue-400 hover:text-blue-300 font-extrabold cursor-pointer uppercase bg-blue-955/40 border border-blue-900/40 px-2 py-1 rounded transition"
                    >
                      <Plus size={10} />
                      <span>Add Table</span>
                    </button>
                  )}
                </div>

                {/* CREATE COLLECTION FORM */}
                {showAddCollectionForm ? (
                  <div className="bg-slate-900/50 border border-slate-850 p-3 rounded-xl space-y-3">
                    <div className="flex justify-between items-center pb-1 border-b border-slate-800">
                      <span className="text-[10px] font-black text-slate-200">New Table Schema</span>
                      <button onClick={() => setShowAddCollectionForm(false)} className="text-[9px] text-slate-500 hover:text-slate-300 cursor-pointer font-bold">Cancel</button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-slate-400 uppercase">Table Name</label>
                        <input 
                          type="text"
                          value={newCollectionName}
                          onChange={(e) => setNewCollectionName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                          placeholder="e.g. team_members"
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs outline-none text-slate-200 focus:border-blue-500 font-mono"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-slate-400 uppercase">Columns Definition</label>
                        <div className="space-y-1 max-h-[100px] overflow-y-auto pr-1">
                          {newCollectionColumns.map((col, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-slate-950/40 p-1.5 rounded border border-slate-850 text-[10px]">
                              <span className="font-mono text-slate-300">{col.name} ({col.type})</span>
                              {idx > 0 && (
                                <button 
                                  onClick={() => setNewCollectionColumns(newCollectionColumns.filter((_, i) => i !== idx))}
                                  className="text-[9px] text-rose-500 hover:underline cursor-pointer"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Add column input inside form */}
                      <div className="flex gap-1.5 bg-slate-950 p-2 rounded border border-slate-850">
                        <input 
                          type="text"
                          value={newColumnName}
                          onChange={(e) => setNewColumnName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                          placeholder="column_name"
                          className="flex-1 bg-transparent text-[10px] outline-none text-slate-200 font-mono"
                        />
                        <select 
                          value={newColumnType}
                          onChange={(e: any) => setNewColumnType(e.target.value)}
                          className="bg-slate-900 text-[10px] text-slate-300 outline-none border border-slate-800 rounded px-1 cursor-pointer"
                        >
                          <option value="text">text</option>
                          <option value="number">number</option>
                          <option value="image">image url</option>
                          <option value="email">email</option>
                          <option value="phone">phone</option>
                        </select>
                        <button
                          onClick={() => {
                            if (!newColumnName.trim()) return;
                            setNewCollectionColumns([...newCollectionColumns, { name: newColumnName.trim(), type: newColumnType }]);
                            setNewColumnName('');
                          }}
                          className="bg-blue-950 hover:bg-blue-900 border border-blue-800 text-blue-350 text-[9px] px-2 rounded font-black cursor-pointer transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <button 
                      onClick={handleCreateCollection}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-black uppercase transition-all shadow-md shadow-blue-600/10 cursor-pointer"
                    >
                      Initialize Database Table
                    </button>
                  </div>
                ) : (
                  <>
                    {/* COLLECTIONS LIST */}
                    {(!site.theme?.customCollections || site.theme.customCollections.length === 0) ? (
                      <div className="p-5 bg-slate-900/30 border border-slate-850 rounded-xl text-center space-y-2 select-none">
                        <Database size={24} className="mx-auto opacity-35 text-slate-500 mb-1" />
                        <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">No custom collections defined. Create a table to start mapping dynamic data to card modules.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Dropdown Selector */}
                        <div className="space-y-1">
                          <label className="text-[8px] font-bold text-slate-500 uppercase tracking-wide block">Active Database Table</label>
                          <div className="relative">
                            <select 
                              value={selectedCollectionName || ''}
                              onChange={(e) => {
                                setSelectedCollectionName(e.target.value || null);
                                setShowAddRowForm(false);
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none cursor-pointer font-bold capitalize"
                            >
                              <option value="">-- Choose collection --</option>
                              {(site.theme.customCollections || []).map((c: any) => (
                                <option key={c.name} value={c.name}>{c.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {selectedCollectionName && (() => {
                          const coll = site.theme.customCollections.find(
                            (c: any) => c.name.toLowerCase() === selectedCollectionName.toLowerCase()
                          );
                          if (!coll) return null;
                          return (
                            <div className="space-y-3">
                              {/* Collection actions */}
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold font-mono uppercase">{coll.rows?.length || 0} rows found</span>
                                <button 
                                  onClick={() => handleDeleteCollection(coll.name)}
                                  className="text-rose-500 hover:text-rose-450 hover:underline uppercase font-black text-[9px] cursor-pointer"
                                >
                                  Drop Table
                                </button>
                              </div>

                              {/* Columns display */}
                              <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-850 space-y-2 text-left">
                                <span className="text-[8px] font-black uppercase text-slate-500 block">Schema fields</span>
                                <div className="flex flex-wrap gap-1">
                                  {coll.columns.map((c: any) => (
                                    <span key={c.name} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-850 font-mono text-[8px] text-slate-400">
                                      {c.name}:{c.type}
                                    </span>
                                  ))}
                                </div>
                                
                                {/* Add column inline */}
                                <div className="flex gap-1 pt-2 border-t border-slate-850/40">
                                  <input 
                                    type="text"
                                    placeholder="new_col"
                                    value={newColumnName}
                                    onChange={(e) => setNewColumnName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                    className="flex-1 bg-slate-950 border border-slate-800 rounded p-1.5 text-[9px] outline-none text-slate-200 font-mono"
                                  />
                                  <select 
                                    value={newColumnType}
                                    onChange={(e: any) => setNewColumnType(e.target.value)}
                                    className="bg-slate-950 border border-slate-800 text-[8px] text-slate-300 outline-none rounded px-0.5 cursor-pointer font-bold"
                                  >
                                    <option value="text">text</option>
                                    <option value="number">number</option>
                                    <option value="image">image</option>
                                    <option value="email">email</option>
                                    <option value="phone">phone</option>
                                  </select>
                                  <button 
                                    onClick={() => handleAddColumn(coll.name)}
                                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] px-2 rounded cursor-pointer font-black"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              {/* ADD ROW CONTROLLER */}
                              {showAddRowForm ? (
                                <div className="p-3.5 bg-slate-900 border border-slate-850 rounded-xl space-y-3 text-left">
                                  <div className="flex justify-between items-center border-b border-slate-850 pb-1.5 mb-2">
                                    <span className="text-[10px] font-black text-slate-200">Insert Row Record</span>
                                    <button onClick={() => setShowAddRowForm(false)} className="text-[9px] text-slate-500 hover:text-slate-300 font-bold cursor-pointer">Cancel</button>
                                  </div>
                                  
                                  <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
                                    {coll.columns.map((c: any) => (
                                      <div key={c.name} className="space-y-1">
                                        <label className="text-[8px] font-black uppercase text-slate-400 block">{c.name}</label>
                                        <input 
                                          type={c.type === 'number' ? 'number' : 'text'}
                                          value={newRowData[c.name] || ''}
                                          onChange={(e) => setNewRowData({ ...newRowData, [c.name]: e.target.value })}
                                          placeholder={`Enter ${c.name}...`}
                                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs outline-none text-slate-200 focus:border-blue-500 font-sans"
                                        />
                                      </div>
                                    ))}
                                  </div>

                                  <button 
                                    onClick={() => handleAddRow(coll.name)}
                                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-black uppercase transition-all shadow-md shadow-blue-600/10 cursor-pointer"
                                  >
                                    Insert Record Row
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setNewRowData({});
                                    setShowAddRowForm(true);
                                  }}
                                  className="w-full py-2 bg-slate-900 border border-slate-850 hover:bg-slate-850 text-slate-200 rounded text-[10px] font-black uppercase transition flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <Plus size={11} />
                                  <span>Insert Row Record</span>
                                </button>
                              )}

                              {/* ROWS TABLE LIST DISPLAY */}
                              <div className="space-y-2 border-t border-slate-850/80 pt-3 text-left">
                                <span className="text-[8px] font-black uppercase text-slate-500 block">Row logs</span>
                                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                                  {(!coll.rows || coll.rows.length === 0) ? (
                                    <div className="p-4 text-center text-slate-600 text-[10px] font-bold italic select-none">
                                      No records found in this table.
                                    </div>
                                  ) : (
                                    coll.rows.map((row: any, rIdx: number) => (
                                      <div key={row.id || rIdx} className="p-3 border border-slate-850 rounded-xl bg-slate-900/20 hover:bg-slate-900/40 transition flex items-start justify-between gap-3 text-[10px]">
                                        <div className="min-w-0 flex-1 space-y-1 font-sans leading-tight">
                                          {coll.columns.map((c: any) => (
                                            <div key={c.name} className="truncate">
                                              <span className="font-mono text-slate-500 uppercase text-[8px] mr-1">{c.name}:</span>
                                              <span className="text-slate-300 font-bold">{row[c.name] || <span className="text-slate-700 italic">null</span>}</span>
                                            </div>
                                          ))}
                                        </div>
                                        <button 
                                          onClick={() => handleDeleteRow(coll.name, row.id)}
                                          className="text-slate-500 hover:text-rose-500 p-0.5 rounded cursor-pointer shrink-0 transition"
                                        >
                                          <X size={11} />
                                        </button>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

          </div>

          {/* Quick System Diagnostics footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/80">
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>CANVAS_NODES: {blocks.length}</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                <span>ONLINE_DB_SYNC</span>
              </span>
            </div>
          </div>
        </aside>

        {/* ==========================================
            CENTRAL CANVAS - Live Preview with Figma-like dots
            ========================================== */}
        <main className="flex-1 bg-slate-900 relative flex flex-col overflow-y-auto scrollbar-thin overflow-x-hidden" id="central-canvas-area">
          
          {/* Figma-grade background design dots */}
          <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Floating Canvas Grid Lines Toggle details */}
          <div className="absolute top-4 left-6 z-20 flex items-center gap-2.5 bg-slate-950/80 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-slate-500">
              <Grid size={11} />
              <span>Canvas Guide</span>
            </span>
            <div className="h-2 w-px bg-slate-800" />
            <span className="text-blue-400">{viewportMode === 'desktop' ? 'Full Width Responsive' : viewportMode === 'tablet' ? '768px Constrained' : '390px Constrained'}</span>
          </div>

          {/* Device Bezel Shell container */}
          <div className="flex-1 w-full py-12 px-4 flex items-start justify-center transition-all duration-300">
            
            {/* Responsiveness constraint wrappers */}
            <div 
              className={`w-full transition-all duration-300 relative ${
                viewportMode === 'tablet' 
                  ? 'max-w-[768px] border-8 border-slate-950 rounded-3xl bg-slate-950 shadow-2xl shadow-black/80' 
                  : viewportMode === 'mobile' 
                    ? 'max-w-[390px] border-[10px] border-slate-950 rounded-[40px] bg-slate-950 shadow-2xl shadow-black/80'
                    : 'max-w-full'
              }`}
              style={{
                minHeight: viewportMode !== 'desktop' ? '720px' : 'auto'
              }}
              id="viewport-frame-wrapper"
            >
              {/* Device Notch for Mobile View */}
              {viewportMode === 'mobile' && (
                <div className="absolute -top-[1px] left-1/2 transform -translate-x-1/2 w-36 h-5 bg-slate-950 rounded-b-2xl z-40 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-slate-900 mr-2" />
                  <div className="w-12 h-1 bg-slate-900 rounded-full" />
                </div>
              )}

              {/* Dynamic Live website view rendering starts here */}
              <div className="w-full bg-white text-slate-900 rounded-lg overflow-hidden shadow-2xl flex flex-col relative" id="live-canvas-preview">
                
                {/* Global Header */}
                {globalHeader && (
                  <div
                    onMouseEnter={() => setHoveredBlockId('global-header')}
                    onMouseLeave={() => setHoveredBlockId(null)}
                    className={`relative group/item ${selectedBlockId === 'global-header' ? 'ring-2 ring-blue-600' : ''}`}
                  >
                    {/* Hover Outline Label Overlay */}
                    {hoveredBlockId === 'global-header' && selectedBlockId !== 'global-header' && (
                      <div className="absolute top-2 left-2 bg-blue-500 text-white text-[9px] font-mono px-2 py-0.5 rounded-md z-30 pointer-events-none shadow">
                        Global Header
                      </div>
                    )}

                    {selectedBlockId === 'global-header' && (
                      <>
                        <div className="absolute -top-11 left-4 bg-slate-950 border border-slate-800 rounded-xl p-1 shadow-2xl z-30 flex items-center gap-1 text-slate-100">
                          <span className="text-[9px] text-slate-400 font-mono px-2 border-r border-slate-800">Global Header</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); setAiAssistantBlockId('global-header'); setAiAssistantPrompt(''); }}
                            className="p-1 hover:bg-slate-900 rounded-lg text-indigo-400 hover:text-indigo-300 cursor-pointer flex items-center gap-1 font-bold text-[9px] px-1.5 border border-indigo-950 bg-indigo-950/20"
                            title="Ask AI to edit Header"
                          >
                            <Sparkles size={11} />
                            <span>Ask AI</span>
                          </button>
                        </div>
                        <div className="absolute top-0 left-0 w-2.5 h-2.5 bg-white border-2 border-blue-600 rounded-full z-30 pointer-events-none" />
                        <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-white border-2 border-blue-600 rounded-full z-30 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 bg-white border-2 border-blue-600 rounded-full z-30 pointer-events-none" />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-white border-2 border-blue-600 rounded-full z-30 pointer-events-none" />
                      </>
                    )}

                    <BuilderRenderer 
                      block={globalHeader} 
                      isActive={selectedBlockId === 'global-header'} 
                      selectedSubElement={selectedBlockId === 'global-header' ? selectedSubElement : null}
                      onSelect={() => {
                        setSelectedBlockId('global-header');
                        setSelectedSubElement(null);
                      }} 
                      onSelectSubElement={(subId) => {
                        setSelectedBlockId('global-header');
                        setSelectedSubElement(subId);
                      }}
                      siteId={site.id}
                      pages={pages}
                      site={site}
                      activePageId={activePageId}
                    />
                  </div>
                )}

                {blocks.map((block, index) => {
                  const isSelected = selectedBlockId === block.id;
                  const isHovered = hoveredBlockId === block.id;

                  return (
                    <div
                      key={block.id}
                      onMouseEnter={() => setHoveredBlockId(block.id)}
                      onMouseLeave={() => setHoveredBlockId(null)}
                      className="relative group/item"
                    >
                      {/* Hover Outline Label Overlay */}
                      {isHovered && !isSelected && (
                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-[9px] font-mono px-2 py-0.5 rounded-md z-30 pointer-events-none shadow">
                          {block.type} Section
                        </div>
                      )}

                      {isSelected && (
                        <>
                          {/* Floating Selected Block Badge */}
                          <div className="absolute -top-3 left-4 bg-blue-600 text-white text-[9px] font-mono px-2.5 py-0.5 rounded-md z-30 flex items-center gap-1 shadow shadow-blue-500/20">
                            <span>Selected Block:</span>
                            <span className="font-extrabold text-[10px]">{block.type} ({block.variant || 'default'})</span>
                          </div>

                          {/* Floating Quick Action Overlay controls */}
                          <div className="absolute -top-11 right-4 bg-slate-950 border border-slate-800 rounded-xl p-1 shadow-2xl z-30 flex items-center gap-1 text-slate-100">
                            <span className="text-[9px] text-slate-400 font-mono px-2 border-r border-slate-800">{block.type}</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); setAiAssistantBlockId(block.id); setAiAssistantPrompt(''); }}
                              className="p-1 hover:bg-slate-900 rounded-lg text-indigo-400 hover:text-indigo-300 cursor-pointer flex items-center gap-1 font-bold text-[9px] px-1.5 border border-r border-indigo-950 bg-indigo-950/20"
                              title="Ask AI to edit this section"
                            >
                              <Sparkles size={11} />
                              <span>Ask AI</span>
                            </button>
                            <button
                              disabled={index === 0}
                              onClick={(e) => { e.stopPropagation(); handleMoveBlock(index, 'up'); }}
                              className="p-1 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white cursor-pointer disabled:opacity-20"
                              title="Move Section Up"
                            >
                              <MoveUp size={11} />
                            </button>
                            <button
                              disabled={index === blocks.length - 1}
                              onClick={(e) => { e.stopPropagation(); handleMoveBlock(index, 'down'); }}
                              className="p-1 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white cursor-pointer disabled:opacity-20"
                              title="Move Section Down"
                            >
                              <MoveDown size={11} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDuplicateBlock(block); }}
                              className="p-1 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                              title="Duplicate Section"
                            >
                              <Copy size={11} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteBlock(block.id, block.type); }}
                              className="p-1 hover:bg-red-950 text-red-400 rounded-lg cursor-pointer"
                              title="Delete Section"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>

                          {/* Authentic Figma handles (Circles at corners) */}
                          <div className="absolute top-0 left-0 w-2.5 h-2.5 bg-white border-2 border-blue-600 rounded-full z-30 pointer-events-none" />
                          <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-white border-2 border-blue-600 rounded-full z-30 pointer-events-none" />
                          <div className="absolute bottom-0 left-0 w-2.5 h-2.5 bg-white border-2 border-blue-600 rounded-full z-30 pointer-events-none" />
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-white border-2 border-blue-600 rounded-full z-30 pointer-events-none" />
                        </>
                      )}

                      <BuilderRenderer 
                        block={block} 
                        isActive={isSelected} 
                        selectedSubElement={selectedSubElement}
                        onSelect={() => {
                          setSelectedBlockId(block.id);
                          setSelectedSubElement(null);
                        }} 
                        onSelectSubElement={(subId) => {
                          setSelectedBlockId(block.id);
                          setSelectedSubElement(subId);
                        }}
                        siteId={site.id}
                        pages={pages}
                        site={site}
                        activePageId={activePageId}
                      />
                    </div>
                  );
                })}

                {/* Global Footer */}
                {globalFooter && (
                  <div
                    onMouseEnter={() => setHoveredBlockId('global-footer')}
                    onMouseLeave={() => setHoveredBlockId(null)}
                    className={`relative group/item ${selectedBlockId === 'global-footer' ? 'ring-2 ring-blue-600' : ''}`}
                  >
                    {/* Hover Outline Label Overlay */}
                    {hoveredBlockId === 'global-footer' && selectedBlockId !== 'global-footer' && (
                      <div className="absolute top-2 left-2 bg-blue-500 text-white text-[9px] font-mono px-2 py-0.5 rounded-md z-30 pointer-events-none shadow">
                        Global Footer
                      </div>
                    )}

                    {selectedBlockId === 'global-footer' && (
                      <>
                        <div className="absolute -top-11 left-4 bg-slate-950 border border-slate-800 rounded-xl p-1 shadow-2xl z-30 flex items-center gap-1 text-slate-100">
                          <span className="text-[9px] text-slate-400 font-mono px-2 border-r border-slate-800">Global Footer</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); setAiAssistantBlockId('global-footer'); setAiAssistantPrompt(''); }}
                            className="p-1 hover:bg-slate-900 rounded-lg text-indigo-400 hover:text-indigo-300 cursor-pointer flex items-center gap-1 font-bold text-[9px] px-1.5 border border-indigo-950 bg-indigo-950/20"
                            title="Ask AI to edit Footer"
                          >
                            <Sparkles size={11} />
                            <span>Ask AI</span>
                          </button>
                        </div>
                        <div className="absolute top-0 left-0 w-2.5 h-2.5 bg-white border-2 border-blue-600 rounded-full z-30 pointer-events-none" />
                        <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-white border-2 border-blue-600 rounded-full z-30 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 bg-white border-2 border-blue-600 rounded-full z-30 pointer-events-none" />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-white border-2 border-blue-600 rounded-full z-30 pointer-events-none" />
                      </>
                    )}

                    <BuilderRenderer 
                      block={globalFooter} 
                      isActive={selectedBlockId === 'global-footer'} 
                      selectedSubElement={selectedBlockId === 'global-footer' ? selectedSubElement : null}
                      onSelect={() => {
                        setSelectedBlockId('global-footer');
                        setSelectedSubElement(null);
                      }} 
                      onSelectSubElement={(subId) => {
                        setSelectedBlockId('global-footer');
                        setSelectedSubElement(subId);
                      }}
                      siteId={site.id}
                      pages={pages}
                      site={site}
                      activePageId={activePageId}
                    />
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Canvas Bottom Instructions */}
          <div className="py-6 text-center text-[11px] text-slate-500 font-medium">
            <span>💡 Pro Tip: Hover and click any block section to open active CSS inspector attributes.</span>
          </div>
        </main>

        {/* ==========================================
            RIGHT SIDEBAR (300px) - Interactive CSS Inspector
            ========================================== */}
        <aside className="w-[300px] bg-slate-950 border-l border-slate-800 flex flex-col h-full shrink-0 z-10" id="right-sidebar">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-blue-500" />
              <span className="text-xs font-black uppercase text-slate-200 tracking-wider">Properties Inspector</span>
            </div>
            {selectedBlock && (
              <span className="text-[9px] bg-blue-900/30 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-md font-mono font-black">{selectedBlock.type}</span>
            )}
          </div>

          {/* Active selection diagnostics */}
          {!selectedBlock ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-3">
              <Compass size={32} className="text-slate-700 animate-spin" style={{ animationDuration: '8s' }} />
              <div>
                <p className="text-xs font-bold text-slate-400">No Block Inspected</p>
                <p className="text-[10px] text-slate-500 mt-1">Select any visual section on the central canvas to edit styling, layout and copy nodes.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Tab Selector: Content Copy vs. CSS Styles */}
              <div className="flex border-b border-slate-800 p-1 bg-slate-950/80">
                <button
                  onClick={() => setRightInspectorTab('css-styles')}
                  className={`flex-1 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    rightInspectorTab === 'css-styles' 
                      ? 'bg-slate-900 text-white border border-slate-800' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Design (CSS)
                </button>
                <button
                  onClick={() => setRightInspectorTab('content')}
                  className={`flex-1 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    rightInspectorTab === 'content' 
                      ? 'bg-slate-900 text-white border border-slate-800' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Content Copy
                </button>
              </div>

              {/* Inspector Content Grid */}
              <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
                
                {/* 1. DESIGN / CSS TAB */}
                {rightInspectorTab === 'css-styles' && (
                  <div className="space-y-5" id="design-inspector-panel">
                    
                    {/* Layer selection controls */}
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Layers size={10} className="text-blue-500" />
                          <span>Layer Selector</span>
                        </span>
                        {selectedSubElement && (
                          <button 
                            onClick={() => setSelectedSubElement(null)} 
                            className="text-[8px] text-blue-400 hover:text-blue-300 font-extrabold uppercase bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 cursor-pointer"
                          >
                            Reset To Section
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-4 gap-1">
                        {([
                          { id: null, label: 'Section' },
                          { id: 'title', label: 'Title' },
                          { id: 'subtitle', label: 'Sub' },
                          { id: 'button', label: 'Button' },
                          { id: 'card', label: 'Card' },
                          { id: 'media', label: 'Media' },
                          { id: 'badge', label: 'Badge' },
                        ] as const).map((item) => {
                          const hasElement = 
                            item.id === null || 
                            (item.id === 'title' && selectedBlock.title) ||
                            (item.id === 'subtitle' && selectedBlock.subtitle) ||
                            (item.id === 'button' && selectedBlock.btnText) ||
                            (item.id === 'badge' && selectedBlock.badge) ||
                            (item.id === 'media' && (selectedBlock.imageUrl || selectedBlock.type === 'Gallery' || selectedBlock.galleryImages)) ||
                            (item.id === 'card' && (selectedBlock.features || selectedBlock.pricing || selectedBlock.testimonials || selectedBlock.faqs || selectedBlock.stats || selectedBlock.steps));
                            
                          if (!hasElement) return null;
                          
                          return (
                            <button
                              key={item.id || 'block'}
                              onClick={() => setSelectedSubElement(item.id)}
                              className={`py-1 px-1 text-[8px] font-extrabold uppercase rounded transition-all cursor-pointer ${
                                selectedSubElement === item.id 
                                  ? 'bg-blue-600 text-white border border-blue-500' 
                                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                              }`}
                            >
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* IF A SUB-ELEMENT IS SELECTED, SHOW ELEMENT-SPECIFIC DESIGN CONTROLS */}
                    {selectedSubElement !== null ? (
                      <div className="space-y-4">
                        
                        {/* 1. TITLE CONTROLS */}
                        {selectedSubElement === 'title' && (
                          <div className="space-y-3.5 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/80">
                            <p className="text-[10px] font-extrabold uppercase text-blue-400 tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                              <Type size={11} />
                              <span>Style Heading Title</span>
                            </p>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Title Font Family</label>
                              <select 
                                value={(selectedBlock.styles as any).titleFontFamily || selectedBlock.styles.fontFamily}
                                onChange={(e) => handleUpdateBlockStyle('titleFontFamily' as any, e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none cursor-pointer"
                              >
                                <option value="">Same as Section Font</option>
                                {GOOGLE_FONTS_LIST.map((font) => (
                                  <option key={font} value={font}>{font}</option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Heading Size</label>
                              <div className="flex justify-between text-[9px] font-semibold text-slate-400">
                                <span className="text-blue-400">{(selectedBlock.styles as any).titleFontSize || selectedBlock.styles.titleSize}px</span>
                              </div>
                              <input 
                                type="range" 
                                min="14" 
                                max="100" 
                                value={(selectedBlock.styles as any).titleFontSize || selectedBlock.styles.titleSize}
                                onChange={(e) => handleUpdateBlockStyle('titleFontSize' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Heading Weight</label>
                              <select 
                                value={(selectedBlock.styles as any).titleFontWeight || selectedBlock.styles.titleWeight}
                                onChange={(e) => handleUpdateBlockStyle('titleFontWeight' as any, e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none"
                              >
                                <option value="light">Light (300)</option>
                                <option value="normal">Normal (400)</option>
                                <option value="semibold">Semibold (600)</option>
                                <option value="bold">Bold (700)</option>
                                <option value="black">Black (900)</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 block">Title Color</label>
                              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                                <input 
                                  type="color" 
                                  value={(selectedBlock.styles as any).titleColor || selectedBlock.styles.textColor}
                                  onChange={(e) => handleUpdateBlockStyle('titleColor' as any, e.target.value)}
                                  className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-[10px] font-mono text-slate-300 uppercase">{(selectedBlock.styles as any).titleColor || selectedBlock.styles.textColor}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Line Height</label>
                              <input 
                                type="range" 
                                min="0.8" 
                                max="2.5" 
                                step="0.1"
                                value={(selectedBlock.styles as any).titleLineHeight || selectedBlock.styles.lineHeight || 1.2}
                                onChange={(e) => handleUpdateBlockStyle('titleLineHeight' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Title Padding</label>
                              <input 
                                type="range" 
                                min="0" 
                                max="50" 
                                value={(selectedBlock.styles as any).titlePadding || 0}
                                onChange={(e) => handleUpdateBlockStyle('titlePadding' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>
                          </div>
                        )}

                        {/* 2. SUBTITLE CONTROLS */}
                        {selectedSubElement === 'subtitle' && (
                          <div className="space-y-3.5 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/80">
                            <p className="text-[10px] font-extrabold uppercase text-blue-400 tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                              <Type size={11} />
                              <span>Style Subtitle Copy</span>
                            </p>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Subtitle Font Family</label>
                              <select 
                                value={(selectedBlock.styles as any).subtitleFontFamily || selectedBlock.styles.fontFamily}
                                onChange={(e) => handleUpdateBlockStyle('subtitleFontFamily' as any, e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none cursor-pointer"
                              >
                                <option value="">Same as Section Font</option>
                                {GOOGLE_FONTS_LIST.map((font) => (
                                  <option key={font} value={font}>{font}</option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Subtitle Size</label>
                              <div className="flex justify-between text-[9px] font-semibold text-slate-400">
                                <span className="text-blue-400">{(selectedBlock.styles as any).subtitleFontSize || selectedBlock.styles.subtitleSize}px</span>
                              </div>
                              <input 
                                type="range" 
                                min="11" 
                                max="48" 
                                value={(selectedBlock.styles as any).subtitleFontSize || selectedBlock.styles.subtitleSize}
                                onChange={(e) => handleUpdateBlockStyle('subtitleFontSize' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 block">Subtitle Color</label>
                              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                                <input 
                                  type="color" 
                                  value={(selectedBlock.styles as any).subtitleColor || selectedBlock.styles.subtitleColor || '#94a3b8'}
                                  onChange={(e) => handleUpdateBlockStyle('subtitleColor' as any, e.target.value)}
                                  className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-[10px] font-mono text-slate-300 uppercase">{(selectedBlock.styles as any).subtitleColor || '#94a3b8'}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Subtitle Weight</label>
                              <select 
                                value={(selectedBlock.styles as any).subtitleFontWeight || 'normal'}
                                onChange={(e) => handleUpdateBlockStyle('subtitleFontWeight' as any, e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none"
                              >
                                <option value="normal">Normal (400)</option>
                                <option value="bold">Bold (700)</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Subtitle Padding</label>
                              <input 
                                type="range" 
                                min="0" 
                                max="40" 
                                value={(selectedBlock.styles as any).subtitlePadding || 0}
                                onChange={(e) => handleUpdateBlockStyle('subtitlePadding' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>
                          </div>
                        )}

                        {/* 3. BADGE CONTROLS */}
                        {selectedSubElement === 'badge' && (
                          <div className="space-y-3.5 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/80">
                            <p className="text-[10px] font-extrabold uppercase text-blue-400 tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                              <Award size={11} />
                              <span>Style Header Badge</span>
                            </p>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 block">Badge Bg Color</label>
                              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                                <input 
                                  type="color" 
                                  value={(selectedBlock.styles as any).badgeBgColor || selectedBlock.styles.badgeBgColor || '#2563eb'}
                                  onChange={(e) => handleUpdateBlockStyle('badgeBgColor' as any, e.target.value)}
                                  className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-[10px] font-mono text-slate-300 uppercase">{(selectedBlock.styles as any).badgeBgColor || '#2563eb'}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 block">Badge Text Color</label>
                              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                                <input 
                                  type="color" 
                                  value={(selectedBlock.styles as any).badgeTextColor || selectedBlock.styles.badgeTextColor || '#ffffff'}
                                  onChange={(e) => handleUpdateBlockStyle('badgeTextColor' as any, e.target.value)}
                                  className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-[10px] font-mono text-slate-300 uppercase">{(selectedBlock.styles as any).badgeTextColor || '#ffffff'}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Badge Font Size</label>
                              <input 
                                type="range" 
                                min="8" 
                                max="16" 
                                value={(selectedBlock.styles as any).badgeFontSize || 10}
                                onChange={(e) => handleUpdateBlockStyle('badgeFontSize' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Border Radius</label>
                              <input 
                                type="range" 
                                min="0" 
                                max="30" 
                                value={(selectedBlock.styles as any).badgeBorderRadius !== undefined ? (selectedBlock.styles as any).badgeBorderRadius : 9999}
                                onChange={(e) => handleUpdateBlockStyle('badgeBorderRadius' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Border Width</label>
                              <input 
                                type="range" 
                                min="0" 
                                max="4" 
                                value={(selectedBlock.styles as any).badgeBorderWidth || 1}
                                onChange={(e) => handleUpdateBlockStyle('badgeBorderWidth' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 block">Border Color</label>
                              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                                <input 
                                  type="color" 
                                  value={(selectedBlock.styles as any).badgeBorderColor || '#ffffff'}
                                  onChange={(e) => handleUpdateBlockStyle('badgeBorderColor' as any, e.target.value)}
                                  className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-[10px] font-mono text-slate-300 uppercase">{(selectedBlock.styles as any).badgeBorderColor || '#ffffff'}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 4. BUTTON CONTROLS */}
                        {selectedSubElement === 'button' && (
                          <div className="space-y-3.5 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/80">
                            <p className="text-[10px] font-extrabold uppercase text-blue-400 tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                              <Compass size={11} />
                              <span>Style CTA Button</span>
                            </p>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 block">Btn Background Color</label>
                              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                                <input 
                                  type="color" 
                                  value={(selectedBlock.styles as any).buttonBgColor || selectedBlock.styles.buttonBgColor || '#3b82f6'}
                                  onChange={(e) => handleUpdateBlockStyle('buttonBgColor' as any, e.target.value)}
                                  className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-[10px] font-mono text-slate-300 uppercase">{(selectedBlock.styles as any).buttonBgColor || '#3b82f6'}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 block">Btn Text Color</label>
                              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                                <input 
                                  type="color" 
                                  value={(selectedBlock.styles as any).buttonTextColor || selectedBlock.styles.buttonTextColor || '#ffffff'}
                                  onChange={(e) => handleUpdateBlockStyle('buttonTextColor' as any, e.target.value)}
                                  className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-[10px] font-mono text-slate-300 uppercase">{(selectedBlock.styles as any).buttonTextColor || '#ffffff'}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Btn Font Size</label>
                              <input 
                                type="range" 
                                min="10" 
                                max="24" 
                                value={(selectedBlock.styles as any).buttonFontSize || 14}
                                onChange={(e) => handleUpdateBlockStyle('buttonFontSize' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Border Radius</label>
                              <input 
                                type="range" 
                                min="0" 
                                max="40" 
                                value={(selectedBlock.styles as any).buttonBorderRadius !== undefined ? (selectedBlock.styles as any).buttonBorderRadius : 8}
                                onChange={(e) => handleUpdateBlockStyle('buttonBorderRadius' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Button Shadow</label>
                              <select 
                                value={(selectedBlock.styles as any).buttonShadow || 'none'}
                                onChange={(e) => handleUpdateBlockStyle('buttonShadow' as any, e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none"
                              >
                                <option value="none">None (Flat)</option>
                                <option value="sm">Soft Elevation</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Border Width</label>
                              <input 
                                type="range" 
                                min="0" 
                                max="4" 
                                value={(selectedBlock.styles as any).buttonBorderWidth || 0}
                                onChange={(e) => handleUpdateBlockStyle('buttonBorderWidth' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 block">Border Color</label>
                              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                                <input 
                                  type="color" 
                                  value={(selectedBlock.styles as any).buttonBorderColor || '#ffffff'}
                                  onChange={(e) => handleUpdateBlockStyle('buttonBorderColor' as any, e.target.value)}
                                  className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-[10px] font-mono text-slate-300 uppercase">{(selectedBlock.styles as any).buttonBorderColor || '#ffffff'}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 5. CARD CONTROLS */}
                        {selectedSubElement === 'card' && (
                          <div className="space-y-3.5 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/80">
                            <p className="text-[10px] font-extrabold uppercase text-blue-400 tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                              <Grid size={11} />
                              <span>Style Sub-item Cards</span>
                            </p>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 block">Card Bg Color</label>
                              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                                <input 
                                  type="color" 
                                  value={(selectedBlock.styles as any).cardBgColor || selectedBlock.styles.cardBgColor || '#1e293b'}
                                  onChange={(e) => handleUpdateBlockStyle('cardBgColor' as any, e.target.value)}
                                  className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-[10px] font-mono text-slate-300 uppercase">{(selectedBlock.styles as any).cardBgColor || '#1e293b'}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 block">Card Text Color</label>
                              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                                <input 
                                  type="color" 
                                  value={(selectedBlock.styles as any).cardTextColor || selectedBlock.styles.textColor || '#ffffff'}
                                  onChange={(e) => handleUpdateBlockStyle('cardTextColor' as any, e.target.value)}
                                  className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-[10px] font-mono text-slate-300 uppercase">{(selectedBlock.styles as any).cardTextColor || '#ffffff'}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Card Border Radius</label>
                              <input 
                                type="range" 
                                min="0" 
                                max="40" 
                                value={(selectedBlock.styles as any).cardBorderRadius !== undefined ? (selectedBlock.styles as any).cardBorderRadius : 12}
                                onChange={(e) => handleUpdateBlockStyle('cardBorderRadius' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Card Border Width</label>
                              <input 
                                type="range" 
                                min="0" 
                                max="10" 
                                value={(selectedBlock.styles as any).cardBorderWidth !== undefined ? (selectedBlock.styles as any).cardBorderWidth : 1}
                                onChange={(e) => handleUpdateBlockStyle('cardBorderWidth' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 block">Card Border Color</label>
                              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                                <input 
                                  type="color" 
                                  value={(selectedBlock.styles as any).cardBorderColor || '#334155'}
                                  onChange={(e) => handleUpdateBlockStyle('cardBorderColor' as any, e.target.value)}
                                  className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-[10px] font-mono text-slate-300 uppercase">{(selectedBlock.styles as any).cardBorderColor || '#334155'}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Card Shadow</label>
                              <select 
                                value={(selectedBlock.styles as any).cardShadow || 'none'}
                                onChange={(e) => handleUpdateBlockStyle('cardShadow' as any, e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none"
                              >
                                <option value="none">None</option>
                                <option value="sm">sm</option>
                                <option value="md">md</option>
                                <option value="lg">lg</option>
                                <option value="xl">xl</option>
                                <option value="2xl">2xl</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Card Inner Padding</label>
                              <input 
                                type="range" 
                                min="8" 
                                max="64" 
                                value={(selectedBlock.styles as any).cardPadding !== undefined ? (selectedBlock.styles as any).cardPadding : 24}
                                onChange={(e) => handleUpdateBlockStyle('cardPadding' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>
                          </div>
                        )}

                        {/* 6. MEDIA CONTROLS */}
                        {selectedSubElement === 'media' && (
                          <div className="space-y-3.5 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/80">
                            <p className="text-[10px] font-extrabold uppercase text-blue-400 tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                              <ImageIcon size={11} />
                              <span>Style Image Shapes & Filters</span>
                            </p>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 block">Shape Mask Clipping</label>
                              <select 
                                value={(selectedBlock.styles as any).mediaShape || 'none'}
                                onChange={(e) => handleUpdateBlockStyle('mediaShape' as any, e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none cursor-pointer"
                              >
                                <option value="none">Square / Default Layout</option>
                                <option value="circle">Perfect Circle mask</option>
                                <option value="hexagon">Futuristic Hexagon</option>
                                <option value="triangle">Triangle Geometry</option>
                                <option value="star">Modern 5-Point Star</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 block">Visual Tone Filter</label>
                              <select 
                                value={(selectedBlock.styles as any).mediaFilter || 'none'}
                                onChange={(e) => handleUpdateBlockStyle('mediaFilter' as any, e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none cursor-pointer"
                              >
                                <option value="none">No Filter (Full Color)</option>
                                <option value="grayscale">Elegant Grayscale</option>
                                <option value="blur">Soft Ambient Blur</option>
                                <option value="sepia">Warm Sepia Retro</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Media Border Radius</label>
                              <input 
                                type="range" 
                                min="0" 
                                max="60" 
                                value={(selectedBlock.styles as any).mediaBorderRadius !== undefined ? (selectedBlock.styles as any).mediaBorderRadius : 16}
                                onChange={(e) => handleUpdateBlockStyle('mediaBorderRadius' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Media Border Width</label>
                              <input 
                                type="range" 
                                min="0" 
                                max="12" 
                                value={(selectedBlock.styles as any).mediaBorderWidth || 0}
                                onChange={(e) => handleUpdateBlockStyle('mediaBorderWidth' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 block">Media Border Color</label>
                              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                                <input 
                                  type="color" 
                                  value={(selectedBlock.styles as any).mediaBorderColor || '#ffffff'}
                                  onChange={(e) => handleUpdateBlockStyle('mediaBorderColor' as any, e.target.value)}
                                  className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-[10px] font-mono text-slate-300 uppercase">{(selectedBlock.styles as any).mediaBorderColor || '#ffffff'}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Media Shadow</label>
                              <select 
                                value={(selectedBlock.styles as any).mediaShadow || 'none'}
                                onChange={(e) => handleUpdateBlockStyle('mediaShadow' as any, e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none"
                              >
                                <option value="none">Flat (No Shadow)</option>
                                <option value="sm">Soft Elevation</option>
                              </select>
                            </div>
                          </div>
                        )}
                        
                        <button
                          onClick={() => setSelectedSubElement(null)}
                          className="w-full py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-white rounded-xl text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <SlidersHorizontal size={12} />
                          <span>Show All Section Design Settings</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* ACCORDION GROUP: BACKGROUND & COLOR */}
                        <div className="space-y-3">
                          <p className="text-[10px] font-extrabold uppercase text-slate-500 tracking-widest flex items-center gap-1.5">
                            <Palette size={11} className="text-blue-400" />
                            <span>Background & Colors</span>
                          </p>

                          <div className="space-y-3 bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
                            {/* Use Gradient Toggle */}
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] font-bold text-slate-400">Gradient Fill</label>
                              <input 
                                type="checkbox" 
                                checked={selectedBlock.styles.useGradient}
                                onChange={(e) => handleUpdateBlockStyle('useGradient', e.target.checked)}
                                className="cursor-pointer"
                              />
                            </div>

                        {selectedBlock.styles.useGradient ? (
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 block">Gradient CSS</label>
                            <input 
                              type="text" 
                              value={selectedBlock.styles.backgroundGradient}
                              onChange={(e) => handleUpdateBlockStyle('backgroundGradient', e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-300 font-mono"
                            />
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400 block">Bg Color</label>
                              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                                <input 
                                  type="color" 
                                  value={selectedBlock.styles.backgroundColor}
                                  onChange={(e) => handleUpdateBlockStyle('backgroundColor', e.target.value)}
                                  className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-[10px] font-mono text-slate-300 uppercase">{selectedBlock.styles.backgroundColor}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400 block">Text Color</label>
                              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                                <input 
                                  type="color" 
                                  value={selectedBlock.styles.textColor}
                                  onChange={(e) => handleUpdateBlockStyle('textColor', e.target.value)}
                                  className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-[10px] font-mono text-slate-300 uppercase">{selectedBlock.styles.textColor}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400 block">Accent Color</label>
                            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                              <input 
                                type="color" 
                                value={selectedBlock.styles.accentColor}
                                onChange={(e) => handleUpdateBlockStyle('accentColor', e.target.value)}
                                className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                              />
                              <span className="text-[10px] font-mono text-slate-300 uppercase">{selectedBlock.styles.accentColor}</span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400 block">Btn Color</label>
                            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                              <input 
                                type="color" 
                                value={selectedBlock.styles.buttonBgColor}
                                onChange={(e) => handleUpdateBlockStyle('buttonBgColor', e.target.value)}
                                className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                              />
                              <span className="text-[10px] font-mono text-slate-300 uppercase">{selectedBlock.styles.buttonBgColor}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ACCORDION GROUP: TYPOGRAPHY */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-extrabold uppercase text-slate-500 tracking-widest flex items-center gap-1.5">
                        <Type size={11} className="text-blue-400" />
                        <span>Typography & Alignment</span>
                      </p>

                      <div className="space-y-3.5 bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
                        {/* Font Family */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">Font Family</label>
                          <select 
                            value={selectedBlock.styles.fontFamily}
                            onChange={(e) => handleUpdateBlockStyle('fontFamily', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none cursor-pointer"
                          >
                            <optgroup label="SANS-SERIF (Clean & Modern)" className="bg-slate-950 text-slate-300">
                              <option value="Inter">Inter</option>
                              <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                              <option value="Poppins">Poppins</option>
                              <option value="Montserrat">Montserrat</option>
                              <option value="Open Sans">Open Sans</option>
                              <option value="Roboto">Roboto</option>
                              <option value="Lato">Lato</option>
                              <option value="Raleway">Raleway</option>
                              <option value="DM Sans">DM Sans</option>
                              <option value="Nunito">Nunito</option>
                              <option value="Albert Sans">Albert Sans</option>
                            </optgroup>
                            <optgroup label="SERIF (Classic & Editorial)" className="bg-slate-950 text-slate-300">
                              <option value="Playfair Display">Playfair Display</option>
                              <option value="Merriweather">Merriweather</option>
                              <option value="Lora">Lora</option>
                              <option value="Cormorant Garamond">Cormorant Garamond</option>
                              <option value="EB Garamond">EB Garamond</option>
                              <option value="Georgia">Georgia</option>
                            </optgroup>
                            <optgroup label="DISPLAY (Bold & Distinct)" className="bg-slate-950 text-slate-300">
                              <option value="Space Grotesk">Space Grotesk</option>
                              <option value="Outfit">Outfit</option>
                              <option value="Syne">Syne</option>
                              <option value="Oswald">Oswald</option>
                              <option value="Bebas Neue">Bebas Neue</option>
                              <option value="Cinzel">Cinzel</option>
                              <option value="Lexend">Lexend</option>
                            </optgroup>
                            <optgroup label="MONOSPACE (Tech & Code)" className="bg-slate-950 text-slate-300">
                              <option value="JetBrains Mono">JetBrains Mono</option>
                              <option value="Fira Code">Fira Code</option>
                              <option value="Space Mono">Space Mono</option>
                              <option value="Source Code Pro">Source Code Pro</option>
                            </optgroup>
                            <optgroup label="CREATIVE & HANDWRITING" className="bg-slate-950 text-slate-300">
                              <option value="Caveat">Caveat</option>
                              <option value="Pacifico">Pacifico</option>
                              <option value="Shadows Into Light">Shadows Into Light</option>
                              <option value="Great Vibes">Great Vibes</option>
                              <option value="Architects Daughter">Architects Daughter</option>
                              <option value="Dancing Script">Dancing Script</option>
                            </optgroup>
                          </select>
                        </div>

                        {/* Title Font Size Slider */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400">
                            <span>Heading Size</span>
                            <span className="text-blue-400">{selectedBlock.styles.titleSize}px</span>
                          </div>
                          <input 
                            type="range" 
                            min="20" 
                            max="80" 
                            value={selectedBlock.styles.titleSize}
                            onChange={(e) => handleUpdateBlockStyle('titleSize', Number(e.target.value))}
                            className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                          />
                        </div>

                        {/* Heading Weight */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">Heading Weight</label>
                          <select 
                            value={selectedBlock.styles.titleWeight}
                            onChange={(e) => handleUpdateBlockStyle('titleWeight', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none"
                          >
                            <option value="light">Light (300)</option>
                            <option value="normal">Normal (400)</option>
                            <option value="semibold">Semibold (600)</option>
                            <option value="bold">Bold (700)</option>
                            <option value="black">Black (900)</option>
                          </select>
                        </div>

                        {/* Alignment Buttons */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">Text Align</label>
                          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                            {['left', 'center', 'right'].map(align => (
                              <button
                                key={align}
                                onClick={() => handleUpdateBlockStyle('textAlign', align)}
                                className={`py-1 rounded text-[10px] font-extrabold capitalize cursor-pointer transition-all ${
                                  selectedBlock.styles.textAlign === align 
                                    ? 'bg-blue-600 text-white' 
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                              >
                                {align}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ACCORDION GROUP: SPACING */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-extrabold uppercase text-slate-500 tracking-widest flex items-center gap-1.5">
                        <SlidersHorizontal size={11} className="text-blue-400" />
                        <span>Figma Spacing</span>
                      </p>

                      <div className="space-y-3.5 bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
                        {/* Padding Top */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400">
                            <span>Padding Top</span>
                            <span className="text-blue-400">{selectedBlock.styles.paddingTop}px</span>
                          </div>
                          <input 
                            type="range" 
                            min="10" 
                            max="160" 
                            value={selectedBlock.styles.paddingTop}
                            onChange={(e) => handleUpdateBlockStyle('paddingTop', Number(e.target.value))}
                            className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                          />
                        </div>

                        {/* Padding Bottom */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400">
                            <span>Padding Bottom</span>
                            <span className="text-blue-400">{selectedBlock.styles.paddingBottom}px</span>
                          </div>
                          <input 
                            type="range" 
                            min="10" 
                            max="160" 
                            value={selectedBlock.styles.paddingBottom}
                            onChange={(e) => handleUpdateBlockStyle('paddingBottom', Number(e.target.value))}
                            className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                          />
                        </div>

                        {/* Max Width Container */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400">
                            <span>Max Content Width</span>
                            <span className="text-blue-400">{selectedBlock.styles.maxWidth}px</span>
                          </div>
                          <input 
                            type="range" 
                            min="600" 
                            max="1400" 
                            value={selectedBlock.styles.maxWidth}
                            onChange={(e) => handleUpdateBlockStyle('maxWidth', Number(e.target.value))}
                            className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* ACCORDION GROUP: SHADOWS & CARD DECORATION */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-extrabold uppercase text-slate-500 tracking-widest flex items-center gap-1.5">
                        <Layers size={11} className="text-blue-400" />
                        <span>Card styling & Corners</span>
                      </p>

                      <div className="space-y-3.5 bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
                        {/* Card Corners */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400">
                            <span>Card Radius</span>
                            <span className="text-blue-400">{selectedBlock.styles.cardBorderRadius}px</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="32" 
                            value={selectedBlock.styles.cardBorderRadius}
                            onChange={(e) => handleUpdateBlockStyle('cardBorderRadius', Number(e.target.value))}
                            className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                          />
                        </div>

                        {/* Card Background Color */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 block">Card Bg</label>
                          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                            <input 
                              type="color" 
                              value={selectedBlock.styles.cardBgColor}
                              onChange={(e) => handleUpdateBlockStyle('cardBgColor', e.target.value)}
                              className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                            />
                            <span className="text-[10px] font-mono text-slate-300 uppercase">{selectedBlock.styles.cardBgColor}</span>
                          </div>
                        </div>

                        {/* Border Radius (Outer, if applicable) */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400">
                            <span>Button Radius</span>
                            <span className="text-blue-400">{selectedBlock.styles.buttonBorderRadius}px</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="24" 
                            value={selectedBlock.styles.buttonBorderRadius}
                            onChange={(e) => handleUpdateBlockStyle('buttonBorderRadius', Number(e.target.value))}
                            className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* ACCORDION GROUP: BACKGROUND TYPE & INTERACTIONS */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-extrabold uppercase text-slate-500 tracking-widest flex items-center gap-1.5">
                        <ImageIcon size={11} className="text-blue-400" />
                        <span>Interactive Background & Clicks</span>
                      </p>

                      <div className="space-y-3.5 bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
                        {/* Background Mode */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">Background Mode</label>
                          <select 
                            value={selectedBlock.styles.bgType || (selectedBlock.styles.useGradient ? 'gradient' : 'color')}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleUpdateBlockStyle('bgType', val);
                              if (val === 'gradient') {
                                handleUpdateBlockStyle('useGradient', true);
                              } else {
                                handleUpdateBlockStyle('useGradient', false);
                              }
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none cursor-pointer"
                          >
                            <option value="color">Solid Color</option>
                            <option value="gradient">Gradient Flow</option>
                            <option value="image">Custom Background Image</option>
                          </select>
                        </div>

                        {/* If Background Image is selected */}
                        {selectedBlock.styles.bgType === 'image' && (
                          <div className="space-y-3 pt-2 border-t border-slate-800/60">
                            <div className="space-y-1">
                              <div className="flex justify-between items-center mb-1">
                                <label className="text-[9px] font-bold text-slate-400 block">Bg Image URL</label>
                                <span className="text-[8px] font-bold text-blue-400 bg-blue-950/60 border border-blue-900/30 px-1.5 py-0.5 rounded">📏 Recommended: 1920x1080px</span>
                              </div>
                              <div className="flex gap-1.5">
                                <input 
                                  type="text"
                                  value={selectedBlock.styles.bgImageUrl || ''}
                                  onChange={(e) => handleUpdateBlockStyle('bgImageUrl', e.target.value)}
                                  placeholder="https://images.unsplash.com/..."
                                  className="flex-1 bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-300 font-mono outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.accept = 'image/*';
                                    input.onchange = async (e: any) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        await handleSingleImageUpload(file, 'style', 'bgImageUrl');
                                      }
                                    };
                                    input.click();
                                  }}
                                  disabled={uploadingImage}
                                  className="px-2 bg-blue-600 hover:bg-blue-500 rounded text-[9px] font-bold text-white transition-all cursor-pointer shrink-0 flex items-center justify-center gap-1 disabled:opacity-50"
                                >
                                  {uploadingImage ? <Loader2 size={10} className="animate-spin" /> : <UploadCloud size={10} />}
                                  <span>Upload</span>
                                </button>
                              </div>
                              <p className="text-[8px] text-slate-500 leading-tight mt-1">Recommended background resolution: 1920x1080px (Full HD) for sharp cover-stretch across wide laptop and desktop viewports.</p>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[9px] font-bold text-slate-400">
                                <span>Image Opacity</span>
                                <span className="text-blue-400">{selectedBlock.styles.bgImageOpacity !== undefined ? selectedBlock.styles.bgImageOpacity : 50}%</span>
                              </div>
                              <input 
                                type="range" 
                                min="10" 
                                max="100" 
                                value={selectedBlock.styles.bgImageOpacity !== undefined ? selectedBlock.styles.bgImageOpacity : 50}
                                onChange={(e) => handleUpdateBlockStyle('bgImageOpacity', Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 block">Sizing</label>
                                <select 
                                  value={selectedBlock.styles.bgImageSize || 'cover'}
                                  onChange={(e) => handleUpdateBlockStyle('bgImageSize', e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[10px] text-slate-300 outline-none cursor-pointer"
                                >
                                  <option value="cover">Cover (Fill)</option>
                                  <option value="contain">Contain (Fit)</option>
                                  <option value="auto">Original</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 block">Behavior</label>
                                <select 
                                  value={selectedBlock.styles.bgImageAttachment || 'scroll'}
                                  onChange={(e) => handleUpdateBlockStyle('bgImageAttachment', e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[10px] text-slate-300 outline-none cursor-pointer"
                                >
                                  <option value="scroll">Scroll</option>
                                  <option value="fixed">Parallax (Fixed)</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Interactive Click Response */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                          <label className="text-[10px] font-bold text-slate-400">Click Animation Response</label>
                          <select 
                            value={selectedBlock.styles.clickResponse || 'none'}
                            onChange={(e) => handleUpdateBlockStyle('clickResponse', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none cursor-pointer"
                          >
                            <option value="none">None (Static)</option>
                            <option value="scale-down">Scale Down Tap (Tactile)</option>
                            <option value="scale-up">Scale Up Tap</option>
                            <option value="bounce">Bounce Up Tap</option>
                            <option value="pulse">Pulse Scaling Tap</option>
                            <option value="flash">Flash Transparency</option>
                            <option value="ripple">Water Ripple Wave (Modern)</option>
                          </select>
                        </div>

                        {/* Hover Effects */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400">Hover Response Card Effect</label>
                          <select 
                            value={selectedBlock.styles.hoverEffect || 'none'}
                            onChange={(e) => handleUpdateBlockStyle('hoverEffect', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none cursor-pointer"
                          >
                            <option value="none">None</option>
                            <option value="lift">Hover Lift (Translate Y)</option>
                            <option value="glow">Glow Border Accent (Neon)</option>
                            <option value="tilt">3D Tilt (Card Rotate)</option>
                            <option value="scale">Soft Scale Magnify</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                  </div>
                )}

                {/* 2. CONTENT COPY TAB */}
                {rightInspectorTab === 'content' && (
                  <div className="space-y-4" id="content-inspector-panel">
                    
                    {/* Database Binding Controls */}
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/25 rounded-xl space-y-3">
                      <p className="text-[10px] font-black uppercase text-emerald-400 tracking-wide flex items-center gap-1.5">
                        <Database size={11} className="text-emerald-400" />
                        <span>Connect CMS Data</span>
                      </p>
                      <p className="text-[9px] text-slate-400 leading-relaxed text-left">
                        Pick a collection below to auto-fill this block with your <span className="font-bold text-emerald-400">Services / Products / Blogs</span> records. Add or edit records in the <span className="font-bold text-slate-200">Dashboard → CMS</span> tab or the <span className="font-bold text-slate-200">Database</span> tab.
                      </p>

                      {(!site.theme?.customCollections || site.theme.customCollections.length === 0) && (
                        <div className="text-[9px] text-amber-400/90 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 text-left">
                          No CMS collections yet. Open the <span className="font-bold">Database</span> tab (or Dashboard → CMS) and add records first — they'll appear here to connect.
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-slate-500 uppercase block text-left">1. Bind Block to Collection</label>
                        <select
                          value={(selectedBlock as any).bindCollectionName || ''}
                          onChange={(e) => {
                            const val = e.target.value || undefined;
                            handleUpdateBlockContent('bindCollectionName', val);
                            if (val) {
                              // Initialize default fields mapping
                              const colNames = site.theme?.customCollections?.find(
                                (c: any) => c.name.toLowerCase() === val.toLowerCase()
                              )?.columns?.map((c: any) => c.name) || [];
                              
                              if (selectedBlock.type === 'Features') {
                                handleUpdateBlockContent('bindFields', {
                                  title: colNames.find((n: string) => n.includes('title') || n.includes('name')) || colNames[0] || 'title',
                                  desc: colNames.find((n: string) => n.includes('desc') || n.includes('body')) || colNames[1] || 'desc',
                                  icon: colNames.find((n: string) => n.includes('icon') || n.includes('avatar')) || 'icon'
                                });
                              } else if (selectedBlock.type === 'Pricing') {
                                handleUpdateBlockContent('bindFields', {
                                  tier: colNames.find((n: string) => n.includes('tier') || n.includes('name')) || colNames[0] || 'tier',
                                  price: colNames.find((n: string) => n.includes('price') || n.includes('amount')) || colNames[1] || 'price',
                                  features: colNames.find((n: string) => n.includes('feat') || n.includes('list')) || 'features',
                                  btnText: 'btnText',
                                  popular: 'popular'
                                });
                              } else if (selectedBlock.type === 'Testimonials') {
                                handleUpdateBlockContent('bindFields', {
                                  name: colNames.find((n: string) => n.includes('name') || n.includes('author')) || colNames[0] || 'name',
                                  role: colNames.find((n: string) => n.includes('role') || n.includes('title')) || colNames[1] || 'role',
                                  content: colNames.find((n: string) => n.includes('content') || n.includes('body') || n.includes('text')) || colNames[2] || 'content',
                                  avatar: colNames.find((n: string) => n.includes('avatar') || n.includes('image')) || 'avatar',
                                  rating: 'rating'
                                });
                              }
                            } else {
                              handleUpdateBlockContent('bindFields', undefined);
                            }
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-300 outline-none cursor-pointer capitalize font-bold"
                        >
                          <option value="">-- No collection binding --</option>
                          {(site.theme?.customCollections || []).map((c: any) => (
                            <option key={c.name} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Render mapping selector fields if bound */}
                      {(selectedBlock as any).bindCollectionName && (selectedBlock.type === 'Features' || selectedBlock.type === 'Pricing' || selectedBlock.type === 'Testimonials') && (() => {
                        const coll = site.theme?.customCollections?.find(
                          (c: any) => c.name.toLowerCase() === (selectedBlock as any).bindCollectionName.toLowerCase()
                        );
                        if (!coll) return null;
                        const colNames = coll.columns.map((c: any) => c.name);
                        const fieldsMap = (selectedBlock as any).bindFields || {};
                        
                        return (
                          <div className="space-y-2.5 pt-2 border-t border-slate-800 text-left">
                            <span className="text-[8px] font-black text-emerald-400 uppercase block">2. Map Columns to Block Fields</span>
                            
                            {selectedBlock.type === 'Features' && (
                              <div className="grid grid-cols-3 gap-1.5 text-[8px]">
                                <div className="space-y-1">
                                  <label className="text-[7px] font-black text-slate-400 uppercase">Title</label>
                                  <select 
                                    value={fieldsMap.title || ''}
                                    onChange={(e) => handleUpdateBlockContent('bindFields', { ...fieldsMap, title: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-1 font-bold text-slate-300"
                                  >
                                    {colNames.map((n: string) => <option key={n} value={n}>{n}</option>)}
                                  </select>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[7px] font-black text-slate-400 uppercase">Desc</label>
                                  <select 
                                    value={fieldsMap.desc || ''}
                                    onChange={(e) => handleUpdateBlockContent('bindFields', { ...fieldsMap, desc: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-1 font-bold text-slate-300"
                                  >
                                    {colNames.map((n: string) => <option key={n} value={n}>{n}</option>)}
                                  </select>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[7px] font-black text-slate-400 uppercase">Icon</label>
                                  <select 
                                    value={fieldsMap.icon || ''}
                                    onChange={(e) => handleUpdateBlockContent('bindFields', { ...fieldsMap, icon: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-1 font-bold text-slate-300"
                                  >
                                    <option value="">(Default Sparkles)</option>
                                    {colNames.map((n: string) => <option key={n} value={n}>{n}</option>)}
                                  </select>
                                </div>
                              </div>
                            )}

                            {selectedBlock.type === 'Testimonials' && (
                              <div className="grid grid-cols-3 gap-1.5 text-[8px]">
                                <div className="space-y-1">
                                  <label className="text-[7px] font-black text-slate-400 uppercase">Author Name</label>
                                  <select 
                                    value={fieldsMap.name || ''}
                                    onChange={(e) => handleUpdateBlockContent('bindFields', { ...fieldsMap, name: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-1 font-bold text-slate-300"
                                  >
                                    {colNames.map((n: string) => <option key={n} value={n}>{n}</option>)}
                                  </select>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[7px] font-black text-slate-400 uppercase">Author Role</label>
                                  <select 
                                    value={fieldsMap.role || ''}
                                    onChange={(e) => handleUpdateBlockContent('bindFields', { ...fieldsMap, role: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-1 font-bold text-slate-300"
                                  >
                                    {colNames.map((n: string) => <option key={n} value={n}>{n}</option>)}
                                  </select>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[7px] font-black text-slate-400 uppercase">Content Body</label>
                                  <select 
                                    value={fieldsMap.content || ''}
                                    onChange={(e) => handleUpdateBlockContent('bindFields', { ...fieldsMap, content: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-1 font-bold text-slate-300"
                                  >
                                    {colNames.map((n: string) => <option key={n} value={n}>{n}</option>)}
                                  </select>
                                </div>
                              </div>
                            )}

                            {selectedBlock.type === 'Pricing' && (
                              <div className="grid grid-cols-3 gap-1.5 text-[8px]">
                                <div className="space-y-1">
                                  <label className="text-[7px] font-black text-slate-400 uppercase">Tier Title</label>
                                  <select 
                                    value={fieldsMap.tier || ''}
                                    onChange={(e) => handleUpdateBlockContent('bindFields', { ...fieldsMap, tier: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-1 font-bold text-slate-300"
                                  >
                                    {colNames.map((n: string) => <option key={n} value={n}>{n}</option>)}
                                  </select>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[7px] font-black text-slate-400 uppercase">Price Tag</label>
                                  <select 
                                    value={fieldsMap.price || ''}
                                    onChange={(e) => handleUpdateBlockContent('bindFields', { ...fieldsMap, price: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-1 font-bold text-slate-300"
                                  >
                                    {colNames.map((n: string) => <option key={n} value={n}>{n}</option>)}
                                  </select>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[7px] font-black text-slate-400 uppercase">Features</label>
                                  <select 
                                    value={fieldsMap.features || ''}
                                    onChange={(e) => handleUpdateBlockContent('bindFields', { ...fieldsMap, features: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-1 font-bold text-slate-300"
                                  >
                                    {colNames.map((n: string) => <option key={n} value={n}>{n}</option>)}
                                  </select>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {/* Display cheat sheet */}
                      <div className="p-2 bg-slate-955 rounded border border-slate-850 text-[9px] text-slate-500 space-y-1 text-left leading-relaxed">
                        <span className="font-bold text-slate-400 block mb-0.5">📌 Dynamic Tags (copy-paste in text fields):</span>
                        <div className="flex items-center justify-between"><span>• Business Name:</span> <code className="font-mono text-indigo-400 bg-slate-950 px-1 rounded select-all cursor-pointer">{"{{site.business_name}}"}</code></div>
                        <div className="flex items-center justify-between"><span>• Office Phone:</span> <code className="font-mono text-indigo-400 bg-slate-950 px-1 rounded select-all cursor-pointer">{"{{site.theme.phone}}"}</code></div>
                        <div className="flex items-center justify-between"><span>• Corporate Address:</span> <code className="font-mono text-indigo-400 bg-slate-950 px-1 rounded select-all cursor-pointer">{"{{site.theme.address}}"}</code></div>
                        <div className="flex items-center justify-between"><span>• Active Page Name:</span> <code className="font-mono text-indigo-400 bg-slate-950 px-1 rounded select-all cursor-pointer">{"{{page.name}}"}</code></div>
                      </div>
                    </div>
                    
                    {/* Badge Copy */}
                    {selectedBlock.badge !== undefined && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide">Header Badge Text</label>
                        <input 
                          type="text" 
                          value={selectedBlock.badge}
                          onChange={(e) => handleUpdateBlockContent('badge', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-blue-500"
                          placeholder="EXCLUSIVITY BADGE"
                        />
                      </div>
                    )}

                    {/* Title Copy */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide">Section Main Title</label>
                      <textarea 
                        rows={2}
                        value={selectedBlock.title}
                        onChange={(e) => handleUpdateBlockContent('title', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-blue-500 resize-none"
                        placeholder="Enter premium section header..."
                      />
                    </div>

                    {/* Subtitle Copy */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide">Subtitle / Supporting Copy</label>
                      <textarea 
                        rows={4}
                        value={selectedBlock.subtitle}
                        onChange={(e) => handleUpdateBlockContent('subtitle', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-blue-500 resize-none"
                        placeholder="Enter description explaining value..."
                      />
                    </div>

                    {/* Button Text */}
                    {selectedBlock.btnText !== undefined && (
                      <>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide">Button CTA Text</label>
                          <input 
                            type="text" 
                            value={selectedBlock.btnText}
                            onChange={(e) => handleUpdateBlockContent('btnText', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-blue-500"
                            placeholder="Action CTA Button"
                          />
                        </div>

                        {/* Link Tagging Action builder */}
                        <div className="space-y-3 pt-3.5 border-t border-slate-800">
                          <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide flex items-center gap-1.5">
                            <SlidersHorizontal size={11} className="text-blue-400" />
                            <span>Link Action Target</span>
                          </p>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-[8px] font-bold text-slate-500 uppercase">Action Type</label>
                              <select
                                value={selectedBlock.btnActionType || 'none'}
                                onChange={(e) => handleUpdateBlockContent('btnActionType', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-300 outline-none cursor-pointer"
                              >
                                <option value="none">No Action</option>
                                <option value="scroll">Scroll to Block</option>
                                <option value="link">Link to Page</option>
                                <option value="external">External URL</option>
                              </select>
                            </div>
                            
                            <div className="space-y-1">
                              <label className="text-[8px] font-bold text-slate-500 uppercase">Destination</label>
                              {selectedBlock.btnActionType === 'scroll' ? (
                                <select
                                  value={selectedBlock.btnActionValue || ''}
                                  onChange={(e) => handleUpdateBlockContent('btnActionValue', e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-300 outline-none cursor-pointer"
                                >
                                  <option value="">Select block...</option>
                                  {blocks.map(b => (
                                    <option key={b.id} value={b.id}>{b.type} ({b.title?.slice(0, 15) || b.id})</option>
                                  ))}
                                </select>
                              ) : selectedBlock.btnActionType === 'link' ? (
                                <select
                                  value={selectedBlock.btnActionValue || ''}
                                  onChange={(e) => handleUpdateBlockContent('btnActionValue', e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-300 outline-none cursor-pointer"
                                >
                                  <option value="">Select page...</option>
                                  {pages.map(p => (
                                    <option key={p.id} value={p.slug}>{p.name} ({p.slug})</option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type="text"
                                  placeholder="https://example.com"
                                  value={selectedBlock.btnActionValue || ''}
                                  onChange={(e) => handleUpdateBlockContent('btnActionValue', e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 outline-none font-mono"
                                  disabled={selectedBlock.btnActionType === 'none'}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Google Map location configuration */}
                    {selectedBlock.type === 'Map' && (
                      <div className="space-y-3 pt-3 border-t border-slate-800">
                        <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide flex items-center gap-1.5">
                          <MapPin size={11} className="text-blue-400" />
                          <span>Google Maps Settings</span>
                        </p>
                        
                        <div className="space-y-1.5">
                          <label className="text-[9px] text-slate-500 uppercase">Target Address / Location</label>
                          <input 
                            type="text" 
                            value={selectedBlock.mapAddress || ''}
                            onChange={(e) => handleUpdateBlockContent('mapAddress', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-blue-500"
                            placeholder="e.g. Indiranagar, Bengaluru"
                          />
                          <p className="text-[8px] text-slate-500 mt-1 leading-normal">
                            Type any street name, landmark, or coordinates. The embedded map resolves it dynamically.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Image URL (Hero & Navigation specific) */}
                    {(selectedBlock.imageUrl !== undefined || selectedBlock.type === 'Navigation') && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide">
                            {selectedBlock.type === 'Navigation' ? 'Brand Logo Image URL' : 'Graphic Banner Image URL'}
                          </label>
                          <span className="text-[8px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-900/30 px-1.5 py-0.5 rounded">
                            {selectedBlock.type === 'Navigation' ? '📏 Recommended: 200x50px' : '📏 Recommended: 1200x800px'}
                          </span>
                        </div>
                         <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={selectedBlock.imageUrl || ''}
                            onChange={(e) => handleUpdateBlockContent('imageUrl', e.target.value)}
                            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-blue-500 font-mono"
                            placeholder={selectedBlock.type === 'Navigation' ? 'Logo secure image url...' : 'Unsplash secure image url...'}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = async (e: any) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  await handleSingleImageUpload(file, 'content', 'imageUrl');
                                }
                              };
                              input.click();
                            }}
                            disabled={uploadingImage}
                            className="px-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold text-white transition-all cursor-pointer shrink-0 flex items-center justify-center gap-1 hover:shadow-lg disabled:opacity-50"
                          >
                            {uploadingImage ? <Loader2 size={12} className="animate-spin" /> : <UploadCloud size={12} />}
                            <span>Upload</span>
                          </button>
                        </div>
                        <p className="text-[9px] text-slate-500 leading-normal">
                          {selectedBlock.type === 'Navigation' 
                            ? 'Recommended: 200x50px transparent PNG brand logo. Keep it short and compact so it fits perfectly on all mobile & desktop navigation layouts.' 
                            : 'Recommended: 1200x800px (3:2 aspect ratio). Ideal size for hero banners, product illustrations, or mockups.'}
                        </p>
                      </div>
                    )}

                    {/* Contact detail fields */}
                    {selectedBlock.type === 'Contact' && (
                      <div className="space-y-3 pt-2 border-t border-slate-800">
                        <p className="text-[10px] font-extrabold text-slate-400">CONTACT DETAILS</p>
                        
                        <div className="space-y-1.5">
                          <label className="text-[9px] text-slate-500 uppercase">Corporate Email</label>
                          <input 
                            type="text" 
                            value={selectedBlock.contactEmail || ''}
                            onChange={(e) => handleUpdateBlockContent('contactEmail', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] text-slate-500 uppercase">Corporate Phone</label>
                          <input 
                            type="text" 
                            value={selectedBlock.contactPhone || ''}
                            onChange={(e) => handleUpdateBlockContent('contactPhone', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200"
                          />
                        </div>
                      </div>
                    )}

                    {/* NESTED CONTENT & GRID ITEM EDITORS */}

                    {/* 1. FEATURES / SERVICES GRIDS */}
                    {selectedBlock.features && (
                      <div className="space-y-3.5 pt-4 border-t border-slate-800">
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide flex items-center gap-1">
                            <List size={11} className="text-blue-400" />
                            <span>Nested Grid Features ({selectedBlock.features.length})</span>
                          </p>
                          <button 
                            onClick={() => {
                              const currentFeatures = selectedBlock.features || [];
                              const newId = `feat-${Date.now()}`;
                              const newFeat = { 
                                id: newId, 
                                title: 'Interactive Feature Option', 
                                desc: 'Modify this outline description using OnlyPage options.', 
                                icon: 'Sparkles' 
                              };
                              handleUpdateBlockContent('features', [...currentFeatures, newFeat]);
                            }}
                            className="flex items-center gap-1 text-[9px] text-blue-400 hover:text-blue-300 font-extrabold cursor-pointer uppercase bg-blue-950/40 border border-blue-900/40 px-2 py-1 rounded"
                          >
                            <Plus size={10} /> Add Grid
                          </button>
                        </div>

                        <div className="space-y-3">
                          {selectedBlock.features.map((feat, index) => (
                            <div key={feat.id} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 space-y-3 relative">
                              <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                                <span className="text-[9px] font-extrabold text-blue-500 uppercase">GRID ITEM 0{index + 1}</span>
                                <div className="flex items-center gap-1">
                                  {index > 0 && (
                                    <button 
                                      onClick={() => {
                                        const copy = [...(selectedBlock.features || [])];
                                        const temp = copy[index];
                                        copy[index] = copy[index - 1];
                                        copy[index - 1] = temp;
                                        handleUpdateBlockContent('features', copy);
                                      }}
                                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
                                      title="Move Up"
                                    >
                                      <MoveUp size={10} />
                                    </button>
                                  )}
                                  {index < (selectedBlock.features || []).length - 1 && (
                                    <button 
                                      onClick={() => {
                                        const copy = [...(selectedBlock.features || [])];
                                        const temp = copy[index];
                                        copy[index] = copy[index + 1];
                                        copy[index + 1] = temp;
                                        handleUpdateBlockContent('features', copy);
                                      }}
                                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
                                      title="Move Down"
                                    >
                                      <MoveDown size={10} />
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => {
                                      const copy = (selectedBlock.features || []).filter(f => f.id !== feat.id);
                                      handleUpdateBlockContent('features', copy);
                                    }}
                                    className="p-1 hover:bg-red-900/40 rounded text-slate-400 hover:text-red-400 cursor-pointer"
                                    title="Delete Item"
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="col-span-2 space-y-1">
                                    <label className="text-[8px] font-bold text-slate-500 uppercase">Item Title</label>
                                    <input 
                                      type="text" 
                                      value={feat.title}
                                      onChange={(e) => {
                                        const copy = [...(selectedBlock.features || [])];
                                        copy[index] = { ...copy[index], title: e.target.value };
                                        handleUpdateBlockContent('features', copy);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 outline-none"
                                    />
                                  </div>
                                  
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold text-slate-500 uppercase">Icon</label>
                                    <select 
                                      value={feat.icon}
                                      onChange={(e) => {
                                        const copy = [...(selectedBlock.features || [])];
                                        copy[index] = { ...copy[index], icon: e.target.value };
                                        handleUpdateBlockContent('features', copy);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[10px] text-slate-200 outline-none cursor-pointer"
                                    >
                                      {['Heart', 'Globe', 'Sliders', 'Type', 'Award', 'Mail', 'Phone', 'MapPin', 'CheckCircle2', 'Star', 'Search', 'Sparkles', 'Calendar', 'ShieldCheck', 'Users', 'MessageSquare', 'Briefcase', 'DollarSign', 'CheckSquare', 'ThumbsUp', 'Layout', 'Settings'].map(iconOpt => (
                                        <option key={iconOpt} value={iconOpt}>{iconOpt}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[8px] font-bold text-slate-500 uppercase">Item Copy Description</label>
                                  <textarea 
                                    rows={2}
                                    value={feat.desc}
                                    onChange={(e) => {
                                      const copy = [...(selectedBlock.features || [])];
                                      copy[index] = { ...copy[index], desc: e.target.value };
                                      handleUpdateBlockContent('features', copy);
                                    }}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 resize-none outline-none"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 2. PRICING PLANS */}
                    {selectedBlock.pricing && (
                      <div className="space-y-3.5 pt-4 border-t border-slate-800">
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide flex items-center gap-1">
                            <DollarSign size={11} className="text-blue-400" />
                            <span>Pricing Plans ({selectedBlock.pricing.length})</span>
                          </p>
                          <button 
                            onClick={() => {
                              const currentPricing = selectedBlock.pricing || [];
                              const newId = `price-${Date.now()}`;
                              const newPlan = { 
                                id: newId, 
                                tier: 'Scale Plan', 
                                price: '$49/mo', 
                                features: ['Premium Custom Modules', 'Dedicated Accounts', 'Interactive visual boards'], 
                                btnText: 'Subscribe Now', 
                                popular: false 
                              };
                              handleUpdateBlockContent('pricing', [...currentPricing, newPlan]);
                            }}
                            className="flex items-center gap-1 text-[9px] text-blue-400 hover:text-blue-300 font-extrabold cursor-pointer uppercase bg-blue-950/40 border border-blue-900/40 px-2 py-1 rounded"
                          >
                            <Plus size={10} /> Add Plan
                          </button>
                        </div>

                        <div className="space-y-3">
                          {selectedBlock.pricing.map((plan, index) => (
                            <div key={plan.id} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 space-y-3 relative">
                              <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                                <span className="text-[9px] font-extrabold text-blue-500 uppercase">PLAN TIER 0{index + 1}</span>
                                <div className="flex items-center gap-1">
                                  <input 
                                    type="checkbox" 
                                    checked={plan.popular || false}
                                    onChange={(e) => {
                                      const copy = [...(selectedBlock.pricing || [])];
                                      copy[index] = { ...copy[index], popular: e.target.checked };
                                      handleUpdateBlockContent('pricing', copy);
                                    }}
                                    className="cursor-pointer"
                                    title="Recommended/Popular"
                                  />
                                  <span className="text-[8px] font-extrabold text-slate-500 mr-2">POPULAR</span>
                                  {index > 0 && (
                                    <button 
                                      onClick={() => {
                                        const copy = [...(selectedBlock.pricing || [])];
                                        const temp = copy[index];
                                        copy[index] = copy[index - 1];
                                        copy[index - 1] = temp;
                                        handleUpdateBlockContent('pricing', copy);
                                      }}
                                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
                                    >
                                      <MoveUp size={10} />
                                    </button>
                                  )}
                                  {index < (selectedBlock.pricing || []).length - 1 && (
                                    <button 
                                      onClick={() => {
                                        const copy = [...(selectedBlock.pricing || [])];
                                        const temp = copy[index];
                                        copy[index] = copy[index + 1];
                                        copy[index + 1] = temp;
                                        handleUpdateBlockContent('pricing', copy);
                                      }}
                                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
                                    >
                                      <MoveDown size={10} />
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => {
                                      const copy = (selectedBlock.pricing || []).filter(p => p.id !== plan.id);
                                      handleUpdateBlockContent('pricing', copy);
                                    }}
                                    className="p-1 hover:bg-red-900/40 rounded text-slate-400 hover:text-red-400 cursor-pointer"
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold text-slate-500 uppercase">Tier Name</label>
                                    <input 
                                      type="text" 
                                      value={plan.tier}
                                      onChange={(e) => {
                                        const copy = [...(selectedBlock.pricing || [])];
                                        copy[index] = { ...copy[index], tier: e.target.value };
                                        handleUpdateBlockContent('pricing', copy);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 outline-none"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold text-slate-500 uppercase">Price</label>
                                    <input 
                                      type="text" 
                                      value={plan.price}
                                      onChange={(e) => {
                                        const copy = [...(selectedBlock.pricing || [])];
                                        copy[index] = { ...copy[index], price: e.target.value };
                                        handleUpdateBlockContent('pricing', copy);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 outline-none"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[8px] font-bold text-slate-500 uppercase">Plan Features (One per line)</label>
                                  <textarea 
                                    rows={3}
                                    value={(plan.features || []).join('\n')}
                                    onChange={(e) => {
                                      const copy = [...(selectedBlock.pricing || [])];
                                      copy[index] = { ...copy[index], features: e.target.value.split('\n') };
                                      handleUpdateBlockContent('pricing', copy);
                                    }}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 font-mono outline-none"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[8px] font-bold text-slate-500 uppercase">Button Copy Text</label>
                                  <input 
                                    type="text" 
                                    value={plan.btnText}
                                    onChange={(e) => {
                                      const copy = [...(selectedBlock.pricing || [])];
                                      copy[index] = { ...copy[index], btnText: e.target.value };
                                      handleUpdateBlockContent('pricing', copy);
                                    }}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 outline-none"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 3. TESTIMONIALS */}
                    {selectedBlock.testimonials && (
                      <div className="space-y-3.5 pt-4 border-t border-slate-800">
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide flex items-center gap-1">
                            <ThumbsUp size={11} className="text-blue-400" />
                            <span>Client Reviews ({selectedBlock.testimonials.length})</span>
                          </p>
                          <button 
                            onClick={() => {
                              const currentTestimonials = selectedBlock.testimonials || [];
                              const newId = `test-${Date.now()}`;
                              const newTest = { 
                                id: newId, 
                                name: 'Kabir Dev', 
                                role: 'Founder, DesignCo', 
                                content: 'This completely revolutionized our digital presence overnight. Incredible tool!', 
                                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', 
                                rating: 5 
                              };
                              handleUpdateBlockContent('testimonials', [...currentTestimonials, newTest]);
                            }}
                            className="flex items-center gap-1 text-[9px] text-blue-400 hover:text-blue-300 font-extrabold cursor-pointer uppercase bg-blue-950/40 border border-blue-900/40 px-2 py-1 rounded"
                          >
                            <Plus size={10} /> Add Review
                          </button>
                        </div>

                        <div className="space-y-3">
                          {selectedBlock.testimonials.map((test, index) => (
                            <div key={test.id} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 space-y-3 relative">
                              <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                                <span className="text-[9px] font-extrabold text-blue-500 uppercase">REVIEWER 0{index + 1}</span>
                                <div className="flex items-center gap-1">
                                  {index > 0 && (
                                    <button 
                                      onClick={() => {
                                        const copy = [...(selectedBlock.testimonials || [])];
                                        const temp = copy[index];
                                        copy[index] = copy[index - 1];
                                        copy[index - 1] = temp;
                                        handleUpdateBlockContent('testimonials', copy);
                                      }}
                                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
                                    >
                                      <MoveUp size={10} />
                                    </button>
                                  )}
                                  {index < (selectedBlock.testimonials || []).length - 1 && (
                                    <button 
                                      onClick={() => {
                                        const copy = [...(selectedBlock.testimonials || [])];
                                        const temp = copy[index];
                                        copy[index] = copy[index + 1];
                                        copy[index + 1] = temp;
                                        handleUpdateBlockContent('testimonials', copy);
                                      }}
                                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
                                    >
                                      <MoveDown size={10} />
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => {
                                      const copy = (selectedBlock.testimonials || []).filter(t => t.id !== test.id);
                                      handleUpdateBlockContent('testimonials', copy);
                                    }}
                                    className="p-1 hover:bg-red-900/40 rounded text-slate-400 hover:text-red-400 cursor-pointer"
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold text-slate-500 uppercase">Full Name</label>
                                    <input 
                                      type="text" 
                                      value={test.name}
                                      onChange={(e) => {
                                        const copy = [...(selectedBlock.testimonials || [])];
                                        copy[index] = { ...copy[index], name: e.target.value };
                                        handleUpdateBlockContent('testimonials', copy);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 outline-none"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold text-slate-500 uppercase">Role / Company</label>
                                    <input 
                                      type="text" 
                                      value={test.role}
                                      onChange={(e) => {
                                        const copy = [...(selectedBlock.testimonials || [])];
                                        copy[index] = { ...copy[index], role: e.target.value };
                                        handleUpdateBlockContent('testimonials', copy);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 outline-none"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 items-center">
                                  <div className="col-span-2 space-y-1">
                                    <div className="flex justify-between items-center">
                                      <label className="text-[8px] font-bold text-slate-500 uppercase">Avatar URL</label>
                                      <span className="text-[7px] font-extrabold text-blue-400 bg-blue-950 px-1 py-0.2 rounded">📏 Rec: 150x150px</span>
                                    </div>
                                    <input 
                                      type="text" 
                                      value={test.avatar}
                                      onChange={(e) => {
                                        const copy = [...(selectedBlock.testimonials || [])];
                                        copy[index] = { ...copy[index], avatar: e.target.value };
                                        handleUpdateBlockContent('testimonials', copy);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[10px] text-slate-200 font-mono outline-none"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold text-slate-500 uppercase">Stars (1-5)</label>
                                    <select 
                                      value={test.rating}
                                      onChange={(e) => {
                                        const copy = [...(selectedBlock.testimonials || [])];
                                        copy[index] = { ...copy[index], rating: Number(e.target.value) };
                                        handleUpdateBlockContent('testimonials', copy);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[10px] text-slate-200 outline-none cursor-pointer"
                                    >
                                      {[1, 2, 3, 4, 5].map(stars => (
                                        <option key={stars} value={stars}>{stars} Stars</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[8px] font-bold text-slate-500 uppercase">Review Feedback Copy</label>
                                  <textarea 
                                    rows={2}
                                    value={test.content}
                                    onChange={(e) => {
                                      const copy = [...(selectedBlock.testimonials || [])];
                                      copy[index] = { ...copy[index], content: e.target.value };
                                      handleUpdateBlockContent('testimonials', copy);
                                    }}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 resize-none outline-none"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 4. FOOTER QUICK LINKS */}
                    {selectedBlock.links && (
                      <div className="space-y-3.5 pt-4 border-t border-slate-800">
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide flex items-center gap-1">
                            <Layers size={11} className="text-blue-400" />
                            <span>Footer Quick Links ({selectedBlock.links.length})</span>
                          </p>
                          <button 
                            onClick={() => {
                              const currentLinks = selectedBlock.links || [];
                              const newId = `link-${Date.now()}`;
                              const newLink = { id: newId, label: 'Resources Support', url: '#' };
                              handleUpdateBlockContent('links', [...currentLinks, newLink]);
                            }}
                            className="flex items-center gap-1 text-[9px] text-blue-400 hover:text-blue-300 font-extrabold cursor-pointer uppercase bg-blue-950/40 border border-blue-900/40 px-2 py-1 rounded"
                          >
                            <Plus size={10} /> Add Link
                          </button>
                        </div>

                        <div className="space-y-2">
                          {selectedBlock.links.map((link, index) => (
                            <div key={link.id} className="grid grid-cols-12 gap-2 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/80 items-center">
                              <div className="col-span-5 space-y-1">
                                <label className="text-[8px] font-bold text-slate-500 uppercase">Label</label>
                                <input 
                                  type="text" 
                                  value={link.label}
                                  onChange={(e) => {
                                    const copy = [...(selectedBlock.links || [])];
                                    copy[index] = { ...copy[index], label: e.target.value };
                                    handleUpdateBlockContent('links', copy);
                                  }}
                                  className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[10px] text-slate-200 outline-none"
                                />
                              </div>

                              <div className="col-span-5 space-y-1">
                                <label className="text-[8px] font-bold text-slate-500 uppercase flex items-center justify-between">
                                  <span>URL / Page Link</span>
                                  <select
                                    value=""
                                    onChange={(e) => {
                                      if (!e.target.value) return;
                                      const copy = [...(selectedBlock.links || [])];
                                      copy[index] = { ...copy[index], url: e.target.value };
                                      handleUpdateBlockContent('links', copy);
                                    }}
                                    className="bg-slate-900 border border-slate-800 rounded px-1 py-0.5 text-[8px] text-blue-400 outline-none cursor-pointer"
                                    title="Connect to a page"
                                  >
                                    <option value="">Connect page…</option>
                                    {pages.map(p => (
                                      <option key={p.id} value={`/${p.slug}`}>{p.name}</option>
                                    ))}
                                  </select>
                                </label>
                                <input
                                  type="text"
                                  value={link.url}
                                  onChange={(e) => {
                                    const copy = [...(selectedBlock.links || [])];
                                    copy[index] = { ...copy[index], url: e.target.value };
                                    handleUpdateBlockContent('links', copy);
                                  }}
                                  placeholder="/about or https://..."
                                  className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[10px] text-slate-200 font-mono outline-none"
                                />
                              </div>

                              <div className="col-span-2 flex justify-end gap-1 mt-3">
                                <button 
                                  onClick={() => {
                                    const copy = (selectedBlock.links || []).filter(l => l.id !== link.id);
                                    handleUpdateBlockContent('links', copy);
                                  }}
                                  className="p-1 hover:bg-red-900/40 rounded text-slate-400 hover:text-red-400 cursor-pointer"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 5. FAQ ACCORDIONS */}
                    {selectedBlock.type === 'Special' && selectedBlock.variant === 'faq-accordions' && (
                      <div className="space-y-3.5 pt-4 border-t border-slate-800">
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide flex items-center gap-1">
                            <MessageSquare size={11} className="text-blue-400" />
                            <span>FAQ Accordion List ({(selectedBlock.faqs || []).length})</span>
                          </p>
                          <button 
                            onClick={() => {
                              const currentFaqs = selectedBlock.faqs || [
                                { id: 'faq-1', q: 'Is there a setup or domain routing fee?', a: 'Absolutely not. Custom DNS mappings, hosting assets, and CDN caching are bundled entirely free of cost.' },
                                { id: 'faq-2', q: 'Can I export the clean React or Tailwind code?', a: 'Yes! Select export from the builder settings to export standard standalone React files containing your configurations.' },
                                { id: 'faq-3', q: 'Are visual effects responsive?', a: 'Every moving border, spotlight mask, and particle wave recalculates dynamically depending on the active device viewport.' }
                              ];
                              const newFaq = { 
                                id: `faq-${Date.now()}`, 
                                q: 'New Frequently Asked Question?', 
                                a: 'Provide an elegant and clear answers text here.' 
                              };
                              handleUpdateBlockContent('faqs', [...currentFaqs, newFaq]);
                            }}
                            className="flex items-center gap-1 text-[9px] text-blue-400 hover:text-blue-300 font-extrabold cursor-pointer uppercase bg-blue-950/40 border border-blue-900/40 px-2 py-1 rounded"
                          >
                            <Plus size={10} /> Add FAQ
                          </button>
                        </div>

                        <div className="space-y-3">
                          {(selectedBlock.faqs || [
                            { id: 'faq-1', q: 'Is there a setup or domain routing fee?', a: 'Absolutely not. Custom DNS mappings, hosting assets, and CDN caching are bundled entirely free of cost.' },
                            { id: 'faq-2', q: 'Can I export the clean React or Tailwind code?', a: 'Yes! Select export from the builder settings to export standard standalone React files containing your configurations.' },
                            { id: 'faq-3', q: 'Are visual effects responsive?', a: 'Every moving border, spotlight mask, and particle wave recalculates dynamically depending on the active device viewport.' }
                          ]).map((faq, index) => (
                            <div key={faq.id || index} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 space-y-2 relative">
                              <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                                <span className="text-[9px] font-extrabold text-blue-500 uppercase">FAQ ITEM 0{index + 1}</span>
                                <button 
                                  onClick={() => {
                                    const currentFaqs = selectedBlock.faqs || [
                                      { id: 'faq-1', q: 'Is there a setup or domain routing fee?', a: 'Absolutely not. Custom DNS mappings, hosting assets, and CDN caching are bundled entirely free of cost.' },
                                      { id: 'faq-2', q: 'Can I export the clean React or Tailwind code?', a: 'Yes! Select export from the builder settings to export standard standalone React files containing your configurations.' },
                                      { id: 'faq-3', q: 'Are visual effects responsive?', a: 'Every moving border, spotlight mask, and particle wave recalculates dynamically depending on the active device viewport.' }
                                    ];
                                    const copy = currentFaqs.filter(f => f.id !== faq.id && f.q !== faq.q);
                                    handleUpdateBlockContent('faqs', copy);
                                  }}
                                  className="p-1 hover:bg-red-900/40 rounded text-slate-400 hover:text-red-400 cursor-pointer"
                                >
                                  <Trash2 size={10} />
                                </button>
                              </div>

                              <div className="space-y-2">
                                <div className="space-y-1">
                                  <label className="text-[8px] font-bold text-slate-500 uppercase">Question</label>
                                  <input 
                                    type="text" 
                                    value={faq.q}
                                    onChange={(e) => {
                                      const currentFaqs = selectedBlock.faqs || [
                                        { id: 'faq-1', q: 'Is there a setup or domain routing fee?', a: 'Absolutely not. Custom DNS mappings, hosting assets, and CDN caching are bundled entirely free of cost.' },
                                        { id: 'faq-2', q: 'Can I export the clean React or Tailwind code?', a: 'Yes! Select export from the builder settings to export standard standalone React files containing your configurations.' },
                                        { id: 'faq-3', q: 'Are visual effects responsive?', a: 'Every moving border, spotlight mask, and particle wave recalculates dynamically depending on the active device viewport.' }
                                      ];
                                      const copy = [...currentFaqs];
                                      copy[index] = { ...copy[index], q: e.target.value };
                                      handleUpdateBlockContent('faqs', copy);
                                    }}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 outline-none"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[8px] font-bold text-slate-500 uppercase">Answer</label>
                                  <textarea 
                                    rows={2}
                                    value={faq.a}
                                    onChange={(e) => {
                                      const currentFaqs = selectedBlock.faqs || [
                                        { id: 'faq-1', q: 'Is there a setup or domain routing fee?', a: 'Absolutely not. Custom DNS mappings, hosting assets, and CDN caching are bundled entirely free of cost.' },
                                        { id: 'faq-2', q: 'Can I export the clean React or Tailwind code?', a: 'Yes! Select export from the builder settings to export standard standalone React files containing your configurations.' },
                                        { id: 'faq-3', q: 'Are visual effects responsive?', a: 'Every moving border, spotlight mask, and particle wave recalculates dynamically depending on the active device viewport.' }
                                      ];
                                      const copy = [...currentFaqs];
                                      copy[index] = { ...copy[index], a: e.target.value };
                                      handleUpdateBlockContent('faqs', copy);
                                    }}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 resize-none outline-none"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 6. STATS METRICS GRID */}
                    {selectedBlock.type === 'Special' && selectedBlock.variant === 'stats-grid' && (
                      <div className="space-y-3.5 pt-4 border-t border-slate-800">
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide flex items-center gap-1">
                            <Briefcase size={11} className="text-blue-400" />
                            <span>Stats Counters ({(selectedBlock.stats || []).length})</span>
                          </p>
                          <button 
                            onClick={() => {
                              const currentStats = selectedBlock.stats || [
                                { id: 'stat-1', label: 'ACTIVE USERS', val: 12400, suffix: '+' },
                                { id: 'stat-2', label: 'WEBSITES PUBLISHED', val: 9940, suffix: '' },
                                { id: 'stat-3', label: 'CDN COLD STARTS', val: 24, suffix: 'ms' }
                              ];
                              const newStat = { 
                                id: `stat-${Date.now()}`, 
                                label: 'HOURLY COMMITS', 
                                val: 1500, 
                                suffix: '/hr' 
                              };
                              handleUpdateBlockContent('stats', [...currentStats, newStat]);
                            }}
                            className="flex items-center gap-1 text-[9px] text-blue-400 hover:text-blue-300 font-extrabold cursor-pointer uppercase bg-blue-950/40 border border-blue-900/40 px-2 py-1 rounded"
                          >
                            <Plus size={10} /> Add Stat
                          </button>
                        </div>

                        <div className="space-y-3">
                          {(selectedBlock.stats || [
                            { id: 'stat-1', label: 'ACTIVE USERS', val: 12400, suffix: '+' },
                            { id: 'stat-2', label: 'WEBSITES PUBLISHED', val: 9940, suffix: '' },
                            { id: 'stat-3', label: 'CDN COLD STARTS', val: 24, suffix: 'ms' }
                          ]).map((stat, index) => (
                            <div key={stat.id || index} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 space-y-2 relative">
                              <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                                <span className="text-[9px] font-extrabold text-blue-500 uppercase">STAT CARD 0{index + 1}</span>
                                <button 
                                  onClick={() => {
                                    const currentStats = selectedBlock.stats || [
                                      { id: 'stat-1', label: 'ACTIVE USERS', val: 12400, suffix: '+' },
                                      { id: 'stat-2', label: 'WEBSITES PUBLISHED', val: 9940, suffix: '' },
                                      { id: 'stat-3', label: 'CDN COLD STARTS', val: 24, suffix: 'ms' }
                                    ];
                                    const copy = currentStats.filter(s => s.id !== stat.id && s.label !== stat.label);
                                    handleUpdateBlockContent('stats', copy);
                                  }}
                                  className="p-1 hover:bg-red-900/40 rounded text-slate-400 hover:text-red-400 cursor-pointer"
                                >
                                  <Trash2 size={10} />
                                </button>
                              </div>

                              <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold text-slate-500 uppercase">Label Title</label>
                                    <input 
                                      type="text" 
                                      value={stat.label}
                                      onChange={(e) => {
                                        const currentStats = selectedBlock.stats || [
                                          { id: 'stat-1', label: 'ACTIVE USERS', val: 12400, suffix: '+' },
                                          { id: 'stat-2', label: 'WEBSITES PUBLISHED', val: 9940, suffix: '' },
                                          { id: 'stat-3', label: 'CDN COLD STARTS', val: 24, suffix: 'ms' }
                                        ];
                                        const copy = [...currentStats];
                                        copy[index] = { ...copy[index], label: e.target.value };
                                        handleUpdateBlockContent('stats', copy);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 outline-none"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold text-slate-500 uppercase">Suffix</label>
                                    <input 
                                      type="text" 
                                      value={stat.suffix}
                                      onChange={(e) => {
                                        const currentStats = selectedBlock.stats || [
                                          { id: 'stat-1', label: 'ACTIVE USERS', val: 12400, suffix: '+' },
                                          { id: 'stat-2', label: 'WEBSITES PUBLISHED', val: 9940, suffix: '' },
                                          { id: 'stat-3', label: 'CDN COLD STARTS', val: 24, suffix: 'ms' }
                                        ];
                                        const copy = [...currentStats];
                                        copy[index] = { ...copy[index], suffix: e.target.value };
                                        handleUpdateBlockContent('stats', copy);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 outline-none font-mono"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[8px] font-bold text-slate-500 uppercase">Numeric Value</label>
                                  <input 
                                    type="number" 
                                    value={stat.val}
                                    onChange={(e) => {
                                      const currentStats = selectedBlock.stats || [
                                        { id: 'stat-1', label: 'ACTIVE USERS', val: 12400, suffix: '+' },
                                        { id: 'stat-2', label: 'WEBSITES PUBLISHED', val: 9940, suffix: '' },
                                        { id: 'stat-3', label: 'CDN COLD STARTS', val: 24, suffix: 'ms' }
                                      ];
                                      const copy = [...currentStats];
                                      copy[index] = { ...copy[index], val: Number(e.target.value) };
                                      handleUpdateBlockContent('stats', copy);
                                    }}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 outline-none font-mono"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 7. ROADMAP STEPS PATH */}
                    {selectedBlock.type === 'Special' && selectedBlock.variant === 'steps-path' && (
                      <div className="space-y-3.5 pt-4 border-t border-slate-800">
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide flex items-center gap-1">
                            <Layout size={11} className="text-blue-400" />
                            <span>Roadmap Steps ({(selectedBlock.steps || []).length})</span>
                          </p>
                          <button 
                            onClick={() => {
                              const currentSteps = selectedBlock.steps || [
                                { id: 'step-1', step: '01', title: 'Pick Lego Blocks', desc: 'Browse the categories marketplace to stack premium blocks.' },
                                { id: 'step-2', step: '02', title: 'Tweak CSS Properties', desc: 'Customize padding, typography families, and borders.' },
                                { id: 'step-3', step: '03', title: 'Publish Instantly', desc: 'Click publish to route to live production-grade cloud servers.' }
                              ];
                              const newStepNum = String((currentSteps.length + 1)).padStart(2, '0');
                              const newStep = { 
                                id: `step-${Date.now()}`, 
                                step: newStepNum, 
                                title: 'Deploy Globally', 
                                desc: 'Serve dynamic routes via standard global CDN relays instantly.' 
                              };
                              handleUpdateBlockContent('steps', [...currentSteps, newStep]);
                            }}
                            className="flex items-center gap-1 text-[9px] text-blue-400 hover:text-blue-300 font-extrabold cursor-pointer uppercase bg-blue-950/40 border border-blue-900/40 px-2 py-1 rounded"
                          >
                            <Plus size={10} /> Add Step
                          </button>
                        </div>

                        <div className="space-y-3">
                          {(selectedBlock.steps || [
                            { id: 'step-1', step: '01', title: 'Pick Lego Blocks', desc: 'Browse the categories marketplace to stack premium blocks.' },
                            { id: 'step-2', step: '02', title: 'Tweak CSS Properties', desc: 'Customize padding, typography families, and borders.' },
                            { id: 'step-3', step: '03', title: 'Publish Instantly', desc: 'Click publish to route to live production-grade cloud servers.' }
                          ]).map((step, index) => (
                            <div key={step.id || index} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 space-y-2 relative">
                              <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                                <span className="text-[9px] font-extrabold text-blue-500 uppercase">STEP CARD 0{index + 1}</span>
                                <button 
                                  onClick={() => {
                                    const currentSteps = selectedBlock.steps || [
                                      { id: 'step-1', step: '01', title: 'Pick Lego Blocks', desc: 'Browse the categories marketplace to stack premium blocks.' },
                                      { id: 'step-2', step: '02', title: 'Tweak CSS Properties', desc: 'Customize padding, typography families, and borders.' },
                                      { id: 'step-3', step: '03', title: 'Publish Instantly', desc: 'Click publish to route to live production-grade cloud servers.' }
                                    ];
                                    const copy = currentSteps.filter(s => s.id !== step.id && s.title !== step.title);
                                    handleUpdateBlockContent('steps', copy);
                                  }}
                                  className="p-1 hover:bg-red-900/40 rounded text-slate-400 hover:text-red-400 cursor-pointer"
                                >
                                  <Trash2 size={10} />
                                </button>
                              </div>

                              <div className="space-y-2">
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="space-y-1 col-span-1">
                                    <label className="text-[8px] font-bold text-slate-500 uppercase">Step #</label>
                                    <input 
                                      type="text" 
                                      value={step.step}
                                      onChange={(e) => {
                                        const currentSteps = selectedBlock.steps || [
                                          { id: 'step-1', step: '01', title: 'Pick Lego Blocks', desc: 'Browse the categories marketplace to stack premium blocks.' },
                                          { id: 'step-2', step: '02', title: 'Tweak CSS Properties', desc: 'Customize padding, typography families, and borders.' },
                                          { id: 'step-3', step: '03', title: 'Publish Instantly', desc: 'Click publish to route to live production-grade cloud servers.' }
                                        ];
                                        const copy = [...currentSteps];
                                        copy[index] = { ...copy[index], step: e.target.value };
                                        handleUpdateBlockContent('steps', copy);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 outline-none font-mono"
                                    />
                                  </div>
                                  <div className="space-y-1 col-span-2">
                                    <label className="text-[8px] font-bold text-slate-500 uppercase">Step Title</label>
                                    <input 
                                      type="text" 
                                      value={step.title}
                                      onChange={(e) => {
                                        const currentSteps = selectedBlock.steps || [
                                          { id: 'step-1', step: '01', title: 'Pick Lego Blocks', desc: 'Browse the categories marketplace to stack premium blocks.' },
                                          { id: 'step-2', step: '02', title: 'Tweak CSS Properties', desc: 'Customize padding, typography families, and borders.' },
                                          { id: 'step-3', step: '03', title: 'Publish Instantly', desc: 'Click publish to route to live production-grade cloud servers.' }
                                        ];
                                        const copy = [...currentSteps];
                                        copy[index] = { ...copy[index], title: e.target.value };
                                        handleUpdateBlockContent('steps', copy);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 outline-none"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[8px] font-bold text-slate-500 uppercase">Step Outline Copy</label>
                                  <textarea 
                                    rows={2}
                                    value={step.desc}
                                    onChange={(e) => {
                                      const currentSteps = selectedBlock.steps || [
                                        { id: 'step-1', step: '01', title: 'Pick Lego Blocks', desc: 'Browse the categories marketplace to stack premium blocks.' },
                                        { id: 'step-2', step: '02', title: 'Tweak CSS Properties', desc: 'Customize padding, typography families, and borders.' },
                                        { id: 'step-3', step: '03', title: 'Publish Instantly', desc: 'Click publish to route to live production-grade cloud servers.' }
                                      ];
                                      const copy = [...currentSteps];
                                      copy[index] = { ...copy[index], desc: e.target.value };
                                      handleUpdateBlockContent('steps', copy);
                                    }}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 resize-none outline-none"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 8. GALLERY SLIDES & IMAGES */}
                    {(selectedBlock.galleryImages !== undefined || selectedBlock.type === 'Gallery') && (() => {
                      const defaultSlides = [
                        { id: 'slide-1', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600', title: 'Marketing Analytics Dashboard', subtitle: 'Advanced UI & Data visualization solutions' },
                        { id: 'slide-2', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600', title: 'Corporate Branding Strategy', subtitle: 'Elevating online presence across modern channels' },
                        { id: 'slide-3', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600', title: 'Interactive SaaS Platforms', subtitle: 'High-performance applications built for hyper-scale' }
                      ];
                      const currentSlides = selectedBlock.galleryImages || defaultSlides;

                      return (
                        <div className="space-y-3.5 pt-4 border-t border-slate-800">
                          <div className="flex justify-between items-center">
                            <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide flex items-center gap-1">
                              <ImageIcon size={11} className="text-blue-400" />
                              <span>Gallery Slides & Images ({currentSlides.length})</span>
                            </p>
                            <button 
                              onClick={() => {
                                const newSlide = { 
                                  id: `slide-${Date.now()}`, 
                                  url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600', 
                                  title: 'Premium Next-Gen Product Design', 
                                  subtitle: 'Sophisticated aesthetics meets performant engineering pipelines' 
                                };
                                handleUpdateBlockContent('galleryImages', [...currentSlides, newSlide]);
                              }}
                              className="flex items-center gap-1 text-[9px] text-blue-400 hover:text-blue-300 font-extrabold cursor-pointer uppercase bg-blue-950/40 border border-blue-900/40 px-2 py-1 rounded"
                            >
                              <Plus size={10} /> Add Slide
                            </button>
                            <button 
                              onClick={() => galleryFileInputRef.current?.click()}
                              disabled={uploadingImage}
                              className="flex items-center gap-1 text-[9px] text-emerald-400 hover:text-emerald-300 font-extrabold cursor-pointer uppercase bg-emerald-950/40 border border-emerald-900/40 px-2 py-1 rounded disabled:opacity-50"
                            >
                              {uploadingImage ? <Loader2 size={10} className="animate-spin" /> : <UploadCloud size={10} />}
                              {uploadingImage ? 'Uploading...' : 'Upload Images'}
                            </button>
                            <input
                              ref={galleryFileInputRef}
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files) handleGalleryImageUpload(e.target.files);
                              }}
                            />
                          </div>

                          <div className="space-y-3">
                            {currentSlides.map((slide, index) => (
                              <div key={slide.id || index} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 space-y-2 relative">
                                <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                                  <span className="text-[9px] font-extrabold text-blue-500 uppercase">SLIDE CARD 0{index + 1}</span>
                                  <div className="flex items-center gap-1">
                                    {index > 0 && (
                                      <button 
                                        onClick={() => {
                                          const copy = [...currentSlides];
                                          const temp = copy[index];
                                          copy[index] = copy[index - 1];
                                          copy[index - 1] = temp;
                                          handleUpdateBlockContent('galleryImages', copy);
                                        }}
                                        className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
                                      >
                                        <MoveUp size={10} />
                                      </button>
                                    )}
                                    {index < currentSlides.length - 1 && (
                                      <button 
                                        onClick={() => {
                                          const copy = [...currentSlides];
                                          const temp = copy[index];
                                          copy[index] = copy[index + 1];
                                          copy[index + 1] = temp;
                                          handleUpdateBlockContent('galleryImages', copy);
                                        }}
                                        className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
                                      >
                                        <MoveDown size={10} />
                                      </button>
                                    )}
                                    <button 
                                      onClick={() => {
                                        const copy = currentSlides.filter(s => s.id !== slide.id);
                                        handleUpdateBlockContent('galleryImages', copy);
                                      }}
                                      className="p-1 hover:bg-red-900/40 rounded text-slate-400 hover:text-red-400 cursor-pointer"
                                    >
                                      <Trash2 size={10} />
                                    </button>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                      <label className="text-[8px] font-bold text-slate-500 uppercase">Image URL</label>
                                      <span className="text-[7px] font-extrabold text-blue-400 bg-blue-950 px-1 py-0.2 rounded">📏 Rec: 800x600px</span>
                                    </div>
                                    <div className="flex gap-1.5">
                                      <input 
                                        type="text" 
                                        value={slide.url}
                                        onChange={(e) => {
                                          const copy = [...currentSlides];
                                          copy[index] = { ...copy[index], url: e.target.value };
                                          handleUpdateBlockContent('galleryImages', copy);
                                        }}
                                        className="flex-1 bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 font-mono outline-none"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const input = document.createElement('input');
                                          input.type = 'file';
                                          input.accept = 'image/*';
                                          input.onchange = async (e: any) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              setUploadingImage(true);
                                              try {
                                                const fileExt = file.name.split('.').pop();
                                                const fileName = `${site.id}/gallery/${Date.now()}-${index}.${fileExt}`;

                                                const { error: uploadError } = await supabase.storage
                                                  .from('site-assets')
                                                  .upload(fileName, file, { cacheControl: '3600', upsert: false });

                                                if (uploadError) throw uploadError;

                                                const { data: publicUrlData } = supabase.storage
                                                  .from('site-assets')
                                                  .getPublicUrl(fileName);

                                                const copy = [...currentSlides];
                                                copy[index] = { ...copy[index], url: publicUrlData.publicUrl };
                                                handleUpdateBlockContent('galleryImages', copy);
                                                triggerToast('Slide image uploaded successfully!', 'success');
                                              } catch (err: any) {
                                                console.error(err);
                                                triggerToast('Failed to upload image: ' + err.message, 'error');
                                              } finally {
                                                setUploadingImage(false);
                                              }
                                            }
                                          };
                                          input.click();
                                        }}
                                        disabled={uploadingImage}
                                        className="px-2 bg-blue-600 hover:bg-blue-500 rounded text-[9px] font-bold text-white transition-all cursor-pointer shrink-0 flex items-center justify-center gap-1 disabled:opacity-50"
                                      >
                                        {uploadingImage ? <Loader2 size={10} className="animate-spin" /> : <UploadCloud size={10} />}
                                        <span>Upload</span>
                                      </button>
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold text-slate-500 uppercase">Slide Header</label>
                                    <input 
                                      type="text" 
                                      value={slide.title}
                                      onChange={(e) => {
                                        const copy = [...currentSlides];
                                        copy[index] = { ...copy[index], title: e.target.value };
                                        handleUpdateBlockContent('galleryImages', copy);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 outline-none"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold text-slate-500 uppercase">Slide Caption Subtext</label>
                                    <input 
                                      type="text" 
                                      value={slide.subtitle}
                                      onChange={(e) => {
                                        const copy = [...currentSlides];
                                        copy[index] = { ...copy[index], subtitle: e.target.value };
                                        handleUpdateBlockContent('galleryImages', copy);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 outline-none"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                  </div>
                )}

              </div>
            </>
          )}

        </aside>

      </div>

      {/* ==========================================
          MODAL: ONE-CLICK LIVE PUBLISHING SETUP
          ========================================== */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl relative"
            id="publishing-modal"
          >
            <button 
              onClick={() => setShowPublishModal(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-blue-900/30 border border-blue-500/30 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-2 animate-pulse">
                <Globe size={24} />
              </div>
              <h2 className="text-lg font-black text-white">Publish Website to Production</h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">OnlyPage handles routing, instant Cloud Run containers hosting, and edge CDN cache propagation instantly.</p>
            </div>

            <div className="my-6 space-y-4">
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Deploy Target Target URL:</span>
                  <span className="text-xs font-black text-emerald-400 font-mono">LIVE PRODUCTION</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-xs text-slate-500 font-mono select-all">https://my-portfolio.onlypage.in</span>
                </div>
              </div>

              {/* Custom Domain mapping */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center justify-between">
                  <span>Custom DNS Domain Mapping</span>
                  <span className="text-[9px] text-blue-400 normal-case">PRO STUDIO PLAN</span>
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g. www.yourdomain.com"
                    disabled
                    className="flex-1 bg-slate-900/40 border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
                  />
                  <button className="px-3 py-2 bg-slate-800 text-[10px] font-extrabold uppercase rounded-xl text-slate-400 cursor-not-allowed">Map DNS</button>
                </div>
                <p className="text-[9px] text-slate-500 leading-normal">Setup absolute custom DNS records by routing CNAME records to our server clusters.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowPublishModal(false)}
                className="flex-1 py-2.5 border border-slate-800 hover:bg-slate-900 text-xs font-bold text-slate-300 rounded-xl"
              >
                Cancel Draft
              </button>
              <button 
                onClick={() => {
                  setShowPublishModal(false);
                  triggerToast('🚀 Congratulations! Your portfolio is now LIVE at my-portfolio.onlypage.in!', 'success');
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-black text-white rounded-xl shadow shadow-blue-500/20"
              >
                Deploy Live Release
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ==========================================
          MODAL: LIVE RESPONSIVE PREVIEW INTERACTIVE
          ========================================== */}
      {showLivePreviewModal && (
        <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col">
          
          {/* Preview Navigation Header */}
          <div className="h-14 border-b border-slate-800 bg-slate-950 px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-xs font-black text-slate-200">Live Preview Mode</span>
            </div>

            {/* Pages tab bar */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              {pages.map(page => (
                <button
                  key={page.id}
                  onClick={() => {
                    setPreviewPageId(page.id);
                    loadBlocksForPage(page.id);
                  }}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    previewPageId === page.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Files size={10} />
                  {page.name}
                </button>
              ))}
            </div>

            {/* Middle Screen controls */}
            <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              {['desktop', 'tablet', 'mobile'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewportMode(mode as any)}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold capitalize transition-all cursor-pointer ${
                    viewportMode === mode ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setShowLivePreviewModal(false);
                triggerToast('Returned to CSS builder space', 'info');
              }}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-black rounded-lg text-slate-300 flex items-center gap-1 cursor-pointer"
            >
              <X size={12} />
              <span>Exit Preview</span>
            </button>
          </div>

          {/* Interactive Live scroll space */}
          <div className="flex-1 bg-slate-900 overflow-y-auto p-8 flex items-start justify-center">
            
            <div 
              className={`w-full bg-white text-slate-900 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ${
                viewportMode === 'tablet' 
                  ? 'max-w-[768px]' 
                  : viewportMode === 'mobile' 
                    ? 'max-w-[390px]'
                    : 'max-w-6xl'
              }`}
            >
              {previewLoading ? (
                <div className="flex items-center justify-center py-32">
                  <Loader2 size={24} className="animate-spin text-blue-500" />
                  <span className="ml-3 text-sm text-slate-400 font-medium">Loading page blocks...</span>
                </div>
              ) : previewBlocks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                  <Layers size={32} className="mb-3 opacity-40" />
                  <p className="text-sm font-medium">No blocks on this page yet.</p>
                </div>
              ) : (
                <>
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
                          setPreviewPageId(targetPage.id);
                          loadBlocksForPage(targetPage.id);
                        }
                      }}
                      site={site}
                      activePageId={previewPageId}
                    />
                  )}
                  {previewBlocks.map(block => (
                    <div key={block.id}>
                      <BuilderRenderer 
                        block={block} 
                        isActive={false} 
                        onSelect={() => {}} 
                        siteId={site.id}
                        pages={pages}
                        site={site}
                        activePageId={previewPageId}
                      />
                    </div>
                  ))}
                  {globalFooter && (
                    <BuilderRenderer 
                      block={globalFooter} 
                      isActive={false} 
                      onSelect={() => {}} 
                      siteId={site.id}
                      pages={pages}
                      site={site}
                      activePageId={previewPageId}
                    />
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      )}

      {/* MODAL: ADD PAGE */}
      {showAddPageModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-4 text-left">
            <div>
              <h3 className="text-sm font-extrabold text-white">Create New Page</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Add a new route path to your website layout</p>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-[8px] font-black text-slate-500 uppercase block mb-1">Page Title</label>
                <input
                  type="text"
                  placeholder="e.g. Services"
                  value={newPageName}
                  onChange={(e) => {
                    setNewPageName(e.target.value);
                    setNewPageSlug('/' + e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="text-[8px] font-black text-slate-500 uppercase block mb-1">URL Route Path</label>
                <input
                  type="text"
                  placeholder="e.g. /services"
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => {
                  setShowAddPageModal(false);
                  setNewPageName('');
                  setNewPageSlug('');
                }}
                className="px-3.5 py-1.5 border border-slate-800 text-[11px] font-bold rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newPageName.trim() && newPageSlug.trim()) {
                    handleCreatePageInBuilder(newPageName, newPageSlug);
                    setShowAddPageModal(false);
                    setNewPageName('');
                    setNewPageSlug('');
                  }
                }}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-[11px] cursor-pointer"
              >
                Create Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING ON-CANVAS AI ASSISTANT PANEL */}
      {aiAssistantBlockId && (() => {
        const targetBlock = blocks.find(b => b.id === aiAssistantBlockId) || (globalHeader?.id === aiAssistantBlockId ? globalHeader : null) || (globalFooter?.id === aiAssistantBlockId ? globalFooter : null);
        if (!targetBlock) return null;
        
        return (
          <div className="fixed bottom-6 right-6 w-80 bg-slate-950/90 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-md z-45 flex flex-col gap-3 font-sans text-left animate-fade-in">
            <div className="flex justify-between items-center pb-2 border-b border-slate-850">
              <div className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-indigo-400 animate-pulse" />
                <span className="text-xs font-black text-slate-200">On-Canvas AI Assistant</span>
              </div>
              <button 
                onClick={() => setAiAssistantBlockId(null)}
                className="text-slate-500 hover:text-slate-350 cursor-pointer font-bold"
              >
                <X size={12} />
              </button>
            </div>
            
            <p className="text-[10px] text-slate-400 leading-normal">
              Editing: <span className="font-bold text-indigo-400 font-mono">{targetBlock.type}</span> section. Prompt AI to rewrite copy, change layout styles, or adjust tone.
            </p>
            
            <div className="space-y-1.5">
              <textarea
                value={aiAssistantPrompt}
                onChange={(e) => setAiAssistantPrompt(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    await handleExecuteAiAssistant();
                  }
                }}
                rows={3}
                placeholder="e.g. rewrite title to be more professional, change card border radius to 20px..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500 resize-none font-sans"
              />
            </div>
            
            {/* Quick Prompts Suggestions */}
            <div className="flex flex-wrap gap-1">
              {[
                'Make it punchy',
                'Dark futuristic style',
                'Luxury serif font',
                'Shorten description'
              ].map(qp => (
                <button
                  key={qp}
                  onClick={() => setAiAssistantPrompt(qp)}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-850 text-[8px] text-slate-400 hover:text-slate-200 hover:bg-slate-850 cursor-pointer font-bold"
                >
                  {qp}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center mt-1">
              <span className="text-[8px] font-mono text-slate-500">OnlyPage AI Assistant</span>
              <button
                onClick={handleExecuteAiAssistant}
                disabled={isAiLoading || !aiAssistantPrompt.trim()}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black text-[10px] rounded-lg flex items-center gap-1 cursor-pointer transition shadow-md shadow-indigo-600/10"
              >
                {isAiLoading ? <Loader2 size={10} className="animate-spin" /> : <Send size={10} />}
                <span>Transform Section</span>
              </button>
            </div>
          </div>
        );
      })()}

      {/* ==========================================
          NOTIFICATION TOAST OUTLINE
          ========================================== */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className={`fixed bottom-6 right-6 px-4 py-3 rounded-xl border shadow-2xl z-50 flex items-center gap-2.5 text-xs font-bold ${
              toast.type === 'success' 
                ? 'bg-emerald-950/95 border-emerald-500/30 text-emerald-300' 
                : toast.type === 'error'
                  ? 'bg-red-950/95 border-red-500/30 text-red-300'
                  : 'bg-slate-900/95 border-slate-700/80 text-slate-200'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
            ) : (
              <Info size={14} className="text-blue-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default WebsiteBuilderEditor;
