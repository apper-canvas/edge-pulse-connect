import React, { useState } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";

const PostCard = ({ post, onLike, onComment, onShare, className }) => {
  const [likes, setLikes] = useState(post.likes || 0);
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [showFullContent, setShowFullContent] = useState(false);
// Image loading component with error handling
  const ImageWithFallback = ({ src, alt, className, fallbackSrc, placeholderClassName }) => {
    const [imageState, setImageState] = useState('loading');
    const [currentSrc, setCurrentSrc] = useState(src);
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 2;

    const handleImageLoad = () => {
      setImageState('loaded');
    };

    const handleImageError = () => {
      if (retryCount < maxRetries) {
        // Retry with cache-busting parameter
        const timestamp = Date.now();
        setCurrentSrc(`${src}?retry=${timestamp}`);
        setRetryCount(prev => prev + 1);
      } else if (fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        setRetryCount(0);
      } else {
        setImageState('error');
      }
    };

    if (imageState === 'loading') {
      return (
        <>
          <div className={placeholderClassName} />
          <img
            src={currentSrc}
            alt={alt}
            className={`${className} opacity-0 absolute`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        </>
      );
    }

    if (imageState === 'error') {
      return (
        <div className={`${className} bg-gray-100 flex items-center justify-center`}>
          <div className="text-center text-gray-500">
            <ApperIcon name="ImageOff" className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Image unavailable</p>
          </div>
        </div>
      );
    }

    return (
      <img
        src={currentSrc}
        alt={alt}
        className={`${className} fade-in`}
        loading="lazy"
      />
    );
  };

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

const handleShare = async () => {
    // Construct the share URL - use current page or post-specific URL
    const shareUrl = `${window.location.origin}${window.location.pathname}`;
    const shareData = {
      title: 'Check out this post on Pulse Connect',
      text: `${post.content?.substring(0, 100)}${post.content?.length > 100 ? '...' : ''}`,
      url: shareUrl
    };

    // Check if Web Share API is available and site is served over HTTPS
    if (navigator.share && window.location.protocol === 'https:') {
      try {
        await navigator.share(shareData);
        toast.success('Post shared successfully!');
        return;
      } catch (error) {
        console.error('Share failed:', error);
        
        // Handle specific error types
        if (error.name === 'AbortError') {
          // User cancelled the share - no need to show error
          return;
        }
        
        if (error.name === 'NotAllowedError') {
          // Permission denied - likely HTTPS issue or user gesture requirement
          console.warn('Share permission denied. Falling back to clipboard copy.');
          toast.info('Share not available. Copying link instead...');
        } else {
          // Other errors (DataError, TypeError, etc.)
          toast.info('Share unavailable. Copying link to clipboard...');
        }
        
        // Fallback to clipboard copy
        await attemptClipboardCopy(shareUrl);
      }
    } else {
      // Web Share API not available or not HTTPS - use clipboard fallback
      await attemptClipboardCopy(shareUrl);
    }
  };

  const attemptClipboardCopy = async (url) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
      } else {
        // Fallback for older browsers or non-secure contexts
        await fallbackCopyToClipboard(url);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Clipboard copy failed:', error);
      toast.error('Unable to copy link. Please copy manually: ' + url);
    }
  };

  const fallbackCopyToClipboard = (text) => {
    return new Promise((resolve, reject) => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (successful) {
          resolve();
        } else {
          reject(new Error('Copy command failed'));
        }
      } catch (err) {
        document.body.removeChild(textArea);
        reject(err);
      }
    });
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
          <div className="rounded-lg overflow-hidden bg-gray-100">
            <ImageWithFallback
              src={post.mediaUrls[0]}
              alt="Post media"
              className="w-full h-auto max-h-96 object-cover"
              fallbackSrc="/api/placeholder/600/400"
              placeholderClassName="w-full h-64 bg-gray-200 shimmer rounded-lg"
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