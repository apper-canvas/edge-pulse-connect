import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { cn } from '@/utils/cn';

const Empty = ({ 
  title = "Nothing here yet", 
  message = "Be the first to share something!", 
  actionLabel,
  onAction,
  variant = 'default',
  className 
}) => {
  const variants = {
    default: {
      icon: 'Smile',
      iconColor: 'text-primary',
      bgGradient: 'from-primary/10 to-secondary/10'
    },
    posts: {
      icon: 'FileText',
      iconColor: 'text-primary',
      bgGradient: 'from-primary/10 to-secondary/10'
    },
    followers: {
      icon: 'Users',
      iconColor: 'text-secondary',
      bgGradient: 'from-secondary/10 to-accent/10'
    },
    search: {
      icon: 'Search',
      iconColor: 'text-gray-400',
      bgGradient: 'from-gray-100 to-gray-50'
    },
    comments: {
      icon: 'MessageCircle',
      iconColor: 'text-accent',
      bgGradient: 'from-accent/10 to-pink-100'
    },
    notifications: {
      icon: 'Bell',
      iconColor: 'text-warning',
      bgGradient: 'from-warning/10 to-yellow-100'
    }
  };

  const config = variants[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col items-center justify-center p-12 rounded-xl bg-gradient-to-br',
        config.bgGradient,
        className
      )}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="p-4 rounded-full bg-white shadow-lg mb-6"
      >
        <ApperIcon 
          name={config.icon} 
          size={48} 
          className={config.iconColor}
        />
      </motion.div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {message}
      </p>
      
      {actionLabel && onAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={onAction}
            className="flex items-center gap-2 pulse-glow"
          >
            <ApperIcon name="Plus" size={20} />
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Empty;