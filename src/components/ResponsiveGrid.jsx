import React from 'react';

const ResponsiveGrid = ({ 
  children, 
  className = '',
  cols = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 4
  },
  gap = 'md',
  autoFit = false,
  minItemWidth = '280px'
}) => {
  const gapClasses = {
    'sm': 'gap-3 xs:gap-4',
    'md': 'gap-4 sm:gap-5 md:gap-6',
    'lg': 'gap-6 sm:gap-8 md:gap-10',
    'xl': 'gap-8 sm:gap-10 md:gap-12'
  };

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  };

  let gridClasses = `grid ${gapClasses[gap]}`;

  if (autoFit) {
    // Use CSS Grid auto-fit for responsive behavior
    return (
      <div 
        className={`grid ${gapClasses[gap]} ${className}`}
        style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`
        }}
      >
        {children}
      </div>
    );
  }

  // Build responsive grid classes
  if (cols.xs) gridClasses += ` ${gridCols[cols.xs]}`;
  if (cols.sm) gridClasses += ` sm:${gridCols[cols.sm]}`;
  if (cols.md) gridClasses += ` md:${gridCols[cols.md]}`;
  if (cols.lg) gridClasses += ` lg:${gridCols[cols.lg]}`;
  if (cols.xl) gridClasses += ` xl:${gridCols[cols.xl]}`;
  if (cols['2xl']) gridClasses += ` 2xl:${gridCols[cols['2xl']]}`;

  return (
    <div className={`${gridClasses} ${className}`}>
      {children}
    </div>
  );
};

export default ResponsiveGrid;