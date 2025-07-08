import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  title = "Something went wrong", 
  message = "We're having trouble loading this content. Please try again.", 
  onRetry,
  variant = 'default',
  className 
}) => {
const variants = {
    default: {
      icon: "AlertCircle",
      iconColor: "text-error",
      bgColor: "bg-error/5",
      borderColor: "border-error/20"
    },
    network: {
      icon: "WifiOff",
      iconColor: "text-warning",
      bgColor: "bg-warning/5",
      borderColor: "border-warning/20"
    },
    image: {
      icon: "ImageOff",
      iconColor: "text-gray-400",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200"
    },
    notFound: {
      icon: "Search",
      iconColor: "text-gray-400",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200"
    },
    server: {
      icon: "Server",
      iconColor: "text-error",
      bgColor: "bg-error/5",
      borderColor: "border-error/20"
    }
  };

  const config = variants[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col items-center justify-center p-8 rounded-xl border',
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <div className={cn('p-3 rounded-full mb-4', config.bgColor)}>
        <ApperIcon 
          name={config.icon} 
          size={32} 
          className={config.iconColor}
        />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {message}
      </p>
      
      <div className="flex items-center gap-3">
        {onRetry && (
          <Button
            variant="primary"
            size="sm"
            onClick={onRetry}
            className="flex items-center gap-2"
          >
            <ApperIcon name="RotateCcw" size={16} />
            Try Again
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.location.reload()}
          className="flex items-center gap-2"
        >
          <ApperIcon name="RefreshCw" size={16} />
          Refresh Page
        </Button>
      </div>
    </motion.div>
  );
};

export default Error;