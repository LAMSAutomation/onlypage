import React from 'react';
import { Dribbble, Github, Linkedin, Twitter, Youtube } from 'lucide-react';

export interface UntitledFooterProps {
  brandName?: string;
  tagline?: string;
  copyright?: string;
  styles?: any;
  block?: any;
}

const COLUMNS = [
  { heading: 'Product', links: ['Overview', 'Features', 'Pricing', 'Changelog'] },
  { heading: 'Resources', links: ['Blog', 'Documentation', 'Community', 'Support'] },
  { heading: 'Company', links: ['About', 'Careers', 'Contact', 'Press'] },
];

const SOCIALS = [
  { icon: Twitter, label: 'Twitter' },
  { icon: Github, label: 'GitHub' },
  { icon: Dribbble, label: 'Dribbble' },
  { icon: Linkedin, label: 'LinkedIn' },
  { icon: Youtube, label: 'YouTube' },
];

export const UntitledFooter: React.FC<UntitledFooterProps> = ({
  brandName,
  tagline,
  copyright,
  styles = {},
  block
}) => {
  const columns = block?.linkColumns?.length ? block.linkColumns : COLUMNS;
  
  return (
    <footer>
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-12 @lg:grid-cols-5">
          <div className="@lg:col-span-2 @lg:pr-12">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold"
                style={{ backgroundColor: styles.accentColor || '#4f46e5', color: '#ffffff' }}
              >
                {brandName ? brandName.charAt(0) : 'U'}
              </span>
              <span className="text-lg font-semibold" style={{ color: styles.textColor || '#111827' }}>
                {brandName || 'Untitled'}
              </span>
            </div>
            <p className="text-sm font-medium leading-relaxed mt-4 max-w-sm" style={{ color: styles.subtitleColor || '#4b5563' }}>
              {tagline || 'Design robust digital experiences with clean layout blocks.'}
            </p>
          </div>

          {columns.map((col: any, i: number) => (
            <div key={col.id || col.heading || i}>
              <h4 className="text-lg font-bold" style={{ color: styles.textColor || '#111827' }}>
                {col.heading}
              </h4>
              <ul className="mt-4 space-y-3">
                {(col.links || []).map((link: any, idx: number) => {
                  const label = typeof link === 'string' ? link : link.label;
                  return (
                    <li key={idx}>
                      <a href="#" className="text-sm transition-colors hover:opacity-75" style={{ color: styles.subtitleColor || '#4b5563' }}>
                        {label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t pt-8 @sm:flex-row" style={{ borderColor: styles.cardBorderColor || '#e5e7eb' }}>
          <p className="text-sm font-medium leading-relaxed" style={{ color: styles.subtitleColor || '#6b7280' }}>
            {copyright || '© 2026 Untitled Inc. All rights reserved.'}
          </p>
          <div className="flex gap-1">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-lg transition-all hover:bg-gray-100"
                style={{ color: styles.subtitleColor || '#6b7280' }}
              >
                <s.icon size={17} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
