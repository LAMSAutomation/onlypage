import React from 'react';
import { Github, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';

export interface MuiFooterProps {
  brandName?: string;
  tagline?: string;
  copyright?: string;
  styles?: any;
  block?: any;
}

const COLUMNS = [
  {
    heading: 'Product',
    links: ['Features', 'Pricing', 'Templates', 'Components', 'Changelog'],
  },
  {
    heading: 'Resources',
    links: ['Documentation', 'Guides', 'API Reference', 'Community', 'Status'],
  },
  {
    heading: 'Company',
    links: ['About', 'Blog', 'Careers', 'Contact', 'Press Kit'],
  },
];

const SOCIALS = [
  { icon: Twitter, label: 'Twitter' },
  { icon: Github, label: 'GitHub' },
  { icon: Linkedin, label: 'LinkedIn' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Youtube, label: 'YouTube' },
];

export const MuiFooter: React.FC<MuiFooterProps> = ({
  brandName,
  tagline,
  copyright,
  styles = {},
  block
}) => {
  const columns = block?.columns?.length ? block.columns : COLUMNS;
  const socials = block?.socials?.length ? block.socials : SOCIALS;

  return (
    <footer>
      <div className="mx-auto max-w-6xl px-4 @sm:px-6">
        <div className="grid grid-cols-1 gap-12 @lg:grid-cols-4">
          <div className="@lg:pr-8">
            <div className="flex items-center gap-2.5">
              {block?.logo ? (
                <img src={block.logo} alt="Logo" className="h-8 w-auto" />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black text-white" style={{ backgroundColor: styles.accentColor || '#2563eb' }}>
                  {(brandName || block?.brandName || 'O').charAt(0)}
                </span>
              )}
              <span className="text-lg font-bold" style={{ color: styles.headingColor || '#ffffff' }}>{brandName || block?.brandName || 'OnlyPage'}</span>
            </div>
            <p className="text-sm font-medium leading-relaxed mt-4" style={{ color: styles.subtitleColor || '#94a3b8' }}>
              {tagline || block?.tagline || 'Build beautiful sites with a design system you already know.'}
            </p>
            <div className="mt-6 flex gap-2">
              {socials.map((s: any, idx: number) => {
                const Icon = s.icon || Twitter;
                return (
                  <a
                    key={s.label || idx}
                    href={s.url || '#'}
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg transition-all hover:text-white"
                    style={{ backgroundColor: styles.cardBgColor || '#1e293b', color: styles.subtitleColor || '#94a3b8', ...({ '--tw-hover-bg': styles.accentColor || '#2563eb' } as any) }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.accentColor || '#2563eb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.cardBgColor || '#1e293b'}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {columns.map((col: any, idx: number) => (
            <div key={col.heading || idx}>
              <h4 className="text-lg font-bold uppercase" style={{ color: styles.subtitleColor || '#64748b' }}>{col.heading || col.title}</h4>
              <ul className="mt-4 space-y-3">
                {(col.links || []).map((link: any, lidx: number) => {
                  const label = typeof link === 'string' ? link : link.label;
                  const url = typeof link === 'string' ? '#' : link.url;
                  return (
                    <li key={label || lidx}>
                      <a href={url} className="text-sm transition-colors hover:text-white" style={{ color: styles.subtitleColor || '#94a3b8' }}>
                        {label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t pt-8 @sm:flex-row" style={{ borderColor: styles.cardBorderColor || '#1e293b' }}>
          <p className="text-xs" style={{ color: styles.subtitleColor || '#64748b' }}>{copyright || block?.copyright || '© 2026 OnlyPage. All rights reserved.'}</p>
          <div className="flex gap-6 text-xs" style={{ color: styles.subtitleColor || '#64748b' }}>
            <a href="#" className="transition-colors hover:text-white">Privacy</a>
            <a href="#" className="transition-colors hover:text-white">Terms</a>
            <a href="#" className="transition-colors hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
