import React from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type StatusIndicator = 'online' | 'offline' | 'busy';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  status?: StatusIndicator;
  className?: string;
  styles?: any;
  block?: any;
}

const avatarSizes: Record<AvatarSize, { container: string; text: string; status: string }> = {
  xs: { container: 'w-6 h-6', text: 'text-xs', status: 'w-1.5 h-1.5 ring-1' },
  sm: { container: 'w-8 h-8', text: 'text-xs', status: 'w-2 h-2 ring-2' },
  md: { container: 'w-10 h-10', text: 'text-sm', status: 'w-2.5 h-2.5 ring-2' },
  lg: { container: 'w-12 h-12', text: 'text-base', status: 'w-3 h-3 ring-2' },
  xl: { container: 'w-16 h-16', text: 'text-lg', status: 'w-4 h-4 ring-2' },
};

const statusColors: Record<StatusIndicator, string> = {
  online: 'bg-emerald-500',
  offline: 'bg-gray-400',
  busy: 'bg-rose-500',
};

const getInitials = (name?: string) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name[0].toUpperCase();
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  status,
  className = '',
  styles = {},
  block
}) => {
  const avatarSize = block?.size || size;
  const avatarSrc = src || block?.src;
  const avatarName = name || block?.name;
  const avatarStatus = status || block?.status;
  const sizeConfig = avatarSizes[avatarSize as AvatarSize] || avatarSizes.md;

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      {avatarSrc ? (
        <img
          src={avatarSrc}
          alt={alt || avatarName || 'Avatar'}
          className={`${sizeConfig.container} rounded-full object-cover ring-2`}
          style={{ borderColor: styles.cardBgColor || '#ffffff' }}
        />
      ) : (
        <div
          className={`${sizeConfig.container} ${sizeConfig.text} flex items-center justify-center rounded-full font-semibold ring-2`}
          style={{ backgroundColor: styles.accentColor ? `${styles.accentColor}1A` : '#e0e7ff', color: styles.accentColor || '#4338ca', borderColor: styles.cardBgColor || '#ffffff' }}
        >
          {getInitials(avatarName)}
        </div>
      )}
      {avatarStatus && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-2 ${sizeConfig.status} ${statusColors[avatarStatus as StatusIndicator]}`}
          style={{ borderColor: styles.cardBgColor || '#ffffff' }}
        />
      )}
    </div>
  );
};

export interface AvatarGroupProps {
  avatars?: { src?: string; name?: string }[];
  maxDisplay?: number;
  size?: AvatarSize;
  styles?: any;
  block?: any;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars = [],
  maxDisplay = 4,
  size = 'md',
  styles = {},
  block
}) => {
  const avatarList = block?.avatars?.length ? block.avatars : avatars;
  const displayLimit = block?.maxDisplay || maxDisplay;
  const avatarSize = block?.size || size;

  const visible = avatarList.slice(0, displayLimit);
  const remaining = avatarList.length - displayLimit;
  const sizeConfig = avatarSizes[avatarSize as AvatarSize] || avatarSizes.md;

  return (
    <div className="flex items-center -space-x-2 overflow-hidden">
      {visible.map((av: any, index: number) => (
        <Avatar key={index} src={av.src} name={av.name} size={avatarSize} styles={styles} />
      ))}
      {remaining > 0 && (
        <div
          className={`${sizeConfig.container} ${sizeConfig.text} flex items-center justify-center rounded-full font-medium ring-2`}
          style={{ backgroundColor: styles.cardBorderColor || '#f3f4f6', color: styles.subtitleColor || '#4b5563', borderColor: styles.cardBgColor || '#ffffff' }}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};
