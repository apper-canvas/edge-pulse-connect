import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

const Loading = ({ variant = 'posts', className }) => {
  const renderPostSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-card p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full shimmer" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-32 shimmer" />
          <div className="h-3 bg-gray-200 rounded w-24 shimmer" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full shimmer" />
        <div className="h-4 bg-gray-200 rounded w-3/4 shimmer" />
        <div className="h-4 bg-gray-200 rounded w-1/2 shimmer" />
      </div>
      <div className="h-48 bg-gray-200 rounded-lg shimmer" />
      <div className="flex items-center gap-6 pt-2">
        <div className="h-8 bg-gray-200 rounded w-16 shimmer" />
        <div className="h-8 bg-gray-200 rounded w-16 shimmer" />
        <div className="h-8 bg-gray-200 rounded w-16 shimmer" />
      </div>
    </div>
  );

  const renderUserSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-card p-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full shimmer" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-32 shimmer" />
          <div className="h-3 bg-gray-200 rounded w-24 shimmer" />
          <div className="h-3 bg-gray-200 rounded w-20 shimmer" />
        </div>
        <div className="h-8 bg-gray-200 rounded w-20 shimmer" />
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full shimmer" />
        <div className="h-3 bg-gray-200 rounded w-2/3 shimmer" />
      </div>
    </div>
  );

  const renderProfileSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-card p-6">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 bg-gray-200 rounded-full shimmer" />
        <div className="space-y-3 flex-1">
          <div className="h-6 bg-gray-200 rounded w-48 shimmer" />
          <div className="h-4 bg-gray-200 rounded w-32 shimmer" />
          <div className="flex gap-6">
            <div className="h-4 bg-gray-200 rounded w-24 shimmer" />
            <div className="h-4 bg-gray-200 rounded w-24 shimmer" />
            <div className="h-4 bg-gray-200 rounded w-20 shimmer" />
          </div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-24 shimmer" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full shimmer" />
        <div className="h-4 bg-gray-200 rounded w-3/4 shimmer" />
      </div>
    </div>
  );

  const renderCommentSkeleton = () => (
    <div className="bg-white rounded-lg p-4">
      <div className="flex gap-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full shimmer" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-4 bg-gray-200 rounded w-24 shimmer" />
            <div className="h-3 bg-gray-200 rounded w-16 shimmer" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full shimmer" />
            <div className="h-4 bg-gray-200 rounded w-2/3 shimmer" />
          </div>
          <div className="flex items-center gap-4 mt-3">
            <div className="h-6 bg-gray-200 rounded w-12 shimmer" />
            <div className="h-6 bg-gray-200 rounded w-12 shimmer" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderGridSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="aspect-square bg-gray-200 rounded-lg shimmer" />
      ))}
    </div>
  );

  const skeletonVariants = {
    posts: () => (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            {renderPostSkeleton()}
          </motion.div>
        ))}
      </div>
    ),
    users: () => (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            {renderUserSkeleton()}
          </motion.div>
        ))}
      </div>
    ),
    profile: () => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderProfileSkeleton()}
      </motion.div>
    ),
    comments: () => (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.1 }}
          >
            {renderCommentSkeleton()}
          </motion.div>
        ))}
      </div>
    ),
    grid: () => (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {renderGridSkeleton()}
      </motion.div>
    )
  };

  return (
    <div className={cn('w-full', className)}>
      {skeletonVariants[variant]()}
    </div>
  );
};

export default Loading;