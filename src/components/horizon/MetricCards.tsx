import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, DollarSign, Users, ShoppingBag, Activity } from 'lucide-react';

export interface HorizonMetricCardProps {
  title?: string;
  value?: string;
  growth?: string;
  isPositive?: boolean;
  icon?: any;
  subtitle?: string;
  styles?: any;
  block?: any;
}

export const HorizonMetricCard: React.FC<HorizonMetricCardProps> = ({
  title,
  value,
  growth,
  isPositive = true,
  icon: Icon = DollarSign,
  subtitle,
  styles = {},
  block
}) => {
  const cardTitle = title || block?.title || 'Earnings';
  const cardValue = value || block?.value || '$350.4k';
  const cardGrowth = growth || block?.growth || '';
  const cardSubtitle = subtitle || block?.subtitle || '';
  const isPos = block?.isPositive !== undefined ? block.isPositive : isPositive;
  const CardIcon = block?.icon || Icon;

  return (
    <div className="flex items-center justify-between rounded-3xl border p-5 shadow-sm transition-shadow hover:shadow-md"
      style={{ backgroundColor: styles.cardBgColor || '#ffffff', borderColor: styles.cardBorderColor || '#f3f4f6' }}
    >
      <div>
        <span className="text-xs font-bold uppercase tracking-widest mb-1 block" style={{ color: styles.subtitleColor || '#9ca3af' }}>
          {cardTitle}
        </span>
        <h4 className="text-lg font-bold" style={{ color: styles.textColor || '#111827' }}>{cardValue}</h4>
        {(cardGrowth || cardSubtitle) && (
          <div className="mt-2 flex items-center gap-1.5">
            {cardGrowth && (
              <span className={`inline-flex items-center text-xs font-bold ${isPos ? 'text-emerald-500' : 'text-rose-500'}`}>
                {isPos ? <TrendingUp className="mr-0.5 h-3.5 w-3.5" /> : <TrendingDown className="mr-0.5 h-3.5 w-3.5" />}
                {cardGrowth}
              </span>
            )}
            {cardSubtitle && <span className="text-xs" style={{ color: styles.subtitleColor || '#9ca3af' }}>{cardSubtitle}</span>}
          </div>
        )}
      </div>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
        style={{ backgroundColor: styles.accentColor ? `${styles.accentColor}1A` : '#eef2ff', color: styles.accentColor || '#4f46e5' }}
      >
        <CardIcon className="h-6 w-6" />
      </div>
    </div>
  );
};

export interface HorizonNFTCardProps {
  imageSrc?: string;
  title?: string;
  author?: string;
  currentBid?: string;
  onBidClick?: () => void;
  styles?: any;
  block?: any;
}

export const HorizonNFTCard: React.FC<HorizonNFTCardProps> = ({
  imageSrc,
  title,
  author,
  currentBid,
  onBidClick,
  styles = {},
  block
}) => {
  const cardImg = imageSrc || block?.imageSrc || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80';
  const cardTitle = title || block?.title || 'Abstract Fluid Geometry #04';
  const cardAuthor = author || block?.author || 'By Alex Rivers';
  const cardBid = currentBid || block?.currentBid || '2.45 ETH';

  return (
    <div className="flex flex-col gap-4 rounded-3xl border p-4 shadow-sm"
      style={{ backgroundColor: styles.cardBgColor || '#ffffff', borderColor: styles.cardBorderColor || '#f3f4f6' }}
    >
      <div className="relative aspect-video overflow-hidden rounded-2xl">
        <img src={cardImg} alt={cardTitle} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
      </div>
      <div>
        <h5 className="text-base font-bold" style={{ color: styles.textColor || '#111827' }}>{cardTitle}</h5>
        <p className="mt-0.5 text-xs" style={{ color: styles.subtitleColor || '#9ca3af' }}>{cardAuthor}</p>
      </div>
      <div className="flex items-center justify-between border-t pt-2" style={{ borderColor: styles.cardBorderColor || '#f9fafb' }}>
        <div>
          <span className="block text-xs" style={{ color: styles.subtitleColor || '#9ca3af' }}>{block?.bidLabel || 'Current Bid'}</span>
          <span className="text-sm font-extrabold" style={{ color: styles.accentColor || '#4f46e5' }}>{cardBid}</span>
        </div>
        <button
          onClick={onBidClick}
          className="rounded-xl px-4 py-2 text-xs font-bold shadow-sm transition-colors hover:opacity-90"
          style={{ backgroundColor: styles.accentColor || '#4f46e5', color: '#ffffff' }}
        >
          {block?.btnText || 'Place Bid'}
        </button>
      </div>
    </div>
  );
};
