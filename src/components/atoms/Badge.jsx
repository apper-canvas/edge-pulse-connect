import React from 'react';
import { cn } from '@/utils/cn';

const Badge = React.forwardRef(({ 
  className, 
  variant = 'default', 
  size = 'md',
  children,
  ...props 
}, ref) => {
  const variants = {
    default: 'bg-gradient-to-r from-primary to-secondary text-white',
    secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700',
    success: 'bg-gradient-to-r from-success to-green-500 text-white',
    warning: 'bg-gradient-to-r from-warning to-yellow-500 text-white',
    error: 'bg-gradient-to-r from-error to-red-500 text-white',
    accent: 'bg-gradient-to-r from-accent to-pink-500 text-white',
    outline: 'border border-gray-300 text-gray-700 bg-white'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-sm'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium transition-all duration-200',
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;