import React from 'react';

const ResponsiveContainer = ({ 
  children, 
  className = '',
  maxWidth = '7xl',
  padding = true,
  spacing = 'default' 
}) => {
  const maxWidthClasses = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full'
  };

  const spacingClasses = {
    'none': '',
    'sm': 'px-3 xs:px-4',
    'default': 'px-3 xs:px-4 sm:px-6 lg:px-8',
    'lg': 'px-4 xs:px-6 sm:px-8 lg:px-12',
    'xl': 'px-6 xs:px-8 sm:px-12 lg:px-16'
  };

  const paddingClass = padding ? spacingClasses[spacing] : '';

  return (
    <div className={`${maxWidthClasses[maxWidth]} mx-auto ${paddingClass} ${className}`}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;