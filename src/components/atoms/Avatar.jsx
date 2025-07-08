import React from 'react';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';

const Avatar = React.forwardRef(({ 
  className, 
  src, 
  alt, 
  size = 'md',
  fallback,
  ...props 
}, ref) => {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
    '2xl': 'h-20 w-20 text-xl'
  };

  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary overflow-hidden',
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <span className="text-white font-medium">
          {fallback || <ApperIcon name="User" size={16} />}
        </span>
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;