import React from 'react';

const gradientPairs = [
  'from-violet-500 to-indigo-500',
  'from-pink-500 to-rose-500',
  'from-cyan-500 to-blue-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-fuchsia-500 to-purple-500',
  'from-sky-500 to-cyan-500',
  'from-lime-500 to-emerald-500',
];

function getGradient(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradientPairs[Math.abs(hash) % gradientPairs.length];
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px] ring-1',
  sm: 'w-8 h-8 text-xs ring-1',
  md: 'w-10 h-10 text-sm ring-2',
  lg: 'w-12 h-12 text-base ring-2',
  xl: 'w-16 h-16 text-lg ring-2',
};

const Avatar = ({
  src,
  name = '',
  size = 'md',
  className = '',
}) => {
  const [imgError, setImgError] = React.useState(false);
  const showFallback = !src || imgError;

  return (
    <div
      className={`
        relative inline-flex items-center justify-center rounded-full
        ring-white/[0.08] overflow-hidden flex-shrink-0
        ${sizeClasses[size]}
        ${showFallback ? `bg-gradient-to-br ${getGradient(name)}` : 'bg-slate-700'}
        ${className}
      `}
    >
      {showFallback ? (
        <span className="font-semibold text-white leading-none select-none">
          {getInitials(name)}
        </span>
      ) : (
        <img
          src={src}
          alt={name || 'Avatar'}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );
};

export default Avatar;
