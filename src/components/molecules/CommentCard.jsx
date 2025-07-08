import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import { cn } from '@/utils/cn';
import CommentForm from './CommentForm';

const CommentCard = ({ comment, onLike, onReply, onDelete, replies = [], className }) => {
  const [isLiked, setIsLiked] = React.useState(false);
  const [showReplyForm, setShowReplyForm] = React.useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (onLike) {
      onLike(comment.Id, !isLiked);
    }
  };
const handleReply = () => {
    setShowReplyForm(!showReplyForm);
  };

  const handleReplySubmit = async (content) => {
    if (onReply) {
      await onReply(content, comment.Id);
      setShowReplyForm(false);
    }
  };
  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this comment?')) {
      onDelete(comment.Id);
    }
  };

return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('bg-white rounded-lg p-4', className)}
    >
      <div className="flex gap-3">
        <Link to={`/profile/${comment.author?.Id}`}>
          <Avatar
            src={comment.author?.avatar}
            alt={comment.author?.displayName}
            size="sm"
            fallback={comment.author?.displayName?.[0]}
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link 
              to={`/profile/${comment.author?.Id}`}
              className="font-medium text-gray-900 hover:text-primary transition-colors"
            >
              {comment.author?.displayName}
            </Link>
            <span className="text-sm text-gray-500">
              @{comment.author?.username}
            </span>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
            </span>
          </div>
          <p className="text-gray-900 whitespace-pre-wrap">
            {comment.content}
          </p>
          <div className="flex items-center gap-4 mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                'flex items-center gap-1 hover:text-accent transition-colors',
                isLiked && 'text-accent'
              )}
            >
              <ApperIcon 
                name="Heart" 
                size={14} 
                className={isLiked ? "fill-current" : ""}
              />
              <span className="text-xs">Like</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReply}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <ApperIcon name="MessageCircle" size={14} />
              <span className="text-xs">Reply</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="flex items-center gap-1 hover:text-error transition-colors"
            >
              <ApperIcon name="Trash2" size={14} />
              <span className="text-xs">Delete</span>
            </Button>
          </div>
          
          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-4">
              <CommentForm
                onSubmit={handleReplySubmit}
                placeholder={`Reply to ${comment.author?.displayName}...`}
                className="border-l-2 border-gray-200 pl-4"
              />
            </div>
          )}
          
          {/* Nested Replies */}
          {replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {replies.map((reply) => (
                <div key={reply.Id} className="ml-6 border-l-2 border-gray-100 pl-4">
                  <CommentCard
                    comment={reply}
                    onLike={onLike}
                    onReply={onReply}
                    onDelete={onDelete}
                    className="bg-gray-50"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CommentCard;