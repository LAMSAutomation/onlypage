import React from 'react';
import { Mail, MessageCircle, Phone } from 'lucide-react';

export interface HorizonProfileCardProps {
  name?: string;
  role?: string;
  company?: string;
  bio?: string;
  styles?: any;
  block?: any;
}

export const HorizonProfileCard: React.FC<HorizonProfileCardProps> = ({
  name,
  role,
  company,
  bio,
  styles = {},
  block
}) => {
  const profileName = name || block?.name || 'Alessandra Williams';
  const profileRole = role || block?.role || 'Senior Product Designer';
  const profileCompany = company || block?.company || 'Horizon UI';
  const profileBio = bio || block?.bio || 'Designing clean, data-driven interfaces for the past 8 years. Passionate about design systems, motion, and accessibility.';

  return (
    <section>
      <div className="mx-auto max-w-md px-4">
        <div className="overflow-hidden rounded-3xl shadow-2xl"
          style={{ backgroundColor: styles.cardBgColor || '#111C44', boxShadow: styles.cardBorderColor ? `inset 0 0 0 1px ${styles.cardBorderColor}` : '0 25px 50px -12px rgba(11,20,55,0.4)' }}
        >
          {/* Cover */}
          <div className="relative h-32"
            style={{ background: styles.accentColor ? `linear-gradient(to right, ${styles.accentColor}, #43CBFF)` : 'linear-gradient(to right, #7551FF, #43CBFF, #F6B03C)' }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.35),transparent_60%)]" />
          </div>

          <div className="relative px-8 pb-8">
            <div className="-mt-12 flex items-end justify-between">
              {block?.avatar ? (
                <img src={block.avatar} alt={profileName} className="flex h-24 w-24 items-center justify-center rounded-3xl object-cover ring-4" style={{ borderColor: styles.cardBgColor || '#111C44' }} />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl text-3xl font-black text-white ring-4"
                  style={{ background: styles.accentColor ? `linear-gradient(to bottom right, ${styles.accentColor}, #43CBFF)` : 'linear-gradient(to bottom right, #7551FF, #43CBFF)', borderColor: styles.cardBgColor || '#111C44' }}
                >
                  {profileName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
              )}
              <div className="flex gap-2">
                {[
                  { icon: MessageCircle, label: 'Message' },
                  { icon: Phone, label: 'Call' },
                  { icon: Mail, label: 'Email' },
                ].map((a) => (
                  <a
                    key={a.label}
                    href="#"
                    aria-label={a.label}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur transition-all hover:text-white"
                    style={{ color: styles.subtitleColor || '#cbd5e1', ...({ '--tw-hover-bg': styles.accentColor || '#7551FF' } as any) }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.accentColor || '#7551FF'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                  >
                    <a.icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            <h2 className="text-3xl @sm:text-4xl font-extrabold tracking-tight mt-5" style={{ color: styles.textColor || '#ffffff' }}>{profileName}</h2>
            <p className="text-sm font-medium leading-relaxed mt-1" style={{ color: styles.highlightColor || '#43CBFF' }}>
              {profileRole} <span style={{ color: styles.subtitleColor || '#64748b' }}>@ {profileCompany}</span>
            </p>
            <p className="text-sm font-medium leading-relaxed mt-4" style={{ color: styles.subtitleColor || '#94a3b8' }}>{profileBio}</p>

            <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl bg-white/5 p-4 text-center ring-1 ring-inset ring-white/10">
              {(block?.stats || [
                { value: '132', label: 'Projects' },
                { value: '24', label: 'Awards' },
                { value: '8y', label: 'Experience' },
              ]).map((s: any, idx: number) => (
                <div key={s.label || idx}>
                  <div className="text-lg font-black" style={{ color: styles.textColor || '#ffffff' }}>{s.value}</div>
                  <div className="text-[11px] font-medium uppercase tracking-wider" style={{ color: styles.subtitleColor || '#64748b' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
