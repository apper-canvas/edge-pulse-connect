import React from 'react';
import { cn } from '@/utils/cn';

const Input = React.forwardRef(({ 
  className, 
  type = 'text', 
  error,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200',
        error && 'border-error focus:ring-error',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;