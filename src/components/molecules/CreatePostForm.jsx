import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import ApperIcon from '@/components/ApperIcon';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import Textarea from '@/components/atoms/Textarea';
import MediaUploadModal from '@/components/molecules/MediaUploadModal';
import { cn } from '@/utils/cn';
const CreatePostForm = ({ onSubmit, onCancel, className }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

setIsSubmitting(true);
    try {
      const { user } = useSelector((state) => state.user);
      await onSubmit({
        content: content.trim(),
        authorId: user?.userId || 1, // Use actual user ID from Redux
        mediaUrls: selectedMedia.map(file => file.url),
        hashtags: extractHashtags(content)
      });
      setContent('');
      setSelectedMedia([]);
      if (onCancel) onCancel();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const extractHashtags = (text) => {
    const hashtagRegex = /#[a-zA-Z0-9_]+/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map(tag => tag.substring(1).toLowerCase()) : [];
};

  const handleMediaUpload = (files) => {
    setSelectedMedia(files);
    setShowMediaModal(false);
  };

  const handleRemoveMedia = (index) => {
    setSelectedMedia(prev => prev.filter((_, i) => i !== index));
  };

  const characterCount = content.length;
  const maxCharacters = 280;
  const isOverLimit = characterCount > maxCharacters;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('bg-white rounded-xl border border-gray-200 shadow-card p-4', className)}
    >
      <form onSubmit={handleSubmit}>
<div className="flex gap-3">
          <Avatar
            src={useSelector((state) => state.user?.user?.profilePicture) || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
            alt="Your avatar"
            size="md"
            fallback={useSelector((state) => state.user?.user?.firstName?.[0]) || "U"}
          />
          <div className="flex-1">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?"
className="min-h-[120px] resize-none border-none focus:ring-0 p-0 text-lg placeholder:text-gray-500"
            />
            
            {/* Media Preview */}
            {selectedMedia.length > 0 && (
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                {selectedMedia.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      {file.type.startsWith('image/') ? (
                        <img
                          src={file.url}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                          <ApperIcon name="Play" size={20} className="text-white" />
                        </div>
                      )}
                      
                      {/* Remove button */}
                      <button
                        onClick={() => handleRemoveMedia(index)}
                        className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ApperIcon name="X" size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Character count */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  type="button"
                  onClick={() => setShowMediaModal(true)}
                  className={cn(
                    'transition-colors',
                    selectedMedia.length > 0 && 'text-primary'
                  )}
                >
                  <ApperIcon name="Image" size={18} />
                </Button>
                <Button variant="ghost" size="sm" type="button">
                  <ApperIcon name="Smile" size={18} />
                </Button>
                <Button variant="ghost" size="sm" type="button">
                  <ApperIcon name="MapPin" size={18} />
                </Button>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={cn(
                  'text-sm',
                  isOverLimit ? 'text-error' : characterCount > maxCharacters * 0.8 ? 'text-warning' : 'text-gray-500'
                )}>
                  {characterCount}/{maxCharacters}
                </div>
                
                <div className="flex items-center gap-2">
                  {onCancel && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={onCancel}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={!content.trim() || isSubmitting || isOverLimit}
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
          </div>
        </div>
</form>
      
      {/* Media Upload Modal */}
      {showMediaModal && (
        <MediaUploadModal
          onClose={() => setShowMediaModal(false)}
          onUpload={handleMediaUpload}
          existingFiles={selectedMedia}
        />
      )}
    </motion.div>
  );
};

export default CreatePostForm;