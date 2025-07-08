import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import Textarea from '@/components/atoms/Textarea';
import { cn } from '@/utils/cn';

const CommentForm = ({ onSubmit, placeholder = "Write a comment...", parentId = null, className }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onSubmit={handleSubmit}
      className={cn('bg-white rounded-lg border border-gray-200 p-4', className)}
    >
      <div className="flex gap-3">
        <Avatar
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
          alt="Your avatar"
          size="sm"
          fallback="You"
        />
        <div className="flex-1">
<Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className={cn(
              "resize-none border-none focus:ring-0 p-0 text-sm",
              parentId ? "min-h-[60px]" : "min-h-[80px]"
            )}
          />
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" type="button">
                <ApperIcon name="Image" size={16} />
              </Button>
              <Button variant="ghost" size="sm" type="button">
                <ApperIcon name="Smile" size={16} />
              </Button>
            </div>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!content.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="animate-spin" />
                  Posting...
                </>
              ) : (
                'Post'
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.form>
  );
};

export default CommentForm;