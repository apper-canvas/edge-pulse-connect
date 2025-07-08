import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Avatar = ({ 
  src, 
  alt = "Avatar", 
  size = "md", 
  className,
  fallback,
  onClick,
  ...props 
}) => {
  const [imageState, setImageState] = useState('loading');
  const [currentSrc, setCurrentSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
    '2xl': 'h-20 w-20 text-xl'
  };

  const iconSizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
    "2xl": "w-10 h-10"
  };

  const handleImageLoad = () => {
    setImageState('loaded');
  };

  const handleImageError = () => {
    if (retryCount < maxRetries && src) {
      const timestamp = Date.now();
      setCurrentSrc(`${src}?retry=${timestamp}`);
      setRetryCount(prev => prev + 1);
    } else {
      setImageState('error');
    }
  };

  const renderContent = () => {
    if (!src || imageState === 'error') {
      return fallback || (
        <ApperIcon 
          name="User" 
          className={cn("text-gray-400", iconSizes[size])} 
        />
      );
    }

    if (imageState === 'loading') {
      return (
        <>
          <div className="w-full h-full bg-gray-200 shimmer rounded-full" />
          <img
            src={currentSrc}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover opacity-0"
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        </>
      );
    }

    return (
      <img
        src={currentSrc}
        alt={alt}
        className="w-full h-full object-cover fade-in"
        loading="lazy"
      />
    );
  };

return (
    <div 
      className={cn(
        "relative inline-flex items-center justify-center rounded-full bg-gray-100 overflow-hidden",
        sizeClasses[size],
        className
      )}
      onClick={onClick}
      {...props}
    >
      {renderContent()}
    </div>
  );
};

export default Avatar;