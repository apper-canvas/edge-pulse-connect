import React from 'react';
import { cn } from '@/utils/cn';

const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 border border-gray-300',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 bg-transparent',
    accent: 'bg-gradient-to-r from-accent to-pink-500 text-white hover:from-accent/90 hover:to-pink-500/90 shadow-lg hover:shadow-xl',
    success: 'bg-gradient-to-r from-success to-green-500 text-white hover:from-success/90 hover:to-green-500/90 shadow-lg hover:shadow-xl',
    danger: 'bg-gradient-to-r from-error to-red-500 text-white hover:from-error/90 hover:to-red-500/90 shadow-lg hover:shadow-xl'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm font-medium',
    md: 'px-4 py-2 text-sm font-medium',
    lg: 'px-6 py-3 text-base font-semibold',
    xl: 'px-8 py-4 text-lg font-semibold'
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]',
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;