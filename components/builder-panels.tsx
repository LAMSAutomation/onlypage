import React, { useEffect, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Command } from "cmdk";
import { ArrowDownToLine, BarChart3, CircleAlert, Check, ChevronDown, ChevronRight, CommandIcon, Database, ExternalLink, FormInput, Globe2, HelpCircle, ImageIcon, Layers3, Link2, MessageCircle, ListOrdered, Mail, MapPin, Plus, Phone, Save, ShoppingBag, Sparkles, Trash2, Type, Loader2, Users, Star, Crop, X, LayoutTemplate, Zap } from "lucide-react";
import { BLOCK_VARIANTS_MAP } from "./builder-data";
import { VariantMiniPreview } from "./ui/variant-preview";
import type { WebBlock } from "./builder-types";
import { upsertProduct } from "@/lib/ecom-queries";
import type { SiteRecord } from "./ui/onboarding-wizard";
import { SITE_KITS } from "./site-kits";
import type { Page } from "./builder-types";
import { specialContentMode } from "./builder-helpers";
import { InspectorCollection, InspectorDetails, InspectorItem, MiniField } from "./builder-inspector";

export function PageManagerModal({
  pages,
  activePageId,
  newPageName,
  saving,
  onNewPageNameChange,
  onCreate,
  onSelect,
  onUpdate,
  onDelete,
  onClose,
}: {
  pages: Page[];
  activePageId: string | null;
  newPageName: string;
  saving: boolean;
  onNewPageNameChange: (value: string) => void;
  onCreate: () => void;
  onSelect: (pageId: string) => void;
  onUpdate: (pageId: string, patch: Partial<Page>) => void;
  onDelete: (page: Page) => void;
  onClose: () => void;
}) {
  const active = pages.find((item) => item.id === activePageId) || pages[0];
  const [draft, setDraft] = useState({
    name: active?.name || "",
    slug: active?.slug || "",
    seo_title: active?.seo_title || "",
    seo_desc: active?.seo_desc || "",
  });

  useEffect(() => {
    setDraft({
      name: active?.name || "",
      slug: active?.slug || "",
      seo_title: active?.seo_title || "",
      seo_desc: active?.seo_desc || "",
    });
  }, [active?.id]);

  return (
    <div className="fixed inset-0 z-[110] overflow-y-auto bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="mx-auto mt-[6vh] grid max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl md:grid-cols-[280px_1fr]">
        <aside className="border-b border-slate-200 bg-slate-50 p-4 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-600">Structure</p>
              <h2 className="mt-1 text-lg font-semibold">Pages</h2>
            </div>
            <button type="button" onClick={onClose} aria-label="Close" className="editor-interactive grid size-10 place-items-center rounded-[var(--radius-control)] hover:bg-slate-200">
              <X size={16} />
            </button>
          </div>
          <div className="mt-4 space-y-1">
            {pages.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left ${item.id === activePageId ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-white"}`}
              >
                <span>
                  <span className="block text-xs font-semibold">{item.name}</span>
                  <span className={`mt-0.5 block text-xs ${item.id === activePageId ? "text-slate-400" : "text-slate-500"}`}>/{item.slug === "home" ? "" : item.slug}</span>
                </span>
                {item.slug === "home" && <span className="text-xs font-semibold uppercase text-lime-500">Home</span>}
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-3">
            <label className="text-xs font-medium text-slate-600">New page</label>
            <div className="mt-2 flex gap-2">
              <input
                value={newPageName}
                onChange={(event) => onNewPageNameChange(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && onCreate()}
                placeholder="e.g. Case Studies"
                className="min-w-0 flex-1 rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-medium outline-none focus:border-lime-500"
              />
              <button type="button" onClick={onCreate} disabled={saving || !newPageName.trim()} aria-label="Create page" className="editor-interactive grid size-10 place-items-center rounded-[var(--radius-control)] bg-lime-400 text-slate-950 disabled:opacity-40">
                <Plus size={15} />
              </button>
            </div>
          </div>
        </aside>
        <section className="p-5 sm:p-7">
          {active && (
            <>
              <p className="text-xs font-medium text-slate-600">Page settings</p>
              <h3 className="mt-1 text-xl font-semibold">{active.name}</h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Page name" value={draft.name} onChange={(name) => setDraft((current) => ({ ...current, name }))} />
                <Field label="URL slug" value={draft.slug} onChange={(slug) => setDraft((current) => ({ ...current, slug }))} />
              </div>
              <Field label="SEO title" value={draft.seo_title} onChange={(seo_title) => setDraft((current) => ({ ...current, seo_title }))} />
              <Field label="Meta description" value={draft.seo_desc} multiline onChange={(seo_desc) => setDraft((current) => ({ ...current, seo_desc }))} />
              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => onDelete(active)}
                  disabled={active.slug === "home" || pages.length <= 1 || saving}
                  className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Trash2 size={14} /> Delete page
                </button>
                <button
                  type="button"
                  disabled={saving || !draft.name.trim() || !draft.slug.trim()}
                  onClick={() => onUpdate(active.id, draft)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-40"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save page settings
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export function SiteKitsModal({
  currentKitId,
  applyingKitId,
  onApply,
  onClose,
}: {
  currentKitId?: string;
  applyingKitId: string | null;
  onApply: (kitId: string) => void;
  onClose: () => void;
}) {
  const kitCategories = [
    "All",
    "Premium Multi-Purpose",
    "Education & Courses",
    "Professional Services",
    "Local Business & E-com",
    "Creative Portfolio",
  ] as const;
  const [kitCategory, setKitCategory] = useState<(typeof kitCategories)[number]>("All");
  const visibleKits = kitCategory === "All" ? SITE_KITS : SITE_KITS.filter((kit) => kit.category === kitCategory);
  return (
    <div className="fixed inset-0 z-[110] overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="mx-auto my-[5vh] max-w-5xl rounded-3xl border border-slate-200 bg-[#f6f7f4] p-5 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-200 px-2.5 py-1 text-xs font-medium text-lime-900">
              <LayoutTemplate size={12} /> Professional site kits
            </span>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Start from a complete website.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Each kit installs five connected pages, a shared header and footer, responsive section variants, SEO copy, and real button destinations.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="editor-interactive grid size-10 shrink-0 place-items-center rounded-[var(--radius-panel)] bg-white text-slate-500 shadow-sm hover:text-slate-950">
            <X size={17} />
          </button>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-1.5">
          {kitCategories.map((cat) => {
            const count = cat === "All" ? SITE_KITS.length : SITE_KITS.filter((k) => k.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setKitCategory(cat)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                  kitCategory === cat
                    ? "bg-slate-950 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800"
                }`}
              >
                {cat}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs leading-none ${
                    kitCategory === cat ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          {visibleKits.map((kit) => (
            <article key={kit.id} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="relative h-36 overflow-hidden p-5" style={{ background: `linear-gradient(135deg, ${kit.palette[0]}, ${kit.palette[1]} 65%, ${kit.palette[2]})` }}>
                <div className="absolute inset-x-5 top-5 h-6 rounded-md border border-white/15 bg-black/25" />
                <div className="absolute bottom-5 left-5 right-16 h-14 rounded-xl border border-white/15 bg-white/10 backdrop-blur" />
                <span className="absolute bottom-5 right-5 rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-950">{kit.pageCount} pages</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-medium text-slate-600">{kit.category}</p>
                <h3 className="mt-1.5 text-lg font-semibold text-slate-950">{kit.name}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">{kit.description}</p>
                <p className="mt-4 text-xs font-medium text-slate-600">Best for: {kit.audience}</p>
                <button
                  type="button"
                  disabled={Boolean(applyingKitId)}
                  onClick={() => onApply(kit.id)}
                  className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  {applyingKitId === kit.id ? <Loader2 size={14} className="animate-spin" /> : <LayoutTemplate size={14} />}
                  {applyingKitId === kit.id ? "Installing…" : currentKitId === kit.id ? "Reinstall kit" : "Use this site kit"}
                </button>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
          <CircleAlert size={14} className="mt-0.5 shrink-0" />
          <span>Applying a kit replaces page content with the selected structure. OnlyPage creates an automatic revision backup first; your site identity and account are not changed.</span>
        </div>
      </div>
    </div>
  );
}

export function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="mt-4 block">
      <span className="mb-2 block text-xs font-medium text-slate-600">
        {label}
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-20 w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-xs leading-5 outline-none focus:border-lime-600"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-medium outline-none focus:border-lime-600"
        />
      )}
    </label>
  );
}

export function ActionPanel({
  block,
  pages,
  sections,
  site,
  onChange,
  title = "Button destination",
}: {
  block: WebBlock;
  pages: Page[];
  sections: WebBlock[];
  site: SiteRecord;
  onChange: (patch: Partial<WebBlock>) => void;
  title?: string;
}) {
  const actionType = block.btnActionType || "none";
  const actions = [
    { id: "booking", label: "Booking", icon: FormInput },
    { id: "scroll", label: "Section", icon: ArrowDownToLine },
    { id: "link", label: "Page", icon: Layers3 },
    { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
    { id: "external", label: "Website", icon: ExternalLink },
    { id: "phone", label: "Call", icon: Link2 },
  ];

  const setAction = (type: string) =>
    onChange({ btnActionType: type, btnActionValue: "" });

  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-600">
            {title}
          </p>
          <p className="mt-1 text-xs leading-4 text-slate-500">
            Choose what happens after a customer clicks.
          </p>
        </div>
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${actionType === "none" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}
        >
          {actionType === "none" ? "NOT CONNECTED" : "CONNECTED"}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {actions.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setAction(id)}
            className={`flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-xl border text-xs font-semibold transition ${
              actionType === id
                ? "border-lime-500 bg-white text-lime-800 shadow-sm ring-2 ring-lime-100"
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {actionType === "none" && (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
          <p className="flex items-center gap-2 text-xs font-semibold text-amber-800">
            <CircleAlert size={13} /> This button currently does nothing
          </p>
          <button
            type="button"
            onClick={() => setAction("booking")}
            className="mt-2 flex items-center gap-1 text-xs font-semibold text-amber-900 underline underline-offset-2"
          >
            Connect it to the booking form <ChevronRight size={12} />
          </button>
        </div>
      )}

      {actionType === "booking" && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-emerald-800">
          <FormInput size={15} className="mt-0.5 shrink-0" />
          <p className="text-xs font-semibold leading-4">
            Scrolls to the first booking or enquiry form on the current page.
            This is the recommended action for service cards and header CTAs.
          </p>
        </div>
      )}

      {actionType === "scroll" && (
        <label className="mt-3 block">
          <span className="mb-1.5 block text-xs font-medium text-slate-600">
            Target section
          </span>
          <select
            value={block.btnActionValue || ""}
            onChange={(event) =>
              onChange({ btnActionValue: event.target.value })
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium outline-none focus:border-lime-500"
          >
            <option value="">Choose a section…</option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.title || section.type}
              </option>
            ))}
          </select>
        </label>
      )}

      {actionType === "link" && (
        <label className="mt-3 block">
          <span className="mb-1.5 block text-xs font-medium text-slate-600">
            Destination page
          </span>
          <select
            value={block.btnActionValue || ""}
            onChange={(event) =>
              onChange({ btnActionValue: event.target.value })
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium outline-none focus:border-lime-500"
          >
            <option value="">Choose a page…</option>
            {pages.map((page) => (
              <option key={page.id} value={page.slug}>
                {page.name}
              </option>
            ))}
          </select>
        </label>
      )}

      {["whatsapp", "phone", "external"].includes(actionType) && (
        <label className="mt-3 block">
          <span className="mb-1.5 block text-xs font-medium text-slate-600">
            {actionType === "external"
              ? "Website URL"
              : actionType === "phone"
                ? "Phone number"
                : "WhatsApp number"}
          </span>
          <input
            value={block.btnActionValue || ""}
            onChange={(event) =>
              onChange({ btnActionValue: event.target.value })
            }
            placeholder={
              actionType === "external"
                ? "https://example.com"
                : (site.theme?.phone as string) || "+91 98765 43210"
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold outline-none focus:border-lime-500"
          />
          {actionType === "whatsapp" && (
            <span className="mt-1.5 block text-xs leading-4 text-slate-600">
              Opens a customer chat. Automated follow-ups still run securely
              through your Evolution API connection.
            </span>
          )}
        </label>
      )}
    </div>
  );
}

export function LeadRoutingPanel({
  block,
  onChange,
}: {
  block: WebBlock;
  onChange: (patch: Partial<WebBlock>) => void;
}) {
  const appointment = block.variant === "appointment";
  const newsletter = block.variant === "newsletter";
  const followUpEnabled = (block as any).whatsappFollowUp !== false;
  const capturedFields = appointment
    ? ["Name", "WhatsApp", "Date", "Time"]
    : newsletter
      ? ["Email"]
      : ["Name", "Email", "Phone", "Message"];

  return (
    <div className="mt-5 rounded-2xl border border-indigo-200 bg-indigo-50/60 p-3.5">
      <div className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-xl bg-indigo-600 text-white">
          <Users size={15} />
        </span>
        <div>
          <p className="text-xs font-medium text-indigo-900">
            Where submissions go
          </p>
          <p className="mt-0.5 text-xs text-indigo-700/70">
            One submission creates one customer record.
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-white px-3 py-2.5">
          <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Users size={13} className="text-indigo-600" /> CRM → Leads
          </span>
          <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
            ALWAYS
          </span>
        </div>
        {appointment && (
          <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-white px-3 py-2.5">
            <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <FormInput size={13} className="text-indigo-600" /> Operations →
              Bookings
            </span>
            <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700">
              ALSO SAVED
            </span>
          </div>
        )}
      </div>

      <div className="mt-3">
        <p className="text-xs font-medium text-indigo-900/70">
          Information collected
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {capturedFields.map((field) => (
            <span
              key={field}
              className="rounded-lg border border-indigo-100 bg-white px-2 py-1 text-xs font-medium text-slate-600"
            >
              {field}
            </span>
          ))}
        </div>
      </div>

      <label className="mt-3 flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-indigo-100 bg-white p-3">
        <span>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <MessageCircle size={13} className="text-emerald-600" />
            Evolution API follow-up
          </span>
          <span className="mt-1 block text-xs leading-4 text-slate-600">
            Queue new leads for your configured WhatsApp automation.
          </span>
        </span>
        <input
          type="checkbox"
          checked={followUpEnabled}
          onChange={(event) =>
            onChange({ whatsappFollowUp: event.target.checked } as any)
          }
          className="mt-0.5 size-4 accent-emerald-600"
        />
      </label>

      <label className="mt-3 block">
        <span className="mb-1.5 block text-xs font-medium text-indigo-900/70">
          Success message
        </span>
        <textarea
          value={(block as any).successMessage || ""}
          onChange={(event) =>
            onChange({ successMessage: event.target.value } as any)
          }
          placeholder="Thanks — we’ll contact you shortly."
          className="min-h-16 w-full resize-y rounded-xl border border-indigo-100 bg-white px-3 py-2.5 text-xs leading-5 outline-none focus:border-indigo-500"
        />
      </label>
    </div>
  );
}

type BuilderModuleLink = {
  id: string;
  label: string;
  detail: string;
  icon: React.ElementType;
};

function getConnectionLinks(block: WebBlock): BuilderModuleLink[] {
  if (block.type === "Forms" || block.type === "Contact") {
    return [
      {
        id: "forms",
        label: "Forms Center",
        detail: "Fields and submissions",
        icon: FormInput,
      },
      {
        id: "crm",
        label: "Contacts CRM",
        detail: "New leads and follow-ups",
        icon: Users,
      },
      {
        id: "inbox",
        label: "Inbox",
        detail: "Customer conversations",
        icon: Mail,
      },
      {
        id: "whatsapp",
        label: "WhatsApp automation",
        detail: "Evolution API follow-up",
        icon: MessageCircle,
      },
      ...(block.variant === "appointment"
        ? [
            {
              id: "bookings",
              label: "Bookings",
              detail: "Appointments and status",
              icon: FormInput,
            },
          ]
        : []),
    ];
  }
  if (block.type === "EComStore") {
    return [
      {
        id: "store",
        label: "Store & Products",
        detail: "Catalog, stock and orders",
        icon: ShoppingBag,
      },
      {
        id: "analytics",
        label: "Analytics",
        detail: "Traffic and conversions",
        icon: BarChart3,
      },
    ];
  }
  if (block.type === "Testimonials") {
    return [
      {
        id: "reviews",
        label: "Reviews",
        detail: "Requests and approvals",
        icon: Star,
      },
      {
        id: "cms",
        label: "CMS",
        detail: "Connected review records",
        icon: Database,
      },
    ];
  }
  if (
    block.type === "Features" ||
    block.type === "Business" ||
    block.type === "Pricing"
  ) {
    return [
      {
        id: "cms",
        label: "CMS",
        detail: "Edit connected records",
        icon: Database,
      },
      {
        id: "analytics",
        label: "Analytics",
        detail: "Section performance",
        icon: BarChart3,
      },
    ];
  }
  if (block.type === "Navigation" || block.type === "Footer") {
    return [
      {
        id: "pages",
        label: "Pages",
        detail: "Navigation and page structure",
        icon: Layers3,
      },
      {
        id: "seo",
        label: "SEO Manager",
        detail: "Titles and search visibility",
        icon: Globe2,
      },
    ];
  }
  return [
    {
      id: "seo",
      label: "SEO Manager",
      detail: "Search and sharing settings",
      icon: Globe2,
    },
    {
      id: "analytics",
      label: "Analytics",
      detail: "Traffic and conversion data",
      icon: BarChart3,
    },
  ];
}

export function BuilderDataConnections({
  block,
  site,
  products,
  productsLoading,
  onChange,
  onNavigateModule,
}: {
  block: WebBlock;
  site: SiteRecord;
  products: any[];
  productsLoading: boolean;
  onChange: (patch: Partial<WebBlock>) => void;
  onNavigateModule?: (moduleId: string) => void;
}) {
  const collections = (site.theme?.customCollections || []) as any[];
  const cmsBindable = [
    "Features",
    "Business",
    "Pricing",
    "Testimonials",
    "Forms",
    "Contact",
  ].includes(block.type);
  const selectedCollection = collections.find(
    (collection) =>
      String(collection.name).toLowerCase() ===
      String(block.bindCollectionName || "").toLowerCase(),
  );
  const columnNames = (selectedCollection?.columns || [])
    .map((column: any) =>
      typeof column === "string" ? column : column?.name,
    )
    .filter(Boolean) as string[];

  const connectCollection = (name: string) => {
    if (!name) {
      onChange({ bindCollectionName: undefined, bindFields: undefined });
      return;
    }
    const collection = collections.find(
      (candidate) =>
        String(candidate.name).toLowerCase() === name.toLowerCase(),
    );
    const names = (collection?.columns || [])
      .map((column: any) =>
        typeof column === "string" ? column : column?.name,
      )
      .filter(Boolean) as string[];
    const infer = (needles: string[], fallback = "") =>
      names.find((column) =>
        needles.some((needle) => column.toLowerCase().includes(needle)),
      ) || fallback;
    let bindFields: Record<string, string> | undefined;
    if (block.type === "Features" || block.type === "Business") {
      bindFields = {
        title: infer(["title", "name", "service"], names[0] || "title"),
        desc: infer(["desc", "body", "detail"], names[1] || "desc"),
        icon: infer(["icon"], ""),
      };
    } else if (block.type === "Pricing") {
      bindFields = {
        tier: infer(["tier", "plan", "name"], names[0] || "tier"),
        price: infer(["price", "amount", "cost"], names[1] || "price"),
        features: infer(["feature", "include", "benefit"], "features"),
        btnText: infer(["button", "cta"], "btnText"),
        popular: infer(["popular", "featured"], "popular"),
      };
    } else if (block.type === "Testimonials") {
      bindFields = {
        name: infer(["name", "author", "customer"], names[0] || "name"),
        role: infer(["role", "title", "company"], names[1] || "role"),
        content: infer(
          ["content", "review", "body", "text", "description"],
          names[2] || "content",
        ),
        avatar: infer(["avatar", "image", "photo"], ""),
        rating: infer(["rating", "stars"], "rating"),
      };
    }
    onChange({ bindCollectionName: name, bindFields });
  };

  const mappingFields =
    block.type === "Features" || block.type === "Business"
      ? [
          ["title", "Card title"],
          ["desc", "Description"],
          ["icon", "Icon"],
        ]
      : block.type === "Pricing"
        ? [
            ["tier", "Plan name"],
            ["price", "Price"],
            ["features", "Benefits"],
            ["btnText", "Button"],
            ["popular", "Featured"],
          ]
        : block.type === "Testimonials"
          ? [
              ["name", "Customer"],
              ["role", "Role"],
              ["content", "Review"],
              ["avatar", "Photo"],
              ["rating", "Rating"],
            ]
          : [];
  const links = getConnectionLinks(block);
  const activeCount = products.filter(
    (product) => String(product.status).toLowerCase() === "active",
  ).length;

  return (
    <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
      {cmsBindable && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex gap-2.5">
              <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white">
                <Database size={15} />
              </span>
              <div>
                <p className="text-xs font-medium text-emerald-900">
                  {block.type === "Forms" || block.type === "Contact"
                    ? "Save to CMS"
                    : "Live CMS content"}
                </p>
                <p className="mt-1 text-xs leading-4 text-emerald-800/70">
                  {block.type === "Forms" || block.type === "Contact"
                    ? "Optionally copy every submission into a collection."
                    : "Changes in CMS update this section automatically."}
                </p>
              </div>
            </div>
            {block.bindCollectionName && (
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                LIVE
              </span>
            )}
          </div>

          <label className="mt-3 block">
            <span className="mb-1.5 block text-xs font-medium text-emerald-900/70">
              Collection
            </span>
            <div className="relative">
              <select
                value={block.bindCollectionName || ""}
                onChange={(event) => connectCollection(event.target.value)}
                className="w-full appearance-none rounded-xl border border-emerald-200 bg-white px-3 py-2.5 pr-9 text-xs font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                <option value="">Use content entered here</option>
                {collections.map((collection) => (
                  <option key={collection.name} value={collection.name}>
                    {collection.name} ({collection.rows?.length || 0})
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600"
              />
            </div>
          </label>

          {collections.length === 0 && (
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-4 text-amber-800">
              No collection exists yet. Create one in CMS, then return here to
              connect it.
            </div>
          )}

          {selectedCollection && mappingFields.length > 0 && (
            <div className="mt-3 border-t border-emerald-100 pt-3">
              <p className="mb-2 text-xs font-medium text-emerald-900/70">
                Match CMS columns
              </p>
              <div className="grid grid-cols-2 gap-2">
                {mappingFields.map(([field, label]) => (
                  <label key={field} className="block">
                    <span className="mb-1 block text-xs font-medium text-slate-500">
                      {label}
                    </span>
                    <select
                      value={block.bindFields?.[field] || ""}
                      onChange={(event) =>
                        onChange({
                          bindFields: {
                            ...(block.bindFields || {}),
                            [field]: event.target.value,
                          },
                        })
                      }
                      className="w-full rounded-lg border border-emerald-100 bg-white px-2 py-2 text-xs font-medium text-slate-700 outline-none focus:border-emerald-500"
                    >
                      <option value="">Automatic</option>
                      {columnNames.map((column) => (
                        <option key={column} value={column}>
                          {column}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => onNavigateModule?.("cms")}
            className="mt-3 flex w-full items-center justify-between rounded-xl border border-emerald-200 bg-white px-3 py-2.5 text-left text-xs font-semibold text-emerald-800 transition hover:border-emerald-400"
          >
            <span>{collections.length ? "Manage CMS records" : "Create a collection"}</span>
            <ChevronRight size={13} />
          </button>
        </div>
      )}

      {block.type === "EComStore" && (
        <div className="rounded-2xl border border-violet-200 bg-violet-50/60 p-3.5">
          <div className="flex items-start gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-violet-600 text-white">
              <ShoppingBag size={15} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-violet-900">
                  Live product catalog
                </p>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                  SYNCED
                </span>
              </div>
              <p className="mt-1 text-xs leading-4 text-violet-800/70">
                {productsLoading
                  ? "Checking your store…"
                  : `${activeCount} active of ${products.length} products will appear on the site.`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateModule?.("store")}
            className="mt-3 flex w-full items-center justify-between rounded-xl border border-violet-200 bg-white px-3 py-2.5 text-left text-xs font-semibold text-violet-800 transition hover:border-violet-400"
          >
            <span>Manage products and orders</span>
            <ChevronRight size={13} />
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-slate-600">
            Connected tools
          </p>
          <span className="text-xs font-medium text-slate-600">
            Open dashboard
          </span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {links.map(({ id, label, detail, icon: Icon }) => (
            <button
              type="button"
              key={id}
              onClick={() => onNavigateModule?.(id)}
              className="group rounded-xl border border-slate-200 bg-white p-2.5 text-left transition hover:border-lime-400 hover:shadow-sm"
            >
              <span className="flex items-center justify-between">
                <Icon size={14} className="text-slate-500 group-hover:text-lime-700" />
                <ExternalLink size={10} className="text-slate-500" />
              </span>
              <span className="mt-2 block text-xs font-semibold text-slate-700">
                {label}
              </span>
              <span className="mt-0.5 block text-xs leading-3 text-slate-600">
                {detail}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BlockContentEditor({
  block,
  selectedSubElement,
  onChange,
}: {
  block: WebBlock;
  selectedSubElement?: string | null;
  onChange: (patch: Partial<WebBlock>) => void;
}) {
  const selectedIndex =
    selectedSubElement && selectedSubElement.includes(":")
      ? Number(selectedSubElement.split(":")[1])
      : -1;

  const setItems = (key: keyof WebBlock, items: any[]) =>
    onChange({ [key]: items } as Partial<WebBlock>);
  const updateItem = (
    key: keyof WebBlock,
    items: any[],
    index: number,
    patch: Record<string, unknown>,
  ) =>
    setItems(
      key,
      items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    );
  const removeItem = (key: keyof WebBlock, items: any[], index: number) =>
    setItems(
      key,
      items.filter((_, itemIndex) => itemIndex !== index),
    );
  const duplicateItem = (key: keyof WebBlock, items: any[], index: number) =>
    setItems(key, [
      ...items.slice(0, index + 1),
      { ...structuredClone(items[index]), id: crypto.randomUUID() },
      ...items.slice(index + 1),
    ]);
  const moveItem = (
    key: keyof WebBlock,
    items: any[],
    index: number,
    dir: -1 | 1,
  ) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    setItems(key, next);
  };

  if (block.type === "Forms" && block.formFields) {
    const fields = block.formFields || [];
    return (
      <InspectorCollection
        icon={FormInput}
        title="Form fields"
        count={fields.length}
        addLabel="Add field"
        onAdd={() =>
          setItems("formFields", [
            ...fields,
            {
              id: crypto.randomUUID(),
              label: "New field",
              name: `field_${fields.length + 1}`,
              type: "text",
              placeholder: "Enter a value",
              required: false,
              width: "full",
            },
          ])
        }
      >
        {fields.map((field, index) => (
          <InspectorItem
            key={field.id}
            index={index}
            label={field.label || `Field ${index + 1}`}
            isSelected={index === selectedIndex}
            onDuplicate={() => duplicateItem("formFields", fields, index)}
            onDelete={() => removeItem("formFields", fields, index)}
            onMoveUp={index > 0 ? () => moveItem("formFields", fields, index, -1) : undefined}
            onMoveDown={index < fields.length - 1 ? () => moveItem("formFields", fields, index, 1) : undefined}
          >
            <div className="grid grid-cols-2 gap-2">
              <MiniField
                label="Label"
                value={field.label}
                onChange={(value) =>
                  updateItem("formFields", fields, index, { label: value })
                }
              />
              <MiniField
                label="Field name"
                value={field.name}
                onChange={(value) =>
                  updateItem("formFields", fields, index, {
                    name: value.toLowerCase().replace(/[^a-z0-9_]+/g, "_"),
                  })
                }
              />
            </div>
            <MiniField
              label="Placeholder"
              value={field.placeholder || ""}
              onChange={(value) =>
                updateItem("formFields", fields, index, {
                  placeholder: value,
                })
              }
            />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-600">
                  Field type
                </span>
                <select
                  value={field.type}
                  onChange={(event) =>
                    updateItem("formFields", fields, index, {
                      type: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium outline-none"
                >
                  {["text", "email", "tel", "date", "number", "password", "textarea", "select"].map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-600">
                  Width
                </span>
                <select
                  value={field.width || "full"}
                  onChange={(event) =>
                    updateItem("formFields", fields, index, {
                      width: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium outline-none"
                >
                  <option value="full">Full row</option>
                  <option value="half">Half row</option>
                </select>
              </label>
            </div>
            {field.type === "select" && (
              <MiniField
                label="Options (one per line)"
                value={(field.options || []).join("\n")}
                onChange={(value) =>
                  updateItem("formFields", fields, index, {
                    options: value
                      .split("\n")
                      .map((option) => option.trim())
                      .filter(Boolean),
                  })
                }
                multiline
              />
            )}
            <label className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-600">
              <input
                type="checkbox"
                checked={Boolean(field.required)}
                onChange={(event) =>
                  updateItem("formFields", fields, index, {
                    required: event.target.checked,
                  })
                }
                className="size-4 accent-lime-600"
              />
              Required field
            </label>
          </InspectorItem>
        ))}
      </InspectorCollection>
    );
  }

  if (block.type === "Text") {
    return (
      <InspectorDetails icon={Type} title="Text Block Content">
        <MiniField
          label="Heading / Title"
          value={block.title || ""}
          onChange={(value) => onChange({ title: value })}
          placeholder="Section Heading"
        />
        <MiniField
          label="Body Text / Article Content"
          value={block.subtitle || ""}
          onChange={(value) => onChange({ subtitle: value })}
          placeholder="Write paragraphs or article content here..."
          multiline
        />
      </InspectorDetails>
    );
  }

  if (block.type === "Gallery") {
    const images = block.galleryImages || [];
    return (
      <InspectorCollection
        icon={ImageIcon}
        title="Gallery images"
        count={images.length}
        addLabel="Add image"
        onAdd={() =>
          setItems("galleryImages", [
            ...images,
            {
              id: crypto.randomUUID(),
              url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=900",
              title: "New gallery image",
              subtitle: "Describe what customers should notice.",
              aspect: "square",
            },
          ])
        }
      >
        {images.map((image, index) => (
          <InspectorItem
            key={image.id}
            index={index}
            label={image.title || `Image ${index + 1}`}
            isSelected={index === selectedIndex}
            onDuplicate={() =>
              duplicateItem("galleryImages", images, index)
            }
            onDelete={() => removeItem("galleryImages", images, index)}
            onMoveUp={index > 0 ? () => moveItem("galleryImages", images, index, -1) : undefined}
            onMoveDown={index < images.length - 1 ? () => moveItem("galleryImages", images, index, 1) : undefined}
          >
            <div className="mb-3 aspect-[16/10] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              {image.url ? (
                <img
                  src={image.url}
                  alt=""
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="grid h-full place-items-center text-slate-500">
                  <ImageIcon size={22} />
                </div>
              )}
            </div>
            <MiniField
              label="Image URL"
              value={image.url}
              onChange={(value) =>
                updateItem("galleryImages", images, index, { url: value })
              }
              placeholder="https://…"
            />
            <MiniField
              label="Title"
              value={image.title}
              onChange={(value) =>
                updateItem("galleryImages", images, index, { title: value })
              }
            />
            <MiniField
              label="Caption"
              value={image.subtitle}
              onChange={(value) =>
                updateItem("galleryImages", images, index, {
                  subtitle: value,
                })
              }
              multiline
            />
            <label className="mt-3 block">
              <span className="mb-1.5 block text-xs font-medium text-slate-600">
                Image shape
              </span>
              <select
                value={image.aspect || "square"}
                onChange={(event) =>
                  updateItem("galleryImages", images, index, {
                    aspect: event.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium outline-none focus:border-lime-500"
              >
                <option value="square">Square (1:1)</option>
                <option value="landscape">Landscape (16:9)</option>
                <option value="portrait">Portrait (3:4)</option>
                <option value="circle">Circle (Round Mask)</option>
              </select>
            </label>

            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-600">
                  Resolution Size
                </span>
                <select
                  value={(image as any).resolution || "auto"}
                  onChange={(event) => {
                    const res = event.target.value;
                    let newUrl = image.url;
                    if (res !== "auto" && newUrl && newUrl.includes("unsplash.com")) {
                      try {
                        const u = new URL(newUrl);
                        u.searchParams.set("w", res);
                        u.searchParams.set("q", "80");
                        newUrl = u.toString();
                      } catch {}
                    }
                    updateItem("galleryImages", images, index, {
                      resolution: res,
                      url: newUrl,
                    });
                  }}
                  className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium outline-none focus:border-lime-500"
                >
                  <option value="auto">Auto / Original</option>
                  <option value="1920">Full HD (1920px)</option>
                  <option value="1200">Standard (1200px)</option>
                  <option value="800">Medium (800px)</option>
                  <option value="400">Thumbnail (400px)</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-600">
                  Auto Crop Focus
                </span>
                <select
                  value={(image as any).objectPosition || "center"}
                  onChange={(event) =>
                    updateItem("galleryImages", images, index, {
                      objectPosition: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium outline-none focus:border-lime-500"
                >
                  <option value="center">Center Focus</option>
                  <option value="top">Top Focus</option>
                  <option value="bottom">Bottom Focus</option>
                  <option value="left">Left Focus</option>
                  <option value="right">Right Focus</option>
                </select>
              </label>
            </div>
          </InspectorItem>
        ))}
      </InspectorCollection>
    );
  }

  if (
    block.type === "Features" ||
    block.type === "Business" ||
    Boolean(block.features)
  ) {
    const items = block.features || [];
    return (
      <InspectorCollection
        icon={ListOrdered}
        title={block.type === "Business" ? "Services" : "Feature cards"}
        count={items.length}
        addLabel={block.type === "Business" ? "Add service" : "Add card"}
        onAdd={() =>
          setItems("features", [
            ...items,
            {
              id: crypto.randomUUID(),
              title: "New item",
              desc: "Describe the customer outcome clearly.",
              icon: "Sparkles",
            },
          ])
        }
      >
        {items.map((item, index) => (
          <InspectorItem
            key={item.id}
            index={index}
            label={item.title}
            isSelected={index === selectedIndex}
            onDuplicate={() => duplicateItem("features", items, index)}
            onDelete={() => removeItem("features", items, index)}
            onMoveUp={index > 0 ? () => moveItem("features", items, index, -1) : undefined}
            onMoveDown={index < items.length - 1 ? () => moveItem("features", items, index, 1) : undefined}
          >
            <MiniField
              label="Title"
              value={item.title}
              onChange={(value) =>
                updateItem("features", items, index, { title: value })
              }
            />
            <MiniField
              label="Description"
              value={item.desc}
              onChange={(value) =>
                updateItem("features", items, index, { desc: value })
              }
              multiline
            />
            {(block.variant === "academy-courses" || item.imageUrl) && (
              <>
                <MiniField
                  label="Image URL"
                  value={item.imageUrl || ""}
                  onChange={(value) =>
                    updateItem("features", items, index, {
                      imageUrl: value,
                    })
                  }
                  placeholder="https://â€¦"
                />
                <div className="grid grid-cols-2 gap-2">
                  <MiniField
                    label="Eyebrow"
                    value={item.eyebrow || ""}
                    onChange={(value) =>
                      updateItem("features", items, index, {
                        eyebrow: value,
                      })
                    }
                  />
                  <MiniField
                    label="Link label"
                    value={item.linkText || ""}
                    onChange={(value) =>
                      updateItem("features", items, index, {
                        linkText: value,
                      })
                    }
                  />
                </div>
                <MiniField
                  label="Link destination (page slug or URL)"
                  value={item.linkActionValue || ""}
                  onChange={(value) =>
                    updateItem("features", items, index, {
                      linkActionType: /^https?:\/\//i.test(value) ? "external" : "link",
                      linkActionValue: value,
                    })
                  }
                  placeholder="services or https://example.com"
                />
              </>
            )}
            <MiniField
              label="Icon name"
              value={item.icon || ""}
              onChange={(value) =>
                updateItem("features", items, index, { icon: value })
              }
              placeholder="Sparkles, Heart, Check…"
            />
          </InspectorItem>
        ))}
      </InspectorCollection>
    );
  }

  if (block.type === "Pricing" || Boolean(block.pricing)) {
    const items = block.pricing || [];
    return (
      <InspectorCollection
        icon={BarChart3}
        title="Pricing plans"
        count={items.length}
        addLabel="Add plan"
        onAdd={() =>
          setItems("pricing", [
            ...items,
            {
              id: crypto.randomUUID(),
              tier: "New plan",
              price: "₹999",
              features: ["First benefit", "Second benefit"],
              btnText: "Choose plan",
              popular: false,
            },
          ])
        }
      >
        {items.map((item, index) => (
          <InspectorItem
            key={item.id}
            index={index}
            label={item.tier}
            isSelected={index === selectedIndex}
            onDuplicate={() => duplicateItem("pricing", items, index)}
            onDelete={() => removeItem("pricing", items, index)}
            onMoveUp={index > 0 ? () => moveItem("pricing", items, index, -1) : undefined}
            onMoveDown={index < items.length - 1 ? () => moveItem("pricing", items, index, 1) : undefined}
          >
            <div className="grid grid-cols-2 gap-2">
              <MiniField
                label="Plan name"
                value={item.tier}
                onChange={(value) =>
                  updateItem("pricing", items, index, { tier: value })
                }
              />
              <MiniField
                label="Price"
                value={item.price}
                onChange={(value) =>
                  updateItem("pricing", items, index, { price: value })
                }
              />
            </div>
            <MiniField
              label="Included items"
              value={(item.features || []).join("\n")}
              onChange={(value) =>
                updateItem("pricing", items, index, {
                  features: value
                    .split("\n")
                    .map((entry) => entry.trim())
                    .filter(Boolean),
                })
              }
              placeholder="One benefit per line"
              multiline
            />
            <MiniField
              label="Plan button"
              value={item.btnText}
              onChange={(value) =>
                updateItem("pricing", items, index, { btnText: value })
              }
            />
            <label className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-600">
              <input
                type="checkbox"
                checked={Boolean(item.popular)}
                onChange={(event) =>
                  updateItem("pricing", items, index, {
                    popular: event.target.checked,
                  })
                }
                className="size-4 accent-lime-600"
              />
              Highlight as recommended
            </label>
          </InspectorItem>
        ))}
      </InspectorCollection>
    );
  }

  if (block.type === "Testimonials" || Boolean(block.testimonials)) {
    const items = block.testimonials || [];
    return (
      <InspectorCollection
        icon={Star}
        title="Customer reviews"
        count={items.length}
        addLabel="Add review"
        onAdd={() =>
          setItems("testimonials", [
            ...items,
            {
              id: crypto.randomUUID(),
              name: "Customer name",
              role: "Verified customer",
              content: "Add a genuine customer review here.",
              avatar:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
              rating: 5,
            },
          ])
        }
      >
        {items.map((item, index) => (
          <InspectorItem
            key={item.id}
            index={index}
            label={item.name}
            onDuplicate={() => duplicateItem("testimonials", items, index)}
            onDelete={() => removeItem("testimonials", items, index)}
            onMoveUp={index > 0 ? () => moveItem("testimonials", items, index, -1) : undefined}
            onMoveDown={index < items.length - 1 ? () => moveItem("testimonials", items, index, 1) : undefined}
          >
            <div className="grid grid-cols-2 gap-2">
              <MiniField
                label="Customer"
                value={item.name}
                onChange={(value) =>
                  updateItem("testimonials", items, index, { name: value })
                }
              />
              <MiniField
                label="Role"
                value={item.role}
                onChange={(value) =>
                  updateItem("testimonials", items, index, { role: value })
                }
              />
            </div>
            <MiniField
              label="Review"
              value={item.content}
              onChange={(value) =>
                updateItem("testimonials", items, index, { content: value })
              }
              multiline
            />
            <MiniField
              label="Avatar URL"
              value={item.avatar}
              onChange={(value) =>
                updateItem("testimonials", items, index, { avatar: value })
              }
            />
            <label className="mt-3 block">
              <span className="mb-1.5 block text-xs font-medium text-slate-600">
                Rating
              </span>
              <select
                value={item.rating}
                onChange={(event) =>
                  updateItem("testimonials", items, index, {
                    rating: Number(event.target.value),
                  })
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium outline-none"
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} star{rating === 1 ? "" : "s"}
                  </option>
                ))}
              </select>
            </label>
          </InspectorItem>
        ))}
      </InspectorCollection>
    );
  }

  if (
    block.type === "Special" &&
    specialContentMode(block.variant) === "stats"
  ) {
    const items = block.stats || [];
    return (
      <InspectorCollection
        icon={BarChart3}
        title="Statistics"
        count={items.length}
        addLabel="Add statistic"
        onAdd={() =>
          setItems("stats", [
            ...items,
            {
              id: crypto.randomUUID(),
              label: "New statistic",
              val: 100,
              suffix: "+",
            },
          ])
        }
      >
        {items.map((item, index) => (
          <InspectorItem
            key={item.id}
            index={index}
            label={item.label}
            onDuplicate={() => duplicateItem("stats", items, index)}
            onDelete={() => removeItem("stats", items, index)}
            onMoveUp={index > 0 ? () => moveItem("stats", items, index, -1) : undefined}
            onMoveDown={index < items.length - 1 ? () => moveItem("stats", items, index, 1) : undefined}
          >
            <MiniField
              label="Label"
              value={item.label}
              onChange={(value) =>
                updateItem("stats", items, index, { label: value })
              }
            />
            <div className="grid grid-cols-2 gap-2">
              <MiniField
                label="Number"
                value={String(item.val)}
                onChange={(value) =>
                  updateItem("stats", items, index, {
                    val: Number(value) || 0,
                  })
                }
              />
              <MiniField
                label="Suffix"
                value={item.suffix}
                onChange={(value) =>
                  updateItem("stats", items, index, { suffix: value })
                }
                placeholder="+, %, /5"
              />
            </div>
          </InspectorItem>
        ))}
      </InspectorCollection>
    );
  }

  if (
    block.type === "Special" &&
    specialContentMode(block.variant) === "steps"
  ) {
    const items = block.steps || [];
    return (
      <InspectorCollection
        icon={ListOrdered}
        title="Process steps"
        count={items.length}
        addLabel="Add step"
        onAdd={() =>
          setItems("steps", [
            ...items,
            {
              id: crypto.randomUUID(),
              step: String(items.length + 1).padStart(2, "0"),
              title: "New step",
              desc: "Explain what happens at this stage.",
            },
          ])
        }
      >
        {items.map((item, index) => (
          <InspectorItem
            key={item.id}
            index={index}
            label={item.title}
            onDuplicate={() => duplicateItem("steps", items, index)}
            onDelete={() => removeItem("steps", items, index)}
            onMoveUp={index > 0 ? () => moveItem("steps", items, index, -1) : undefined}
            onMoveDown={index < items.length - 1 ? () => moveItem("steps", items, index, 1) : undefined}
          >
            <MiniField
              label="Step number"
              value={item.step}
              onChange={(value) =>
                updateItem("steps", items, index, { step: value })
              }
            />
            <MiniField
              label="Title"
              value={item.title}
              onChange={(value) =>
                updateItem("steps", items, index, { title: value })
              }
            />
            <MiniField
              label="Description"
              value={item.desc}
              onChange={(value) =>
                updateItem("steps", items, index, { desc: value })
              }
              multiline
            />
          </InspectorItem>
        ))}
      </InspectorCollection>
    );
  }

  if (block.type === "Special") {
    const items = block.faqs || [];
    return (
      <InspectorCollection
        icon={HelpCircle}
        title="Questions and answers"
        count={items.length}
        addLabel="Add question"
        onAdd={() =>
          setItems("faqs", [
            ...items,
            {
              id: crypto.randomUUID(),
              q: "New question",
              a: "Write a clear answer.",
            },
          ])
        }
      >
        {items.map((item, index) => (
          <InspectorItem
            key={item.id}
            index={index}
            label={item.q}
            onDuplicate={() => duplicateItem("faqs", items, index)}
            onDelete={() => removeItem("faqs", items, index)}
            onMoveUp={index > 0 ? () => moveItem("faqs", items, index, -1) : undefined}
            onMoveDown={index < items.length - 1 ? () => moveItem("faqs", items, index, 1) : undefined}
          >
            <MiniField
              label="Question"
              value={item.q}
              onChange={(value) =>
                updateItem("faqs", items, index, { q: value })
              }
            />
            <MiniField
              label="Answer"
              value={item.a}
              onChange={(value) =>
                updateItem("faqs", items, index, { a: value })
              }
              multiline
            />
          </InspectorItem>
        ))}
      </InspectorCollection>
    );
  }

  if (block.type === "Contact") {
    return (
      <InspectorDetails icon={Mail} title="Contact details">
        <MiniField
          label="Email"
          value={block.contactEmail || ""}
          onChange={(value) => onChange({ contactEmail: value })}
          placeholder="hello@business.in"
        />
        <MiniField
          label="Phone"
          value={block.contactPhone || ""}
          onChange={(value) => onChange({ contactPhone: value })}
          placeholder="+91 98765 43210"
        />
        <MiniField
          label="Address"
          value={block.contactAddress || ""}
          onChange={(value) => onChange({ contactAddress: value })}
          multiline
        />
      </InspectorDetails>
    );
  }

  if (block.type === "Map") {
    return (
      <InspectorDetails icon={MapPin} title="Map location">
        <MiniField
          label="Business address"
          value={block.mapAddress || ""}
          onChange={(value) => onChange({ mapAddress: value })}
          placeholder="Street, area, city, PIN code"
          multiline
        />
        <p className="mt-2 text-xs leading-4 text-slate-600">
          The published map searches this exact address. Include a landmark and
          PIN code for better accuracy.
        </p>
      </InspectorDetails>
    );
  }

  if (block.type === "Navigation" || block.type === "Footer") {
    const links = block.links || [];
    return (
      <>
        {block.type === "Footer" && (
          <InspectorDetails icon={Type} title="Footer details">
            <MiniField
              label="Copyright"
              value={block.copyright || ""}
              onChange={(value) => onChange({ copyright: value })}
            />
            <MiniField
              label="Phone"
              value={block.contactPhone || ""}
              onChange={(value) => onChange({ contactPhone: value })}
              placeholder="+91 98765 43210"
            />
            <MiniField
              label="Email"
              value={block.contactEmail || ""}
              onChange={(value) => onChange({ contactEmail: value })}
              placeholder="hello@business.in"
            />
            <MiniField
              label="Address"
              value={block.contactAddress || ""}
              onChange={(value) => onChange({ contactAddress: value })}
            />
          </InspectorDetails>
        )}
        <InspectorCollection
          icon={Link2}
          title={block.type === "Navigation" ? "Navigation links" : "Footer links"}
          count={links.length}
          addLabel="Add link"
          onAdd={() =>
            setItems("links", [
              ...links,
              {
                id: crypto.randomUUID(),
                label: "New link",
                url: "home",
              },
            ])
          }
        >
          {links.map((link, index) => (
            <InspectorItem
              key={link.id}
              index={index}
              label={link.label}
              onDuplicate={() => duplicateItem("links", links, index)}
              onDelete={() => removeItem("links", links, index)}
              onMoveUp={index > 0 ? () => moveItem("links", links, index, -1) : undefined}
              onMoveDown={index < links.length - 1 ? () => moveItem("links", links, index, 1) : undefined}
            >
              <MiniField
                label="Label"
                value={link.label}
                onChange={(value) =>
                  updateItem("links", links, index, { label: value })
                }
              />
              <MiniField
                label="Page slug or URL"
                value={link.url}
                onChange={(value) =>
                  updateItem("links", links, index, { url: value })
                }
                placeholder="services or https://…"
              />
            </InspectorItem>
          ))}
        </InspectorCollection>
      </>
    );
  }

  if (block.type === "EComStore") {
    return (
      <div className="space-y-4">
        <InspectorDetails icon={ShoppingBag} title="Store settings">
          <MiniField
            label="Section Title"
            value={block.title || ""}
            onChange={(value) => onChange({ title: value })}
            placeholder="Featured Collection"
          />
          <MiniField
            label="Section Subtitle"
            value={block.subtitle || ""}
            onChange={(value) => onChange({ subtitle: value })}
            placeholder="Explore our latest arrivals"
          />
          <MiniField
            label="WhatsApp Ordering Phone"
            value={block.contactPhone || ""}
            onChange={(value) => onChange({ contactPhone: value })}
            placeholder="919876543210"
          />
          {block.variant === "single-product-hero" && (
            <MiniField
              label="Product Showcase Image"
              value={(block as any).mediaUrl || ""}
              onChange={(value) => onChange({ mediaUrl: value } as any)}
              placeholder="https://..."
              allowUpload
            />
          )}
        </InspectorDetails>

        <div className="rounded-2xl border border-lime-200 bg-lime-50/70 p-3.5 space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-lime-600 text-white">
              <Database size={14} />
            </span>
            <div>
              <p className="text-xs font-semibold text-lime-950">
                Store Catalog Quick Tools
              </p>
              <p className="text-xs text-lime-800/80">
                Import CSV or seed 5 sample products into your Supabase database.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={async () => {
                const sampleProducts = [
                  {
                    title: "Wireless ANC Headphones",
                    description: "Active noise-canceling headphones with 40h battery.",
                    price: 2499,
                    category: "Electronics",
                    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800"],
                    stock: 50,
                    status: "active"
                  },
                  {
                    title: "Minimalist Smart Watch",
                    description: "Sleek AMOLED fitness watch with heart-rate sensor.",
                    price: 3499,
                    category: "Electronics",
                    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800"],
                    stock: 25,
                    status: "active"
                  },
                  {
                    title: "Organic Artisan Coffee Beans",
                    description: "100% Arabica single-origin roasted coffee.",
                    price: 599,
                    category: "Food & Beverage",
                    images: ["https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=800"],
                    stock: 100,
                    status: "active"
                  },
                  {
                    title: "Handcrafted Leather Wallet",
                    description: "Genuine full-grain bifold leather wallet.",
                    price: 1299,
                    category: "Accessories",
                    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800"],
                    stock: 40,
                    status: "active"
                  },
                  {
                    title: "Canvas Everyday Tote Bag",
                    description: "Durable eco-friendly cotton canvas bag.",
                    price: 899,
                    category: "Fashion",
                    images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800"],
                    stock: 75,
                    status: "active"
                  }
                ];

                for (const p of sampleProducts) {
                  await upsertProduct({
                    site_id: (block as any).siteId || "default",
                    ...p
                  });
                }
                alert("✓ 5 Sample E-Commerce products imported successfully into Supabase!");
              }}
              className="editor-interactive rounded-xl border border-lime-300 bg-white px-2.5 py-2 text-center text-xs font-semibold text-lime-900 transition hover:bg-lime-100 cursor-pointer"
            >
              <Zap size={13} className="inline-block -mt-0.5 mr-1" />
              Add Sample Items
            </button>

            <label className="rounded-xl border border-lime-300 bg-white px-2.5 py-2 text-center text-xs font-semibold text-lime-900 transition hover:bg-lime-100 cursor-pointer block">
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const text = await file.text();
                  const lines = text.split("\n").filter(Boolean);
                  let imported = 0;
                  for (let i = 1; i < lines.length; i++) {
                    const parts = lines[i].split(",");
                    if (parts.length >= 2) {
                      const title = parts[0]?.trim();
                      const price = Number(parts[1]?.trim()) || 0;
                      const description = parts[2]?.trim() || "";
                      const category = parts[3]?.trim() || "General";
                      const image = parts[4]?.trim() || "";
                      if (title && price) {
                        await upsertProduct({
                          site_id: (block as any).siteId || "default",
                          title,
                          price,
                          description,
                          category,
                          images: image ? [image] : [],
                          stock: 10,
                          status: "active"
                        });
                        imported++;
                      }
                    }
                  }
                  alert(`✓ ${imported} CSV Products imported into store catalog!`);
                }}
              />
              <span>📁 Import CSV File</span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  // Types without a dedicated collection editor (Hero, CTA, …) rely on the
  // common content fields above; show a helpful summary instead of a dead end.
  const summaryRows: [string, boolean][] = [
    ["Badge / eyebrow", Boolean(block.badge)],
    ["Heading", Boolean(block.title)],
    ["Supporting copy", Boolean(block.subtitle)],
    ["Button + destination", Boolean(block.btnText)],
  ];
  if (block.type === "Hero") {
    summaryRows.push(["Primary image", Boolean(block.imageUrl)]);
  }
  return (
    <InspectorDetails icon={Sparkles} title="Section content">
      <div className="space-y-1.5">
        {summaryRows.map(([label, isSet]) => (
          <div key={label} className="flex items-center gap-2 text-xs">
            <span
              className={`grid size-4 shrink-0 place-items-center rounded-full ${
                isSet
                  ? "bg-lime-500/15 text-lime-700"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {isSet ? (
                <Check size={11} strokeWidth={3} />
              ) : (
                <span className="size-1 rounded-full bg-current" />
              )}
            </span>
            <span
              className={isSet ? "font-medium text-slate-700" : "text-slate-500"}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs leading-4 text-slate-600">
        Edit the fields above, switch the layout variant for a new look, or open
        the Design tab to adjust colours and spacing.
      </p>
    </InspectorDetails>
  );
}

function getLayoutDescription(type: string, variantId: string): string {
  const key = `${type}_${variantId}`;
  const layoutMap: Record<string, string> = {
    'Hero_minimal': 'Centered heading + subtitle + CTA button',
    'Hero_split': 'Split: image on left, text content on right',
    'Hero_saas-modern': 'Split with feature highlights on right pane',
    'Hero_video-simulate': 'Video showcase area with text overlay',
    'Hero_editorial-stack': 'Stacked editorial layout, text blocks',
    'Hero_local-conversion': 'Left-aligned text with trust badges',
    'Hero_quiet-luxury': 'Dark minimal hero with elegant serif type',
    'Hero_bold-poster': 'Large bold typography as visual focal point',
    'Hero_soft-gradient': 'Soft gradient background, centered stack',
    'Hero_mono-grid': 'Monospace font, sharp grid-aligned layout',
    'Hero_warm-studio': 'Warm earthy tones, curved card elements',
    'Hero_glass-panel': 'Glassmorphism cards on dark gradient',
    'Hero_3d-mesh': '3D mesh wireframe background effect',
    'Hero_aurora-sky': 'Aurora animated gradient background',
    'Hero_gradient-glow': 'Glowing gradient backdrop with particles',
    // Features / Business
    'Features_3-col-grid': '3-column feature cards with icons',
    'Features_4-col-grid': '4-column compact feature cards',
    'Features_bento-box': 'Bento grid with mixed card sizes',
    'Features_alternating': 'Alternating image-text rows',
    'Features_icon-cards': 'Icon + text stacked card layout',
    'Features_comparison': 'Side-by-side comparison table',
    'Business_3-col-grid': '3-column business feature cards',
    'Business_4-col-grid': '4-column business feature cards',
    'Business_bento-box': 'Bento grid for service highlights',
    'Business_alternating': 'Alternating rows for services',
    'Business_icon-cards': 'Service cards with icon + description',
    'Business_comparison': 'Service comparison table',
    // CTA
    'CTA_gradient-cta': 'Full-width gradient CTA banner',
    'CTA_soft-gradient': 'Soft gradient CTA with text',
    'CTA_image-bg': 'Image background CTA overlay',
    'CTA_split-cta': 'Split: image half, text + button half',
    // Pricing
    'Pricing_3-tier': '3-column pricing tier cards',
    'Pricing_4-tier': '4-column pricing tier cards',
    'Pricing_matrix': 'Feature comparison matrix table',
    'Pricing_glass-panel': 'Glassmorphism pricing cards',
    'Pricing_mono-grid': 'Monospace grid pricing layout',
    // Testimonials
    'Testimonials_carousel': 'Carousel slider with customer cards',
    'Testimonials_wall-of-love': 'Wall of customer quote cards',
    'Testimonials_featured': 'Single featured testimonial card',
    'Testimonials_editorial-stack': 'Stacked editorial review layout',
    // Gallery
    'Gallery_grid': '2×2 image grid with thumbnails',
    'Gallery_masonry': 'Pinterest-style masonry waterfall',
    'Gallery_marquee-logos': 'Auto-scrolling logo marquee bar',
    'Gallery_carousel': 'Image carousel with navigation',
    // Forms
    'Forms_whatsapp': 'WhatsApp chat widget bubble',
    'Forms_contact-complex': 'Full contact form with fields',
    'Forms_booking': 'Appointment booking form',
    'Forms_newsletter': 'Minimal email signup form',
    'Forms_quiet-luxury': 'Dark elegant inquiry form',
    'Forms_local-conversion': 'Local business inquiry form',
    // Navigation
    'Navigation_nav-minimal': 'Logo + nav links + CTA button',
    'Navigation_nav-glass': 'Glass blurred translucent navbar',
    'Navigation_nav-pill': 'Pill/capsule shaped navigation',
    'Navigation_nav-mega': 'Mega menu with dropdown columns',
    'Navigation_nav-3d': '3D tilted perspective navbar',
    'Navigation_nav-aurora': 'Aurora gradient animated navbar',
    // Footer
    'Footer_footer-classic': 'Logo + link columns + copyright',
    'Footer_footer-minimal': 'Centered copyright line only',
    'Footer_footer-bento': 'Bento grid footer layout',
    'Footer_footer-map': 'Footer with embedded map',
    'Footer_footer-glass': 'Glass translucent footer',
    'Footer_footer-3d': '3D perspective footer design',
    'Footer_footer-aurora': 'Aurora gradient footer',
    // Special
    'Special_faq-accordions': 'Collapsible Q&A accordion list',
    'Special_stats-grid': 'Animated stat counters grid',
    'Special_steps-path': 'Step-by-step numbered guide',
    'Special_editorial-stack': 'Stacked content accordion',
    // Map
    'Map_minimal': 'Map with pin marker',
    // Text
    'Text_minimal': 'Heading + paragraph text block',
    'Text_quote-callout': 'Pull quote with vertical accent bar',
    // EComStore
    'EComStore_single-product-hero': 'Product image + details + CTA',
    'EComStore_product-grid': 'Product grid with thumbnails',
    'EComStore_whatsapp-store': 'WhatsApp catalog store view',
  };
  return layoutMap[key] || `${type} · ${variantId}`;
}

function VariantPreview({ type, variantId, index }: { type: string; variantId?: string; index: number }) {
  const s = 'w-12 h-9';
  return (
    <span className={`${s} rounded-md overflow-hidden border border-slate-200 flex-shrink-0`}>
      <VariantMiniPreview type={type} variantId={variantId} index={index} />
    </span>
  );
}

export function VariantPicker({
  type,
  value,
  onChange,
}: {
  type: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const variants = BLOCK_VARIANTS_MAP[type] || [];
  const [hoveredVariant, setHoveredVariant] = useState<typeof variants[0] | null>(null);
  const selectedVariant =
    variants.find((variant) => variant.id === value) || variants[0];
  const selectedIndex = Math.max(
    0,
    variants.findIndex((variant) => variant.id === selectedVariant?.id),
  );

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5 text-left transition hover:border-slate-300 hover:shadow-sm data-[state=open]:border-lime-500 data-[state=open]:ring-2 data-[state=open]:ring-lime-100"
        >
          <VariantPreview type={type} variantId={selectedVariant?.id} index={selectedIndex} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-semibold">
              {selectedVariant?.name || "Choose a layout"}
            </span>
            <span className="mt-0.5 block truncate text-xs text-slate-600">
              {variants.length} layouts available
            </span>
          </span>
          <ChevronDown
            size={15}
            className="text-slate-600 transition group-data-[state=open]:rotate-180"
          />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          collisionPadding={12}
          className="z-[110] w-[500px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]"
        >
          <Command>
            <div className="flex items-center gap-2 border-b border-slate-100 px-3">
              <CommandIcon size={14} className="text-slate-600" />
              <Command.Input
                placeholder={`Search ${type.toLowerCase()} layouts…`}
                className="h-12 flex-1 bg-transparent text-xs font-semibold outline-none placeholder:text-slate-600"
              />
            </div>
            <div className="flex min-h-0 flex-1">
              <Command.List className="flex-1 overflow-y-auto p-2 max-h-[320px]">
                <Command.Empty className="p-6 text-center text-xs text-slate-600">
                  No matching layout.
                </Command.Empty>
                {variants.map((variant, index) => {
                  const active = variant.id === value;
                  const isHovered = hoveredVariant?.id === variant.id;
                  return (
                    <Popover.Close asChild key={variant.id}>
                      <Command.Item
                        value={`${variant.name} ${variant.description} ${variant.tags.join(" ")}`}
                        onSelect={() => onChange(variant.id)}
                        onMouseEnter={() => setHoveredVariant(variant)}
                        onMouseLeave={() => setHoveredVariant(null)}
                        className={`group flex cursor-pointer items-center gap-3 rounded-xl p-2.5 outline-none transition-colors data-[selected=true]:bg-slate-50 ${
                          active ? 'bg-lime-50' : isHovered ? 'bg-slate-50' : ''
                        }`}
                      >
                        <VariantPreview type={type} variantId={variant.id} index={index} />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="truncate text-xs font-semibold text-slate-800">
                              {variant.name}
                            </span>
                            {active && (
                              <span className="grid size-4 place-items-center rounded-full bg-lime-600 text-white shrink-0">
                                <Check size={10} strokeWidth={3} />
                              </span>
                            )}
                          </span>
                          <span className="mt-0.5 line-clamp-2 text-xs leading-4 text-slate-600">
                            {variant.description}
                          </span>
                        </span>
                      </Command.Item>
                    </Popover.Close>
                  );
                })}
              </Command.List>
              {/* Hover preview panel — LARGER with layout annotations */}
              {hoveredVariant && (
                <div className="w-60 shrink-0 border-l border-slate-100 p-3 flex flex-col gap-2 bg-slate-50/50 overflow-y-auto">
                  {/* BIG preview mockup — shows the actual layout structure */}
                  <div className="w-full rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm">
                    <VariantMiniPreview type={type} variantId={hoveredVariant.id} index={variants.findIndex(v => v.id === hoveredVariant.id)} size="lg" />
                  </div>
                  {/* Layout details */}
                  <div>
                    <p className="text-xs font-semibold text-slate-800 leading-tight">{hoveredVariant.name}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded text-xs font-medium uppercase tracking-wider bg-lime-100 text-lime-800">
                        {type}
                      </span>
                      <span className="text-xs text-slate-600">●</span>
                      <span className="text-xs font-semibold text-slate-500">
                        {getLayoutDescription(type, hoveredVariant.id)}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500 leading-relaxed line-clamp-2">{hoveredVariant.description}</p>
                    {hoveredVariant.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {hoveredVariant.tags.slice(0, 5).map(tag => (
                          <span key={tag} className="px-1.5 py-0.5 rounded-md text-xs font-medium uppercase tracking-wide bg-slate-100 text-slate-500">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Mini visual legend showing what each element represents */}
                  <div className="mt-1 grid grid-cols-2 gap-x-2 gap-y-0.5 rounded-lg bg-white p-2 border border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-0.5 rounded-sm bg-slate-800" />
                      <span className="text-xs text-slate-600">Heading</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-0.5 rounded-sm bg-slate-300" />
                      <span className="text-xs text-slate-600">Text</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-1 rounded-sm" style={{ backgroundColor: '#65a30d' }} />
                      <span className="text-xs text-slate-600">Button</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-sm" style={{ backgroundColor: '#e2e8f0' }} />
                      <span className="text-xs text-slate-600">Card</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="border-t border-slate-100 px-3 py-2.5 text-xs font-medium text-slate-600">
              {variants.length} layouts · Hover right panel for preview
            </div>
          </Command>
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
