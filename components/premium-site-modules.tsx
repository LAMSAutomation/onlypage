import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Quote,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { WebBlock } from './builder-types';

const PREMIUM_SITE_MODULES = new Set([
  "premium-proof-rail",
  "premium-bento-grid",
  "premium-story-split",
  "premium-results-metrics",
  "premium-roadmap",
  "premium-testimonial-carousel",
  "premium-pricing-toggle",
  "premium-gallery-lightbox",
  "premium-faq",
  "premium-contact-panel",
  "signature-editorial",
  "signature-store",
  "signature-map",
]);

export const isPremiumSiteModuleVariant = (variant?: string) =>
  Boolean(variant && PREMIUM_SITE_MODULES.has(variant));

type PremiumSiteModuleProps = {
  block: WebBlock;
  isActive: boolean;
  onSelect: () => void;
  selectedSubElement?: string | null;
  onSelectSubElement?: (elementId: any) => void;
  onNavigatePage?: (slug: string) => void;
  site?: any;
  siteId?: string;
  ecomProducts?: any[];
};

const cleanSlug = (value = "") => value.replace(/^\/+|\/+$/g, "");

export function PremiumSiteModule({
  block,
  isActive,
  onSelect,
  selectedSubElement,
  onSelectSubElement,
  onNavigatePage,
  site,
  siteId,
  ecomProducts = [],
}: PremiumSiteModuleProps) {
  const [activeStory, setActiveStory] = useState(0);
  const [annualBilling, setAnnualBilling] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const accent = block.styles.accentColor || "#e0b82f";
  const surface = block.styles.backgroundColor || "#080808";

  const Editable = ({
    id,
    children,
    className = "",
  }: {
    id: string;
    children: React.ReactNode;
    className?: string;
  }) => {
    // Keep layout classes (e.g. @lg:col-span-*) on the live site too — the
    // editor wraps children in a div, so published pages must match or the
    // grid layout collapses.
    if (!isActive) {
      return className ? <div className={className}>{children}</div> : <>{children}</>;
    }
    return (
      <div
        onClick={(event) => {
          event.stopPropagation();
          onSelectSubElement?.(id);
        }}
        className={`relative cursor-pointer rounded-sm transition ${className} ${
          selectedSubElement === id
            ? "ring-2 ring-lime-500 ring-offset-2 ring-offset-transparent"
            : "hover:outline hover:outline-1 hover:outline-dashed hover:outline-lime-400"
        }`}
      >
        {children}
      </div>
    );
  };

  const actionHref = (type?: string, value?: string) => {
    if (type === "link" && value)
      return cleanSlug(value) === "home" ? "/" : `/${cleanSlug(value)}`;
    if (type === "external" && value)
      return /^https?:\/\//i.test(value) ? value : `https://${value}`;
    if (type === "phone" && value) return `tel:${value}`;
    if (type === "whatsapp") {
      const phone = String(value || site?.theme?.phone || "").replace(/\D/g, "");
      return phone ? `https://wa.me/${phone}` : "#";
    }
    if (type === "scroll" && value) return `#${value}`;
    if (type === "booking") return "#enquiry";
    return "#";
  };

  const runAction = (
    event: React.MouseEvent<HTMLAnchorElement>,
    type?: string,
    value?: string,
  ) => {
    if (isActive) {
      event.preventDefault();
      return;
    }
    if (type === "link" && value && onNavigatePage) {
      event.preventDefault();
      onNavigatePage(cleanSlug(value));
      return;
    }
    if (type === "scroll" && value) {
      event.preventDefault();
      document.getElementById(value)?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (type === "booking") {
      event.preventDefault();
      document.querySelector('[data-block-type="Forms"]')?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const Action = ({ label, type, value, secondary = false }: { label?: string; type?: string; value?: string; secondary?: boolean }) => {
    if (!label) return null;
    const external = type === "external" || type === "whatsapp";
    return (
      <a
        href={actionHref(type, value)}
        onClick={(event) => runAction(event, type, value)}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-xs font-black transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 ${
          secondary ? "border border-current/20 bg-transparent" : "text-[#080808]"
        }`}
        style={secondary ? undefined : { backgroundColor: accent, boxShadow: `0 16px 45px ${accent}26` }}
      >
        {label}<ArrowRight size={14} />
      </a>
    );
  };

  const Heading = ({ center = false }: { center?: boolean }) => (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {block.badge && (
        <Editable id="badge">
          <p className="text-[10px] font-black uppercase tracking-[0.28em]" style={{ color: accent }}>{block.badge}</p>
        </Editable>
      )}
      <Editable id="title">
        <h2 className="mt-4 text-balance font-['Poppins'] text-[clamp(2.2rem,5cqw,5rem)] font-bold leading-[0.98] tracking-[-0.06em]">{block.title}</h2>
      </Editable>
      {block.subtitle && (
        <Editable id="subtitle">
          <p className={`mt-5 text-sm leading-7 opacity-50 ${center ? "mx-auto max-w-2xl" : "max-w-xl"}`}>{block.subtitle}</p>
        </Editable>
      )}
    </div>
  );

  const sectionClass = "relative overflow-hidden text-white";
  const contentClass = "relative z-10 mx-auto w-full max-w-[1240px] px-6 @lg:px-8";

  if (block.variant === "signature-editorial") {
    const paragraphs = String(block.subtitle || "")
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
    return (
      <section className={sectionClass} style={{ backgroundColor: surface }} onClick={onSelect}>
        <div className={`${contentClass} grid gap-12 py-20 @lg:grid-cols-[.72fr_1.28fr] @lg:py-28`}>
          <div className="@lg:sticky @lg:top-24 @lg:self-start">
            {block.badge && <Editable id="badge"><p className="text-[10px] font-black uppercase tracking-[0.28em]" style={{ color: accent }}>{block.badge}</p></Editable>}
            <p className="mt-8 font-['Poppins'] text-7xl font-bold tracking-[-0.08em] text-white/[0.07]">01</p>
            <div className="mt-8 h-px w-16" style={{ backgroundColor: accent }} />
            <p className="mt-5 max-w-xs text-[10px] font-bold uppercase leading-5 tracking-[0.14em] text-white/32">A premium editorial block for point of view, founder notes, principles, and long-form brand stories.</p>
          </div>
          <div>
            <Editable id="title"><h2 className="text-balance font-['Poppins'] text-[clamp(2.8rem,6cqw,6.5rem)] font-bold leading-[0.93] tracking-[-0.07em]">{block.title}</h2></Editable>
            <Editable id="subtitle" className="mt-10"><div className="space-y-6 border-t border-white/[0.09] pt-8">{(paragraphs.length ? paragraphs : ["Add your story in the editor."]).map((paragraph, index) => <p key={index} className={`max-w-3xl leading-8 text-white/52 ${index === 0 ? "text-lg font-medium @md:text-2xl @md:leading-10" : "text-sm"}`}>{paragraph}</p>)}</div></Editable>
            {block.btnText && <Editable id="button" className="mt-9 inline-block"><Action label={block.btnText} type={block.btnActionType} value={block.btnActionValue} secondary /></Editable>}
          </div>
        </div>
      </section>
    );
  }

  if (block.variant === "signature-store") {
    const products = ecomProducts.slice(0, 6);
    const phone = String(block.contactPhone || site?.theme?.phone || "").replace(/\D/g, "");
    return (
      <section className={sectionClass} style={{ backgroundColor: surface }} onClick={onSelect}>
        <div className={`${contentClass} py-20 @lg:py-28`}>
          <div className="flex flex-col gap-8 @lg:flex-row @lg:items-end @lg:justify-between"><Heading /><Editable id="button" className="w-fit"><Action label={block.btnText} type={block.btnActionType} value={block.btnActionValue} secondary /></Editable></div>
          {products.length ? (
            <div className="mt-12 grid gap-4 @md:grid-cols-2 @lg:grid-cols-3">
              {products.map((product, index) => {
                const orderUrl = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(`Hi, I would like to order ${product.title}.`)}` : `mailto:${block.contactEmail || "hello@example.com"}?subject=${encodeURIComponent(`Product enquiry: ${product.title}`)}`;
                return <Editable key={product.id} id={`card:${index}`}><article className="group flex h-full min-h-[480px] flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03]"><div className="relative aspect-[4/3] overflow-hidden bg-white/[0.04]">{product.image ? <img src={product.image} alt={product.title} className="size-full object-cover transition duration-700 group-hover:scale-105" /> : <div className="grid size-full place-items-center text-white/15"><Sparkles size={40} /></div>}{product.offer_badge && <span className="absolute left-4 top-4 rounded-full px-3 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-black" style={{ backgroundColor: accent }}>{product.offer_badge}</span>}</div><div className="flex flex-1 flex-col p-6"><p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/32">{product.category || "Featured product"}</p><h3 className="mt-3 text-xl font-black tracking-[-0.035em]">{product.title}</h3><p className="mt-3 line-clamp-3 text-xs leading-6 text-white/42">{product.description}</p><div className="mt-auto flex items-end justify-between gap-4 pt-8"><div><strong className="text-2xl font-black">₹{product.price}</strong>{product.compare_at && <span className="ml-2 text-xs text-white/30 line-through">₹{product.compare_at}</span>}<p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-emerald-400">{Number(product.stock || 0) > 0 ? `${product.stock} available` : "Enquire for availability"}</p></div><a href={orderUrl} target="_blank" rel="noreferrer" onClick={(event) => { if (isActive) event.preventDefault(); }} className="grid size-11 place-items-center rounded-full text-black transition hover:scale-105" style={{ backgroundColor: accent }} aria-label={`Order ${product.title}`}><ArrowRight size={16} /></a></div></div></article></Editable>;
              })}
            </div>
          ) : <div className="mt-12 grid min-h-72 place-items-center rounded-3xl border border-dashed border-white/12 bg-white/[0.02] text-center"><div><Sparkles className="mx-auto text-white/20" size={32} /><p className="mt-4 text-sm font-black">Your Signature product edit is ready</p><p className="mt-2 text-xs text-white/35">Add products in Store &amp; Products to publish this shelf.</p></div></div>}
        </div>
      </section>
    );
  }

  if (block.variant === "signature-map") {
    const address = block.mapAddress || block.contactAddress || "Bengaluru, India";
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    return (
      <section className={sectionClass} style={{ backgroundColor: surface }} onClick={onSelect}>
        <div className={`${contentClass} grid gap-8 py-20 @lg:grid-cols-[.72fr_1.28fr] @lg:py-28`}>
          <div className="flex flex-col rounded-3xl border border-white/[0.08] bg-white/[0.03] p-7 @lg:p-10"><Heading /><div className="mt-10 space-y-4 border-t border-white/[0.09] pt-7 text-xs text-white/48"><p className="flex items-start gap-3 leading-6"><MapPin size={16} className="mt-1 shrink-0" style={{ color: accent }} />{address}</p>{block.contactPhone && <a href={`tel:${block.contactPhone}`} className="flex items-center gap-3 hover:text-white"><Phone size={15} style={{ color: accent }} />{block.contactPhone}</a>}{block.contactEmail && <a href={`mailto:${block.contactEmail}`} className="flex items-center gap-3 hover:text-white"><Mail size={15} style={{ color: accent }} />{block.contactEmail}</a>}</div><a href={mapsUrl} target="_blank" rel="noreferrer" className="mt-auto inline-flex items-center gap-2 pt-10 text-xs font-black" style={{ color: accent }}>Open directions <ExternalLink size={13} /></a></div>
          <Editable id="media"><div className="relative min-h-[520px] overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03]"><iframe title="Business location" src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`} className="absolute inset-0 size-full grayscale-[.85] contrast-125 invert-[.92]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" /></div></Editable>
        </div>
      </section>
    );
  }

  if (block.variant === "premium-proof-rail") {
    const stats = block.stats || [];
    return (
      <section className={`${sectionClass} border-y border-white/[0.07]`} style={{ backgroundColor: surface }} onClick={onSelect}>
        <div className={`${contentClass} grid gap-px py-2 @md:grid-cols-2 @lg:grid-cols-4`}>
          {stats.map((stat, index) => (
            <Editable key={stat.id} id={`card:${index}`}>
              <div className="group flex min-h-28 items-center gap-4 border-white/[0.07] px-4 py-5 @lg:border-r @lg:px-7">
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/10 text-[10px] font-black" style={{ color: accent }}>{String(index + 1).padStart(2, "0")}</span>
                <div><strong className="block text-2xl font-black tracking-[-0.04em]">{stat.val}{stat.suffix}</strong><span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.14em] text-white/38">{stat.label}</span></div>
              </div>
            </Editable>
          ))}
        </div>
      </section>
    );
  }

  if (block.variant === "premium-bento-grid") {
    const features = block.features || [];
    return (
      <section className={sectionClass} style={{ backgroundColor: surface }} onClick={onSelect}>
        <div className={`${contentClass} py-20 @lg:py-28`}>
          <Heading />
          <div className="mt-12 grid gap-4 @md:grid-cols-2 @lg:grid-cols-6">
            {features.map((item, index) => (
              <Editable key={item.id} id={`card:${index}`} className={index === 0 ? "@lg:col-span-4" : index === 1 ? "@lg:col-span-2" : "@lg:col-span-3"}>
                <a href={actionHref(item.linkActionType, item.linkActionValue)} onClick={(event) => runAction(event, item.linkActionType, item.linkActionValue)} className="group relative flex min-h-[340px] overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.035] p-7 @lg:p-9">
                  {item.imageUrl && <img src={item.imageUrl} alt="" className="absolute inset-0 size-full object-cover opacity-45 transition duration-700 group-hover:scale-105 group-hover:opacity-55" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
            <div className="relative mt-auto max-w-xl min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: accent }}>{item.eyebrow || `Capability ${index + 1}`}</p>
              <h3 className="mt-3 text-2xl font-black tracking-[-0.04em] @lg:text-3xl">{item.title}</h3>
                    <p className="mt-3 max-w-lg text-xs leading-6 text-white/55">{item.desc}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em]" style={{ color: accent }}>{item.linkText || "Explore"}<ExternalLink size={12} /></span>
                  </div>
                </a>
              </Editable>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (block.variant === "premium-story-split") {
    return (
      <section className={sectionClass} style={{ backgroundColor: surface }} onClick={onSelect}>
        <div className={`${contentClass} grid items-center gap-10 py-20 @lg:grid-cols-[1.08fr_.92fr] @lg:py-28`}>
          <Editable id="media"><div className="relative min-h-[520px] overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03]">{block.imageUrl && <img src={block.imageUrl} alt="" className="absolute inset-0 size-full object-cover" />}<div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" /><div className="absolute bottom-6 left-6 rounded-full border border-white/15 bg-black/45 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] backdrop-blur">Real work · real context</div></div></Editable>
          <div className="@lg:pl-8">
            <Heading />
            <div className="mt-8 space-y-3">
              {(block.features || []).slice(0, 4).map((item, index) => <Editable key={item.id} id={`card:${index}`}><div className="flex gap-4 border-t border-white/[0.08] py-4"><span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full" style={{ backgroundColor: `${accent}1f`, color: accent }}><Check size={13} /></span><div><h3 className="text-sm font-black">{item.title}</h3><p className="mt-1 text-xs leading-5 text-white/42">{item.desc}</p></div></div></Editable>)}
            </div>
            <Editable id="button" className="mt-8 inline-block"><Action label={block.btnText} type={block.btnActionType} value={block.btnActionValue} /></Editable>
          </div>
        </div>
      </section>
    );
  }

  if (block.variant === "premium-results-metrics") {
    return (
      <section className={sectionClass} style={{ backgroundColor: surface }} onClick={onSelect}>
        <div className={`${contentClass} py-20 @lg:py-28`}>
          <Heading center />
          <div className="mt-14 grid gap-3 @md:grid-cols-2 @lg:grid-cols-4">
            {(block.stats || []).map((stat, index) => <Editable key={stat.id} id={`card:${index}`}><article className="relative min-h-56 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] p-7"><div className="absolute -right-8 -top-8 size-28 rounded-full blur-3xl" style={{ backgroundColor: `${accent}22` }} /><strong className="relative block font-['Poppins'] text-5xl font-bold tracking-[-0.07em] @lg:text-6xl" style={{ color: index === 0 ? accent : undefined }}>{stat.val}{stat.suffix}</strong><span className="absolute bottom-7 left-7 right-7 border-t border-white/[0.08] pt-5 text-[10px] font-black uppercase tracking-[0.16em] text-white/42">{stat.label}</span></article></Editable>)}
          </div>
        </div>
      </section>
    );
  }

  if (block.variant === "premium-roadmap") {
    const steps = block.steps || [];
    return (
      <section className={sectionClass} style={{ backgroundColor: surface }} onClick={onSelect}>
        <div className={`${contentClass} py-20 @lg:py-28`}>
          <Heading />
          <div className="relative mt-14 grid gap-4 @lg:grid-cols-4">
            <div className="absolute left-[12.5%] right-[12.5%] top-6 hidden h-px bg-white/10 @lg:block" />
            {steps.map((step, index) => <Editable key={step.id} id={`card:${index}`}><article className="relative rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 @lg:border-0 @lg:bg-transparent @lg:p-0"><span className="relative z-10 grid size-12 place-items-center rounded-full border border-white/12 bg-[#111] text-xs font-black" style={{ color: accent }}>{step.step}</span><h3 className="mt-8 text-lg font-black tracking-[-0.03em]">{step.title}</h3><p className="mt-3 text-xs leading-6 text-white/42">{step.desc}</p></article></Editable>)}
          </div>
        </div>
      </section>
    );
  }

  if (block.variant === "premium-testimonial-carousel") {
    const stories = block.testimonials || [];
    const story = stories[Math.min(activeStory, Math.max(stories.length - 1, 0))];
    const move = (direction: number) => setActiveStory((current) => stories.length ? (current + direction + stories.length) % stories.length : 0);
    return (
      <section className={sectionClass} style={{ backgroundColor: surface }} onClick={onSelect}>
        <div className={`${contentClass} py-20 @lg:py-28`}>
          <div className="grid gap-12 @lg:grid-cols-[.7fr_1.3fr] @lg:items-end">
            <div><Heading /><div className="mt-8 flex gap-2"><button type="button" aria-label="Previous story" onClick={(event) => { event.stopPropagation(); move(-1); }} className="grid size-12 place-items-center rounded-full border border-white/12 hover:bg-white hover:text-black"><ArrowLeft size={16} /></button><button type="button" aria-label="Next story" onClick={(event) => { event.stopPropagation(); move(1); }} className="grid size-12 place-items-center rounded-full border border-white/12 hover:bg-white hover:text-black"><ArrowRight size={16} /></button></div></div>
            {story ? <Editable id={`card:${activeStory}`}><article className="relative min-h-[390px] rounded-3xl border border-white/[0.08] bg-white/[0.035] p-7 @md:p-10 @lg:p-14"><Quote size={38} style={{ color: accent }} className="opacity-55" /><p className="mt-10 max-w-3xl text-balance text-2xl font-semibold leading-[1.35] tracking-[-0.035em] @md:text-4xl">“{story.content}”</p><div className="mt-12 flex items-center gap-4 border-t border-white/[0.08] pt-7">{story.avatar ? <img src={story.avatar} alt="" className="size-12 rounded-full object-cover" /> : <span className="grid size-12 place-items-center rounded-full bg-white/8 text-sm font-black">{story.name.slice(0, 1)}</span>}<div><h3 className="text-sm font-black">{story.name}</h3><p className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em]" style={{ color: accent }}>{story.role}</p></div><div className="ml-auto hidden gap-1 @md:flex">{Array.from({ length: story.rating || 5 }).map((_, index) => <Star key={index} size={13} fill={accent} color={accent} />)}</div></div></article></Editable> : <div className="rounded-3xl border border-dashed border-white/15 p-12 text-white/40">Add customer stories in the editor.</div>}
          </div>
        </div>
      </section>
    );
  }

  if (block.variant === "premium-pricing-toggle") {
    const annualPrice = (price: string) => price.replace(/[\d,]+/, (match) => Math.round(Number(match.replace(/,/g, "")) * 0.8).toLocaleString("en-IN"));
    return (
      <section className={sectionClass} style={{ backgroundColor: surface }} onClick={onSelect}>
        <div className={`${contentClass} py-20 @lg:py-28`}>
          <div className="flex flex-col gap-8 @lg:flex-row @lg:items-end @lg:justify-between"><Heading /><div className="inline-flex w-fit rounded-full border border-white/10 bg-white/[0.04] p-1"><button type="button" onClick={(event) => { event.stopPropagation(); setAnnualBilling(false); }} className={`rounded-full px-5 py-2.5 text-[10px] font-black ${!annualBilling ? "bg-white text-black" : "text-white/40"}`}>Monthly</button><button type="button" onClick={(event) => { event.stopPropagation(); setAnnualBilling(true); }} className={`rounded-full px-5 py-2.5 text-[10px] font-black ${annualBilling ? "text-black" : "text-white/40"}`} style={annualBilling ? { backgroundColor: accent } : undefined}>Annual · save 20%</button></div></div>
          <div className="mt-12 grid gap-4 @lg:grid-cols-3">
            {(block.pricing || []).map((plan, index) => <Editable key={plan.id} id={`card:${index}`}><article className={`relative flex h-full min-h-[500px] flex-col rounded-3xl border p-7 @lg:p-9 ${plan.popular ? "border-white/25 bg-white/[0.075]" : "border-white/[0.08] bg-white/[0.025]"}`}>{plan.popular && <span className="absolute right-6 top-6 rounded-full px-3 py-1 text-[8px] font-black uppercase tracking-[0.14em] text-black" style={{ backgroundColor: accent }}>Recommended</span>}<p className="text-xs font-black uppercase tracking-[0.16em] text-white/45">{plan.tier}</p><div className="mt-8"><strong className="font-['Poppins'] text-5xl font-bold tracking-[-0.07em]">{annualBilling ? annualPrice(plan.price) : plan.price}</strong><span className="ml-2 text-xs text-white/35">/ month</span></div><p className="mt-2 text-[10px] text-white/30">{annualBilling ? "Billed annually" : "Billed monthly"}</p><ul className="mt-9 space-y-4 border-t border-white/[0.08] pt-8">{plan.features.map((feature) => <li key={feature} className="flex gap-3 text-xs leading-5 text-white/55"><Check size={14} className="mt-0.5 shrink-0" style={{ color: accent }} />{feature}</li>)}</ul><div className="mt-auto pt-9"><Action label={plan.btnText} type={block.btnActionType} value={block.btnActionValue} secondary={!plan.popular} /></div></article></Editable>)}
          </div>
        </div>
      </section>
    );
  }

  if (block.variant === "premium-gallery-lightbox") {
    const images = block.galleryImages || [];
    return (
      <section className={sectionClass} style={{ backgroundColor: surface }} onClick={onSelect}>
        <div className={`${contentClass} py-20 @lg:py-28`}>
          <Heading />
          <div className="mt-12 grid auto-rows-[190px] gap-3 @md:grid-cols-2 @lg:grid-cols-4">
            {images.map((image, index) => <div key={image.id} className={index === 0 ? "@md:row-span-2 @lg:col-span-2" : index === 3 ? "@lg:col-span-2" : ""}><button type="button" onClick={(event) => { event.stopPropagation(); if (isActive) onSelectSubElement?.(`card:${index}`); else setLightboxIndex(index); }} className={`group relative size-full overflow-hidden rounded-2xl border border-white/[0.07] text-left ${isActive && selectedSubElement === `card:${index}` ? "ring-2 ring-lime-500" : ""}`}><img src={image.url} alt={image.title} className="size-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" /><div className="absolute bottom-0 p-5"><h3 className="text-sm font-black">{image.title}</h3><p className="mt-1 text-[10px] text-white/48">{image.subtitle}</p></div></button></div>)}
          </div>
        </div>
        {lightboxIndex !== null && images[lightboxIndex] && <div role="dialog" aria-modal="true" aria-label="Image preview" onClick={() => setLightboxIndex(null)} className="fixed inset-0 z-[200] grid place-items-center bg-black/90 p-5 backdrop-blur-xl"><button type="button" aria-label="Close image preview" onClick={() => setLightboxIndex(null)} className="absolute right-5 top-5 grid size-11 place-items-center rounded-full border border-white/15 text-white"><X size={18} /></button><div className="max-w-5xl" onClick={(event) => event.stopPropagation()}><img src={images[lightboxIndex].url} alt={images[lightboxIndex].title} className="max-h-[78vh] w-auto rounded-2xl object-contain" /><div className="mt-4 flex items-center justify-between"><div><h3 className="font-black">{images[lightboxIndex].title}</h3><p className="mt-1 text-xs text-white/45">{images[lightboxIndex].subtitle}</p></div><span className="text-xs text-white/35">{lightboxIndex + 1} / {images.length}</span></div></div></div>}
      </section>
    );
  }

  if (block.variant === "premium-faq") {
    return (
      <section className={sectionClass} style={{ backgroundColor: surface }} onClick={onSelect}>
        <div className={`${contentClass} grid gap-12 py-20 @lg:grid-cols-[.75fr_1.25fr] @lg:py-28`}>
          <div><Heading /><div className="mt-8"><Action label={block.btnText} type={block.btnActionType} value={block.btnActionValue} secondary /></div></div>
          <div className="border-t border-white/[0.09]">
            {(block.faqs || []).map((faq, index) => { const open = openFaq === index; return <Editable key={faq.id} id={`card:${index}`}><article className="border-b border-white/[0.09]"><button type="button" aria-expanded={open} onClick={(event) => { event.stopPropagation(); setOpenFaq(open ? -1 : index); }} className="flex w-full items-center justify-between gap-6 py-6 text-left"><span className="text-base font-black tracking-[-0.025em] @md:text-lg">{faq.q}</span><span className={`grid size-8 shrink-0 place-items-center rounded-full border border-white/10 transition ${open ? "rotate-180" : ""}`}><ChevronDown size={15} /></span></button>{open && <p className="max-w-2xl pb-7 pr-10 text-sm leading-7 text-white/45">{faq.a}</p>}</article></Editable>; })}
          </div>
        </div>
      </section>
    );
  }

  if (block.variant === "premium-contact-panel") {
    const fields = block.formFields || [];
    const submit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isActive || submitting) return;
      const form = event.currentTarget;
      const data = new FormData(form);
      setSubmitError("");
      setSubmitting(true);
      try {
        if (siteId) {
          const firstName = String(data.get("first_name") || "");
          const lastName = String(data.get("last_name") || "");
          const name = String(data.get("name") || `${firstName} ${lastName}`).trim() || "Website enquiry";
          const email = String(data.get("email") || "no-email@example.com");
          const phone = String(data.get("phone") || "");
          const details = [...data.entries()].filter(([key]) => !/password/i.test(key)).map(([key, value]) => `${key}: ${String(value)}`).join(" · ").slice(0, 420);
          const { error } = await supabase.from("leads").insert({ site_id: siteId, name, email, phone, status: "New", source: `${block.title}${details ? `: ${details}` : ""}` });
          if (error) throw error;
        }
        setSubmitted(true);
        form.reset();
      } catch (error) {
        console.error("Premium contact form failed:", error);
        setSubmitError("We could not send this yet. Please try again or contact the team directly.");
      } finally {
        setSubmitting(false);
      }
    };
    const fieldClass = "w-full rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/30 focus:ring-4 focus:ring-white/5";
    return (
      <section id="enquiry" className={sectionClass} style={{ backgroundColor: surface }} onClick={onSelect}>
        <div className={`${contentClass} grid gap-10 py-20 @lg:grid-cols-[.78fr_1.22fr] @lg:py-28`}>
          <div><Heading /><div className="mt-10 space-y-3 border-t border-white/[0.09] pt-7 text-xs text-white/48">{block.contactEmail && <a href={`mailto:${block.contactEmail}`} className="flex items-center gap-3 hover:text-white"><Mail size={15} style={{ color: accent }} />{block.contactEmail}</a>}{block.contactPhone && <a href={`tel:${block.contactPhone}`} className="flex items-center gap-3 hover:text-white"><Phone size={15} style={{ color: accent }} />{block.contactPhone}</a>}{block.contactAddress && <p className="flex items-start gap-3 leading-5"><MapPin size={15} className="mt-0.5 shrink-0" style={{ color: accent }} />{block.contactAddress}</p>}</div>{block.contactPhone && <a href={actionHref("whatsapp", block.contactPhone)} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 text-xs font-black" style={{ color: accent }}><MessageCircle size={15} />Continue on WhatsApp</a>}</div>
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5 @md:p-8 @lg:p-10">
            {submitted ? <div className="grid min-h-[420px] place-items-center text-center"><div><span className="mx-auto grid size-14 place-items-center rounded-full" style={{ backgroundColor: accent, color: "#080808" }}><Check size={24} /></span><h3 className="mt-5 text-2xl font-black">Message received</h3><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/45">{block.successMessage || "The team will contact you shortly."}</p><button type="button" onClick={() => setSubmitted(false)} className="mt-6 text-xs font-black" style={{ color: accent }}>Send another message</button></div></div> : <form onSubmit={submit} className="grid gap-5 @md:grid-cols-2">{fields.map((field) => <label key={field.id} className={field.width === "half" ? "block" : "block @md:col-span-2"}><span className="mb-2 block text-[9px] font-black uppercase tracking-[0.16em]" style={{ color: accent }}>{field.label}{field.required ? " *" : ""}</span>{field.type === "textarea" ? <textarea name={field.name} required={field.required} placeholder={field.placeholder} rows={5} className={`${fieldClass} resize-y`} /> : field.type === "select" ? <select name={field.name} required={field.required} defaultValue="" className={fieldClass}><option value="" disabled className="bg-[#171717]">Select an option</option>{(field.options || []).map((option) => <option key={option} value={option} className="bg-[#171717]">{option}</option>)}</select> : <input name={field.name} type={field.type} required={field.required} placeholder={field.placeholder} className={fieldClass} />}</label>)}<button type="submit" disabled={submitting} className="@md:col-span-2 mt-2 inline-flex min-h-14 items-center justify-center gap-2 rounded-xl text-sm font-black text-[#080808] disabled:opacity-50" style={{ backgroundColor: accent }}>{submitting ? "Sending…" : block.btnText || "Send enquiry"}<Send size={15} /></button>{submitError && <p role="alert" className="@md:col-span-2 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-center text-xs text-red-100">{submitError}</p>}<p className="@md:col-span-2 flex items-center justify-center gap-2 text-[10px] text-white/28"><ShieldCheck size={13} />Your details are used only to respond to this enquiry.</p></form>}
          </div>
        </div>
      </section>
    );
  }

  return null;
}
