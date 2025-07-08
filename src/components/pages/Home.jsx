import React from 'react';
import { motion } from 'framer-motion';
import PostList from '@/components/organisms/PostList';
import TrendingSidebar from '@/components/organisms/TrendingSidebar';
import CreatePostForm from '@/components/molecules/CreatePostForm';
import { postService } from '@/services/api/postService';
import { toast } from 'react-toastify';

const Home = () => {
  const handleCreatePost = async (postData) => {
    try {
      await postService.create(postData);
      toast.success('Post created successfully!');
      // The PostList component will automatically refresh
      window.location.reload();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CreatePostForm onSubmit={handleCreatePost} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <PostList variant="feed" userId={1} />
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="sticky top-24"
          >
            <TrendingSidebar />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;