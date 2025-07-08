import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import CreatePostForm from '@/components/molecules/CreatePostForm';
import { postService } from '@/services/api/postService';

const CreatePost = () => {
  const navigate = useNavigate();

  const handleSubmit = async (postData) => {
    try {
      await postService.create(postData);
      toast.success('Post created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ApperIcon name="ArrowLeft" size={20} />
            <span>Back</span>
          </button>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900">
          Create New Post
        </h1>
        <p className="text-gray-600">
          Share your thoughts with the world
        </p>
      </motion.div>

      {/* Create Post Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <CreatePostForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </motion.div>
    </div>
  );
};

export default CreatePost;