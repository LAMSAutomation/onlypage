import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  Instagram,
  Lock,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Quote,
  Send,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { WebBlock } from "./website-builder-editor";

const ACADEMY_VARIANTS = new Set([
  "academy-cinematic",
  "academy-courses",
  "academy-session",
  "academy-stories",
  "academy-process",
  "academy-spotlight",
  "academy-enquiry",
  "academy-registration",
  "academy-portal",
  "nav-academy",
  "footer-academy",
]);

export const isPremiumAcademyVariant = (variant?: string) =>
  Boolean(variant && ACADEMY_VARIANTS.has(variant));

type AcademyProps = {
  block: WebBlock;
  isActive: boolean;
  onSelect: () => void;
  selectedSubElement?: string | null;
  onSelectSubElement?: (elementId: any) => void;
  onNavigatePage?: (slug: string) => void;
  site?: any;
  siteId?: string;
  pages?: any[];
};

type ActionProps = {
  label?: string;
  type?: string;
  value?: string;
  secondary?: boolean;
  className?: string;
};

const cleanSlug = (value = "") => value.replace(/^\/+|\/+$/g, "");

export function PremiumAcademyBlock({
  block,
  isActive,
  onSelect,
  selectedSubElement,
  onSelectSubElement,
  onNavigatePage,
  site,
  siteId,
  pages = [],
}: AcademyProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [portalMode, setPortalMode] = useState<"login" | "request">("login");
  const [showPassword, setShowPassword] = useState(false);
  const styles = block.styles;
  const accent = styles.accentColor || "#e3b92f";
  const brand = block.title || site?.business_name || "Academy";
  const pageLinks = useMemo(() => {
    const configured = block.links || [];
    if (pages.length) {
      return pages.map((page: any) => {
        const match = configured.find(
          (link) => cleanSlug(link.url).toLowerCase() === cleanSlug(page.slug).toLowerCase(),
        );
        return {
          id: match?.id || page.id,
          label: match?.label || page.name,
          url: page.slug,
        };
      });
    }
    return configured;
  }, [block.links, pages]);

  const Editable = ({
    id,
    children,
    className = "",
  }: {
    id: string;
    children: React.ReactNode;
    className?: string;
  }) => {
    if (!isActive) return <>{children}</>;
    const selected = selectedSubElement === id;
    return (
      <div
        onClick={(event) => {
          event.stopPropagation();
          onSelectSubElement?.(id);
        }}
        className={`relative cursor-pointer rounded-sm transition ${className} ${
          selected
            ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent"
            : "hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400"
        }`}
      >
        {children}
      </div>
    );
  };

  const actionHref = (type?: string, value?: string) => {
    if (type === "link" && value) return cleanSlug(value) === "home" ? "/" : `/${cleanSlug(value)}`;
    if (type === "external" && value) return /^https?:\/\//i.test(value) ? value : `https://${value}`;
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
      document.getElementById(value)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (type === "booking") {
      event.preventDefault();
      document.querySelector('[data-block-type="Forms"]')?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const Action = ({ label, type, value, secondary, className = "" }: ActionProps) => {
    if (!label) return null;
    const href = actionHref(type, value);
    const external = type === "external" || type === "whatsapp";
    return (
      <a
        href={href}
        onClick={(event) => runAction(event, type, value)}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-xs font-extrabold transition duration-300 focus-visible:outline-none focus-visible:ring-4 ${
          secondary
            ? "border border-white/25 bg-black/20 text-white hover:border-white/60 hover:bg-white/10"
            : "text-[#090909] hover:-translate-y-0.5 hover:brightness-105"
        } ${className}`}
        style={secondary ? undefined : { backgroundColor: accent, boxShadow: `0 14px 35px ${accent}22` }}
      >
        {label}
        <ArrowRight size={14} />
      </a>
    );
  };

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isActive || submitting) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setSubmitError("");
    setSubmitting(true);
    try {
      if (siteId && block.variant !== "academy-portal") {
        const firstName = String(data.get("first_name") || "");
        const lastName = String(data.get("last_name") || "");
        const name = String(data.get("name") || data.get("full_name") || `${firstName} ${lastName}`).trim();
        const email = String(data.get("email") || "");
        const phone = String(data.get("phone") || "");
        const safeDetails = [...data.entries()]
          .filter(([key]) => !/password/i.test(key))
          .map(([key, value]) => `${key}: ${String(value)}`)
          .join(" · ")
          .slice(0, 420);
        const amountValue = String(data.get("amount") || "").replace(/[^0-9.]/g, "");
        const { error } = await supabase.from("leads").insert({
          site_id: siteId,
          name: name || "Website enquiry",
          email: email || "no-email@example.com",
          phone,
          status: block.whatsappFollowUp === false ? "lead" : "New",
          amount: amountValue ? Number(amountValue) : null,
          source: `${block.title || "Academy form"}${safeDetails ? `: ${safeDetails}` : ""}`,
        });
        if (error) throw error;
      }
      setSubmitted(true);
      form.reset();
    } catch (error) {
      console.error("Academy form submission failed:", error);
      setSubmitError("We could not send this yet. Please try again or contact the academy directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const Field = ({ field }: { field: NonNullable<WebBlock["formFields"]>[number] }) => {
    const shared =
      "w-full rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#e3b92f]/60 focus:bg-white/[0.07] focus:ring-4 focus:ring-[#e3b92f]/10";
    const type = field.type === "password" && showPassword ? "text" : field.type;
    return (
      <label className={field.width === "half" ? "block @md:col-span-1" : "block @md:col-span-2"}>
        <span className="mb-2 block text-[9px] font-black uppercase tracking-[0.18em] text-[#b99a31]">
          {field.label}{field.required ? " *" : ""}
        </span>
        <span className="relative block">
          {field.type === "textarea" ? (
            <textarea name={field.name} required={field.required} placeholder={field.placeholder} rows={4} className={`${shared} resize-y`} />
          ) : field.type === "select" ? (
            <select name={field.name} required={field.required} className={shared} defaultValue="">
              <option value="" disabled className="bg-[#171717]">Select an option</option>
              {(field.options || []).map((option) => <option key={option} value={option} className="bg-[#171717]">{option}</option>)}
            </select>
          ) : (
            <input name={field.name} type={type} required={field.required} placeholder={field.placeholder} className={shared} />
          )}
          {field.type === "password" && (
            <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </span>
      </label>
    );
  };

  const defaultFields: NonNullable<WebBlock["formFields"]> = [
    { id: "name", label: "Full name", name: "name", type: "text", required: true, width: "full", placeholder: "Your name" },
    { id: "email", label: "Email", name: "email", type: "email", required: true, width: "half", placeholder: "you@example.com" },
    { id: "phone", label: "Phone", name: "phone", type: "tel", required: false, width: "half", placeholder: "+91 98765 43210" },
    { id: "message", label: "How can we help?", name: "message", type: "textarea", required: false, width: "full", placeholder: "Tell us about your goals" },
  ];
  const formFields = block.formFields?.length ? block.formFields : defaultFields;

  const sectionClass = "relative overflow-hidden";
  const contentClass = "relative z-10 mx-auto w-full";

  if (block.variant === "nav-academy") {
    return (
      <header className="relative z-30 w-full" onClick={onSelect}>
        <div className="mx-auto flex min-h-16 max-w-[1280px] items-center justify-between gap-5 px-5 @lg:px-8">
          <Editable id="title">
            <a href="/" onClick={(event) => runAction(event, "link", "home")} className="text-sm font-black tracking-[-0.03em] text-white @md:text-base">
              {brand}
            </a>
          </Editable>
          <nav className="hidden items-center gap-7 @lg:flex" aria-label="Primary navigation">
            {pageLinks.slice(0, 3).map((link) => (
              <a key={link.id} href={actionHref("link", link.url)} onClick={(event) => runAction(event, "link", link.url)} className="text-[11px] font-bold text-white/55 transition hover:text-white">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-2 @lg:flex">
            <Action label={block.secondaryBtnText} type={block.secondaryBtnActionType} value={block.secondaryBtnActionValue} secondary className="min-h-9 px-4 py-2" />
            <Action label={block.btnText} type={block.btnActionType} value={block.btnActionValue} className="min-h-9 px-4 py-2" />
          </div>
          <button type="button" aria-label="Toggle navigation" onClick={(event) => { event.stopPropagation(); setMobileOpen((current) => !current); }} className="grid size-10 place-items-center rounded-full border border-white/15 text-white @lg:hidden">
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {mobileOpen && (
          <nav className="border-t border-white/10 bg-[#070707]/95 px-5 py-5 @lg:hidden" aria-label="Mobile navigation">
            <div className="grid gap-1">
              {pageLinks.map((link) => (
                <a key={link.id} href={actionHref("link", link.url)} onClick={(event) => { runAction(event, "link", link.url); setMobileOpen(false); }} className="rounded-lg px-3 py-3 text-sm font-bold text-white/75 hover:bg-white/5 hover:text-white">
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>
    );
  }

  if (block.variant === "footer-academy") {
    return (
      <footer className="bg-[#f7f7f5] text-[#121212]" onClick={onSelect}>
        <div className="mx-auto max-w-[1280px] px-6 py-14 @lg:px-8 @lg:py-20">
          <div className="grid gap-10 @md:grid-cols-2 @lg:grid-cols-[1.25fr_.7fr_1fr]">
            <div className="max-w-sm">
              <Editable id="title"><h2 className="text-lg font-black tracking-[-0.03em]">{brand}</h2></Editable>
              <Editable id="subtitle"><p className="mt-4 text-sm leading-6 text-black/48">{block.subtitle}</p></Editable>
              <div className="mt-6 flex gap-2">
                <a href="https://www.instagram.com/prime__strike" target="_blank" rel="noreferrer" aria-label="Instagram" className="grid size-9 place-items-center rounded-full bg-black/5 text-black/60 hover:bg-black hover:text-white"><Instagram size={14} /></a>
                <a href={actionHref("whatsapp", block.contactPhone)} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid size-9 place-items-center rounded-full bg-black/5 text-black/60 hover:bg-[#25D366] hover:text-white"><MessageCircle size={14} /></a>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-black/45">Quick links</p>
              <ul className="mt-5 space-y-3">
                {pageLinks.slice(0, 5).map((link) => <li key={link.id}><a href={actionHref("link", link.url)} onClick={(event) => runAction(event, "link", link.url)} className="text-xs font-semibold text-black/48 hover:text-black">{link.label}</a></li>)}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-black/45">Contact</p>
              <div className="mt-5 space-y-3 text-xs font-semibold text-black/48">
                <a href={`mailto:${block.contactEmail}`} className="flex items-center gap-2 hover:text-black"><Mail size={13} />{block.contactEmail}</a>
                <a href={`tel:${block.contactPhone}`} className="flex items-center gap-2 hover:text-black"><Phone size={13} />{block.contactPhone}</a>
                <p className="flex items-start gap-2 leading-5"><MapPin size={13} className="mt-0.5 shrink-0" />{block.contactAddress}</p>
              </div>
            </div>
          </div>
          <div className="mt-14 flex flex-col gap-4 border-t border-black/10 pt-6 text-[10px] font-semibold text-black/35 @md:flex-row @md:items-center @md:justify-between">
            <span>{block.copyright}</span>
            <span>Educational information only · Trading involves risk.</span>
          </div>
        </div>
      </footer>
    );
  }

  if (block.variant === "academy-cinematic") {
    return (
      <section className={`${sectionClass} min-h-[680px] bg-[#050505] @lg:min-h-[780px]`} onClick={onSelect}>
        {block.imageUrl && <img src={block.imageUrl} alt="" className="absolute inset-0 size-full object-cover" />}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.58),rgba(0,0,0,.38)_44%,rgba(0,0,0,.92))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,.2)_48%,rgba(0,0,0,.72)_100%)]" />
        <div className={`${contentClass} flex min-h-[680px] max-w-[1180px] items-center justify-center px-6 py-24 text-center @lg:min-h-[780px]`}>
          <div className="max-w-[960px]">
            {block.badge && block.showBadge !== false && <Editable id="badge"><p className="mb-7 text-[9px] font-black uppercase tracking-[0.38em] text-[#d7b43c] @md:text-[11px]">{block.badge}</p></Editable>}
            <Editable id="title"><h1 className="text-balance font-['Poppins'] text-[clamp(3.1rem,9cqw,8rem)] font-bold leading-[.9] tracking-[-0.065em] text-white">{block.title}</h1></Editable>
            <Editable id="subtitle"><p className="mx-auto mt-7 max-w-2xl text-sm leading-6 text-white/55 @md:text-base @md:leading-7">{block.subtitle}</p></Editable>
            <Editable id="button" className="mt-8 inline-flex flex-wrap justify-center gap-3">
              <Action label={block.btnText} type={block.btnActionType} value={block.btnActionValue} />
              <Action label={block.secondaryBtnText} type={block.secondaryBtnActionType} value={block.secondaryBtnActionValue} secondary />
            </Editable>
          </div>
        </div>
      </section>
    );
  }

  if (block.variant === "academy-courses") {
    return (
      <section className={`${sectionClass} bg-[#090909] text-white`} onClick={onSelect}>
        <div className={`${contentClass} max-w-[1240px] px-6 py-20 @lg:px-8 @lg:py-28`}>
          {block.badge && <Editable id="badge"><p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#b99a31]">{block.badge}</p></Editable>}
          <Editable id="title"><h2 className="mt-4 max-w-3xl font-['Poppins'] text-[clamp(2.3rem,5cqw,4.7rem)] font-bold leading-[.98] tracking-[-0.055em]">{block.title}</h2></Editable>
          <div className="mt-12 grid gap-4 @md:grid-cols-2">
            {(block.features || []).map((item, index) => (
              <Editable key={item.id} id={`card:${index}`}>
                <a href={actionHref(item.linkActionType, item.linkActionValue)} onClick={(event) => runAction(event, item.linkActionType, item.linkActionValue)} className="group relative block aspect-[1.16/1] overflow-hidden rounded-2xl bg-[#151515]">
                  {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="size-full object-cover transition duration-700 group-hover:scale-[1.035]" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 @md:p-8">
                    {item.eyebrow && <p className="mb-2 text-[9px] font-black uppercase tracking-[0.24em] text-[#d6b43c]">{item.eyebrow}</p>}
                    <h3 className="font-['Poppins'] text-2xl font-bold tracking-[-0.04em] @md:text-3xl">{item.title}</h3>
                    <p className="mt-2 max-w-md text-xs leading-5 text-white/55">{item.desc}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-[#d6b43c]">{item.linkText || "Learn more"}<ChevronRight size={13} /></span>
                  </div>
                </a>
              </Editable>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (block.variant === "academy-session") {
    return (
      <section className={`${sectionClass} bg-[#090909] text-white`} onClick={onSelect}>
        <div className={`${contentClass} grid max-w-[1320px] items-center gap-10 px-6 py-20 @lg:grid-cols-[1.1fr_.9fr] @lg:px-8 @lg:py-28`}>
          <Editable id="media"><div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#151515]">{block.imageUrl && <img src={block.imageUrl} alt={block.title} className="aspect-[1.2/1] size-full object-cover" />}</div></Editable>
          <div className="@lg:px-8">
            {block.badge && <Editable id="badge"><p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#b99a31]">{block.badge}</p></Editable>}
            <Editable id="title"><h2 className="mt-4 font-['Poppins'] text-[clamp(2.4rem,5cqw,4.5rem)] font-bold leading-[.98] tracking-[-0.055em]">{block.title}</h2></Editable>
            <Editable id="subtitle"><p className="mt-6 max-w-xl text-sm leading-7 text-white/50">{block.subtitle}</p></Editable>
            <div className="mt-8 grid grid-cols-3 gap-4 border-y border-white/10 py-6">
              {(block.stats || []).map((stat) => <div key={stat.id}><strong className="block text-xl font-black text-[#d6b43c] @md:text-3xl">{stat.val}{stat.suffix}</strong><span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.13em] text-white/35">{stat.label}</span></div>)}
            </div>
            <Editable id="button" className="mt-8 inline-block"><Action label={block.btnText} type={block.btnActionType} value={block.btnActionValue} secondary /></Editable>
          </div>
        </div>
      </section>
    );
  }

  if (block.variant === "academy-stories") {
    return (
      <section className={`${sectionClass} bg-[#080808] text-white`} onClick={onSelect}>
        <div className={`${contentClass} max-w-[1240px] px-6 py-20 @lg:px-8 @lg:py-28`}>
          <div className="text-center">{block.badge && <Editable id="badge"><p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#b99a31]">{block.badge}</p></Editable>}<Editable id="title"><h2 className="mt-4 font-['Poppins'] text-[clamp(2.2rem,4cqw,4rem)] font-bold tracking-[-0.055em]">{block.title}</h2></Editable></div>
          <div className="mt-12 grid gap-4 @md:grid-cols-3">
            {(block.testimonials || []).map((item, index) => <Editable key={item.id} id={`card:${index}`}><article className="flex h-full min-h-64 flex-col justify-between rounded-2xl border border-white/[0.07] bg-white/[0.025] p-7 transition hover:border-[#d6b43c]/25 hover:bg-white/[0.04]"><Quote size={24} className="text-[#d6b43c]/45" /><p className="mt-7 text-sm leading-6 text-white/58">“{item.content}”</p><div className="mt-8 border-t border-white/[0.07] pt-5"><p className="text-xs font-black">{item.name}</p><p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#b99a31]">{item.role}</p></div></article></Editable>)}
          </div>
        </div>
      </section>
    );
  }

  if (block.variant === "academy-process") {
    return (
      <section className={`${sectionClass} bg-[#171717] text-white`} onClick={onSelect}>
        <div className={`${contentClass} max-w-[1240px] px-6 py-20 @lg:px-8 @lg:py-28`}>
          <div className="text-center">{block.badge && <Editable id="badge"><p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#b99a31]">{block.badge}</p></Editable>}<Editable id="title"><h2 className="mt-4 font-['Poppins'] text-[clamp(2.2rem,4cqw,4rem)] font-bold tracking-[-0.055em]">{block.title}</h2></Editable></div>
          <div className={`mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] ${block.steps && block.steps.length >= 4 ? "@md:grid-cols-2 @lg:grid-cols-4" : "@md:grid-cols-3"}`}>
            {(block.steps || []).map((item, index) => <Editable key={item.id} id={`card:${index}`}><article className="relative min-h-64 bg-[#171717] p-7 @lg:p-9"><span className="absolute right-6 top-4 font-['Poppins'] text-7xl font-bold tracking-[-0.08em] text-[#d6b43c]/[0.07]">{item.step}</span><p className="relative text-[9px] font-black uppercase tracking-[0.2em] text-[#b99a31]">Step {item.step}</p><h3 className="relative mt-16 text-lg font-black tracking-[-0.03em]">{item.title}</h3><p className="relative mt-3 text-xs leading-6 text-white/42">{item.desc}</p></article></Editable>)}
          </div>
        </div>
      </section>
    );
  }

  if (block.variant === "academy-spotlight") {
    return (
      <section className={`${sectionClass} bg-[#0b0b0b] text-white`} onClick={onSelect}>
        {block.imageUrl && <img src={block.imageUrl} alt="" className="absolute inset-0 size-full object-cover opacity-15" />}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,185,48,.08),transparent_58%)]" />
        <div className={`${contentClass} max-w-[1000px] px-6 py-24 text-center @lg:py-32`}>
          {block.badge && <Editable id="badge"><p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#b99a31]">{block.badge}</p></Editable>}
          <Editable id="title"><h2 className="mx-auto mt-4 max-w-4xl text-balance font-['Poppins'] text-[clamp(2.5rem,6cqw,5.5rem)] font-bold leading-[.95] tracking-[-0.06em]">{block.title}</h2></Editable>
          <Editable id="subtitle"><p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-white/48">{block.subtitle}</p></Editable>
          <Editable id="button" className="mt-8 inline-block"><Action label={block.btnText} type={block.btnActionType} value={block.btnActionValue} /></Editable>
        </div>
      </section>
    );
  }

  if (["academy-enquiry", "academy-registration", "academy-portal"].includes(block.variant || "")) {
    const portal = block.variant === "academy-portal";
    const registration = block.variant === "academy-registration";
    return (
      <section id="enquiry" className={`${sectionClass} bg-[#090909] text-white`} onClick={onSelect}>
        <div className={`${contentClass} max-w-[1240px] px-6 py-20 @lg:px-8 @lg:py-28`}>
          <div className={`grid items-start gap-10 ${portal || registration ? "max-w-3xl mx-auto" : "@lg:grid-cols-[.82fr_1.18fr] @lg:gap-16"}`}>
            {!portal && !registration && (
              <div className="pt-2">
                {block.badge && <Editable id="badge"><p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#b99a31]">{block.badge}</p></Editable>}
                <Editable id="title"><h2 className="mt-4 font-['Poppins'] text-[clamp(2.5rem,5cqw,4.8rem)] font-bold leading-[.98] tracking-[-0.055em]">{block.title}</h2></Editable>
                <Editable id="subtitle"><p className="mt-6 max-w-md text-sm leading-7 text-white/45">{block.subtitle}</p></Editable>
                <div className="mt-10 space-y-4 border-t border-white/10 pt-8 text-xs text-white/48">
                  {block.contactAddress && <p className="flex gap-3"><MapPin size={16} style={{ color: accent }} />{block.contactAddress}</p>}
                  {block.contactEmail && <a className="flex gap-3 hover:text-white" href={`mailto:${block.contactEmail}`}><Mail size={16} style={{ color: accent }} />{block.contactEmail}</a>}
                  {block.contactPhone && <a className="flex gap-3 hover:text-white" href={`tel:${block.contactPhone}`}><Phone size={16} style={{ color: accent }} />{block.contactPhone}</a>}
                </div>
              </div>
            )}
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5 shadow-[0_35px_100px_rgba(0,0,0,.3)] @md:p-8 @lg:p-10">
              {(portal || registration) && <div className="mb-8 text-center">{block.badge && <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#b99a31]">{block.badge}</p>}<Editable id="title"><h2 className="mt-4 font-['Poppins'] text-3xl font-bold tracking-[-0.05em] @md:text-5xl">{block.title}</h2></Editable><Editable id="subtitle"><p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/45">{block.subtitle}</p></Editable></div>}
              {portal && !submitted && (
                <div className="mb-6 grid grid-cols-2 rounded-xl bg-black/30 p-1">
                  <button type="button" onClick={() => setPortalMode("login")} className={`rounded-lg px-3 py-2.5 text-xs font-black ${portalMode === "login" ? "bg-white text-black" : "text-white/40"}`}>Sign in</button>
                  <button type="button" onClick={() => setPortalMode("request")} className={`rounded-lg px-3 py-2.5 text-xs font-black ${portalMode === "request" ? "bg-white text-black" : "text-white/40"}`}>Request access</button>
                </div>
              )}
              {submitted ? (
                <div className="py-12 text-center"><span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-500 text-white"><CheckCircle2 size={26} /></span><h3 className="mt-5 text-xl font-black">{portal ? (portalMode === "login" ? "Access request checked" : "Request received") : "Submission received"}</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/45">{block.successMessage || "Our team will contact you with the next step."}</p><button type="button" onClick={() => setSubmitted(false)} className="mt-6 text-xs font-black text-[#d6b43c]">Submit another response</button></div>
              ) : (
                <form onSubmit={submitForm} className="grid gap-5 @md:grid-cols-2">
                  {(portal && portalMode === "login" ? formFields.filter((field) => ["email", "password"].includes(field.type)) : formFields).map((field) => <Field key={field.id} field={field} />)}
                  <button type="submit" disabled={submitting} className="@md:col-span-2 mt-2 inline-flex min-h-14 items-center justify-center gap-2 rounded-xl px-6 text-sm font-black text-[#090909] transition hover:-translate-y-0.5 disabled:opacity-50" style={{ backgroundColor: accent }}>
                    {submitting ? "Sending…" : portal ? (portalMode === "login" ? "Sign in" : "Request student access") : block.btnText || "Send enquiry"}
                    {portal ? <Lock size={15} /> : <Send size={15} />}
                  </button>
                  {submitError && <p role="alert" className="@md:col-span-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-center text-xs font-semibold text-red-100">{submitError}</p>}
                  {portal && <p className="@md:col-span-2 flex items-center justify-center gap-2 text-center text-[10px] leading-5 text-white/30"><ShieldCheck size={13} />Student access is issued after course enrollment is verified.</p>}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return null;
}
