import React from 'react';

export interface TailgridsLogoCloudProps {
  title?: string;
  styles?: any;
  block?: any;
}

const LOGOS = ['VERCEL', 'STRIPE', 'NETFLIX', 'AIRBNB', 'SPOTIFY', 'ZOOM'];

export const TailgridsLogoCloud: React.FC<TailgridsLogoCloudProps> = ({
  title,
  styles = {},
  block
}) => {
  const logos = block?.logos?.length ? block.logos : LOGOS;

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-sm font-medium leading-relaxed uppercase" style={{ color: styles.subtitleColor || '#9ca3af' }}>
          {title || 'Trusted by teams at'}
        </p>
        <div className="mt-8 grid grid-cols-2 gap-8 @sm:grid-cols-3 @lg:grid-cols-6">
          {logos.map((logo: any, idx: number) => {
            const logoText = typeof logo === 'string' ? logo : (logo.name || logo.alt || 'BRAND');
            return (
              <div
                key={typeof logo === 'string' ? logo : logo.id || idx}
                className="flex items-center justify-center rounded-lg border py-4 text-sm font-bold tracking-widest transition-all duration-300 hover:shadow-sm"
                style={{
                  backgroundColor: styles.cardBgColor || '#ffffff',
                  borderColor: styles.cardBorderColor || '#f3f4f6',
                  color: styles.subtitleColor || '#9ca3af'
                }}
              >
                {typeof logo === 'object' && logo.url ? (
                  <img src={logo.url} alt={logoText} className="h-6 object-contain opacity-60 hover:opacity-100 transition-opacity" />
                ) : (
                  logoText
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
