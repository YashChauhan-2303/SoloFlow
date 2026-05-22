import React from 'react';

const Skeleton = ({ width = 'w-full', height = 'h-4', className = '', count = 1, rounded = 'rounded-lg' }) => {
  const skeletons = Array.from({ length: count }).map((_, i) => (
    <div
      key={i}
      className={`${width} ${height} ${rounded} bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-shimmer bg-[length:1000px_100%]`}
      style={{
        backgroundImage: 'linear-gradient(90deg, #1e293b 0%, #334155 50%, #1e293b 100%)',
        backgroundSize: '1000px 100%',
        animation: 'shimmer 2s infinite',
      }}
    />
  ));

  return count === 1 ? skeletons[0] : <div className={`flex flex-col gap-3 ${className}`}>{skeletons}</div>;
};

export default Skeleton;
