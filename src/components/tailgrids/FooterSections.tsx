import React from 'react';
import { Github, Linkedin, Twitter, Youtube } from 'lucide-react';

export interface TailgridsFooterProps {
  brandName?: string;
  tagline?: string;
  copyright?: string;
  styles?: any;
  block?: any;
}

const COLUMNS = [
  { heading: 'Company', links: ['About us', 'Contact', 'Careers', 'Press'] },
  { heading: 'Products', links: ['Website Builder', 'Components', 'Templates', 'Pricing'] },
  { heading: 'Resources', links: ['Blog', 'Documentation', 'Help Center', 'Community'] },
];

const SOCIALS = [
  { icon: Twitter, label: 'Twitter' },
  { icon: Github, label: 'GitHub' },
  { icon: Youtube, label: 'YouTube' },
  { icon: Linkedin, label: 'LinkedIn' },
];

export const TailgridsFooter: React.FC<TailgridsFooterProps> = ({
  brandName,
  tagline,
  copyright,
  styles = {},
  block
}) => {
  const columns = block?.linkColumns?.length ? block.linkColumns : COLUMNS;

  return (
    <footer className="text-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-12 @lg:grid-cols-5">
          <div className="@lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg text-base font-bold text-white"
                style={{ backgroundColor: styles.accentColor || '#4f46e5' }}
              >
                {brandName ? brandName.charAt(0) : 'T'}
              </span>
              <span className="text-xl font-bold" style={{ color: '#ffffff' }}>{brandName || 'Tailgrids'}</span>
            </div>
            <p className="text-sm font-medium leading-relaxed mt-5 max-w-sm opacity-70" style={{ color: '#ffffff' }}>
              {tagline || 'Build robust web apps with clean structural layouts.'}
            </p>
            <div className="mt-7 flex gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/70 transition-all hover:text-white"
                  style={{ ':hover': { backgroundColor: styles.accentColor || '#4f46e5' } } as React.CSSProperties}
                >
                  <s.icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col: any, i: number) => (
            <div key={col.id || col.heading || i}>
              <h4 className="text-lg font-bold uppercase opacity-80" style={{ color: '#ffffff' }}>{col.heading}</h4>
              <ul className="mt-5 space-y-3.5">
                {(col.links || []).map((link: any, idx: number) => {
                  const label = typeof link === 'string' ? link : link.label;
                  return (
                    <li key={idx}>
                      <a href="#" className="text-sm opacity-60 transition-opacity hover:opacity-100" style={{ color: '#ffffff' }}>
                        {label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 @sm:flex-row">
          <p className="text-sm font-medium leading-relaxed opacity-50" style={{ color: '#ffffff' }}>
            {copyright || '© 2026 Tailgrids. All rights reserved.'}
          </p>
          <div className="flex gap-6 text-sm opacity-50" style={{ color: '#ffffff' }}>
            <a href="#" className="transition-opacity hover:opacity-100">Privacy Policy</a>
            <a href="#" className="transition-opacity hover:opacity-100">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
