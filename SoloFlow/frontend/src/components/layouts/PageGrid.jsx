import React from 'react';

const PageGrid = ({
  children,
  cols = 3,
  gap = 'gap-6',
  className = '',
  responsive = true,
}) => {
  const colsClass = responsive
    ? `grid-cols-1 sm:grid-cols-2 ${cols >= 3 ? 'md:grid-cols-3' : ''} ${cols >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`
    : `grid-cols-${cols}`;

  return (
    <div className={`grid ${colsClass} ${gap} ${className}`}>
      {children}
    </div>
  );
};

export default PageGrid;
