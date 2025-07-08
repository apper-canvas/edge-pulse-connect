import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import Textarea from '@/components/atoms/Textarea';
import MediaUploadModal from '@/components/molecules/MediaUploadModal';
import { cn } from '@/utils/cn';

const CommentForm = ({ onSubmit, placeholder = "Write a comment...", parentId = null, className }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [attachedMedia, setAttachedMedia] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const commonEmojis = [
    '😊', '😂', '🥰', '😍', '🤗', '👍', '👎', '❤️', '🔥', '💯',
    '😮', '😢', '😭', '😡', '🤔', '👌', '🙏', '🎉', '🎊', '✨'
  ];

  const handleImageUpload = () => {
    setShowMediaModal(true);
  };

  const handleMediaUpload = (files) => {
    setAttachedMedia(files);
    setShowMediaModal(false);
  };

  const handleEmojiSelect = (emoji) => {
    setContent(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleEmojiToggle = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const removeMediaFile = (index) => {
    setAttachedMedia(prev => prev.filter((_, i) => i !== index));
  };
const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!content.trim() && attachedMedia.length === 0) || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        content: content.trim(),
        media: attachedMedia
      });
      setContent('');
      setAttachedMedia([]);
      setShowEmojiPicker(false);
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
          
          {/* Media Preview */}
          {attachedMedia.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {attachedMedia.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={file.url}
                        alt={`Attachment ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <ApperIcon name="Play" size={24} className="text-white" />
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMediaFile(index)}
                      className="absolute top-1 right-1 bg-black bg-opacity-50 text-white hover:bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ApperIcon name="X" size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2 relative">
              <Button 
                variant="ghost" 
                size="sm" 
                type="button"
                onClick={handleImageUpload}
                className="hover:bg-gray-100"
              >
                <ApperIcon name="Image" size={16} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                type="button"
                onClick={handleEmojiToggle}
                className="hover:bg-gray-100"
              >
                <ApperIcon name="Smile" size={16} />
              </Button>
              
              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50">
                  <div className="grid grid-cols-5 gap-1 w-48">
                    {commonEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleEmojiSelect(emoji)}
                        className="w-8 h-8 text-lg hover:bg-gray-100 rounded flex items-center justify-center"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={(!content.trim() && attachedMedia.length === 0) || isSubmitting}
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
      
      {/* Media Upload Modal */}
      {showMediaModal && (
        <MediaUploadModal
          onClose={() => setShowMediaModal(false)}
          onUpload={handleMediaUpload}
          existingFiles={attachedMedia}
        />
      )}
    </motion.form>
  );
};

export default CommentForm;