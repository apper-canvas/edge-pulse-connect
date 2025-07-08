import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import { cn } from '@/utils/cn';

const UserCard = ({ user, onFollow, onUnfollow, isFollowing: initialFollowing = false, className }) => {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollowToggle = async () => {
    setIsLoading(true);
    try {
      if (isFollowing) {
        await onUnfollow(user.Id);
        setIsFollowing(false);
      } else {
        await onFollow(user.Id);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'bg-white rounded-xl border border-gray-200 shadow-card hover:shadow-card-hover transition-all duration-200 p-4',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Link 
          to={`/profile/${user.Id}`}
          className="flex items-center gap-3 flex-1 hover:opacity-80 transition-opacity"
        >
          <Avatar
            src={user.avatar}
            alt={user.displayName}
            size="lg"
            fallback={user.displayName?.[0]}
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {user.displayName}
            </p>
            <p className="text-sm text-gray-500 truncate">
              @{user.username}
            </p>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-xs text-gray-500">
                {user.followersCount} followers
              </span>
              <span className="text-xs text-gray-500">
                {user.followingCount} following
              </span>
            </div>
          </div>
        </Link>

        <div className="flex flex-col gap-2">
          <Button
            variant={isFollowing ? "outline" : "primary"}
            size="sm"
            onClick={handleFollowToggle}
            disabled={isLoading}
            className="min-w-[80px]"
          >
            {isLoading ? (
              <ApperIcon name="Loader2" size={16} className="animate-spin" />
            ) : (
              isFollowing ? 'Following' : 'Follow'
            )}
          </Button>
        </div>
      </div>

      {user.bio && (
        <p className="text-sm text-gray-600 mt-3 line-clamp-2">
          {user.bio}
        </p>
      )}
    </motion.div>
  );
};

export default UserCard;