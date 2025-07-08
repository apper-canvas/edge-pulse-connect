import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import { cn } from '@/utils/cn';

const PostCard = ({ post, onLike, onComment, onShare, className }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);
  const [showFullContent, setShowFullContent] = useState(false);

  const handleLike = async () => {
    if (onLike) {
      const newLikes = await onLike(post.Id, !isLiked);
      setLikes(newLikes);
      setIsLiked(!isLiked);
    }
  };

  const handleComment = () => {
    if (onComment) {
      onComment(post.Id);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(post.Id);
    }
  };

  const contentPreview = post.content.length > 200 ? 
    post.content.substring(0, 200) + '...' : 
    post.content;

  const shouldShowReadMore = post.content.length > 200;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'bg-white rounded-xl border border-gray-200 shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center gap-3">
          <Link 
            to={`/profile/${post.author?.Id}`}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Avatar
              src={post.author?.avatar}
              alt={post.author?.displayName}
              size="md"
              fallback={post.author?.displayName?.[0]}
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                {post.author?.displayName}
              </p>
              <p className="text-sm text-gray-500 truncate">
                @{post.author?.username}
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
            </span>
            <Button variant="ghost" size="sm" className="p-1">
              <ApperIcon name="MoreHorizontal" size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <div className="text-gray-900 whitespace-pre-wrap">
          {showFullContent ? post.content : contentPreview}
          {shouldShowReadMore && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="text-primary hover:text-primary/80 font-medium ml-2"
            >
              {showFullContent ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.hashtags.map((tag, index) => (
              <Badge key={index} variant="outline" size="sm">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Media */}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="px-4 pb-3">
          <div className="rounded-lg overflow-hidden">
            <img
              src={post.mediaUrls[0]}
              alt="Post media"
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                'flex items-center gap-2 hover:text-accent transition-colors',
                isLiked && 'text-accent'
              )}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ApperIcon 
                  name={isLiked ? "Heart" : "Heart"} 
                  size={18} 
                  className={isLiked ? "fill-current" : ""}
                />
              </motion.div>
              <span className="text-sm font-medium">{likes}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleComment}
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <ApperIcon name="MessageCircle" size={18} />
              <span className="text-sm font-medium">{post.comments || 0}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2 hover:text-secondary transition-colors"
            >
              <ApperIcon name="Share" size={18} />
            </Button>
          </div>

          <Button variant="ghost" size="sm" className="hover:text-warning">
            <ApperIcon name="Bookmark" size={18} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;