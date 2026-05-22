import React from 'react';

const PageContainer = ({
  children,
  className = '',
  maxWidth = 'max-w-7xl',
  narrow = false,
}) => {
  const width = narrow ? 'max-w-4xl' : maxWidth;

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${width} ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
