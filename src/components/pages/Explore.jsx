import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import PostList from '@/components/organisms/PostList';
import UserList from '@/components/organisms/UserList';
import SearchBar from '@/components/molecules/SearchBar';
import { userService } from '@/services/api/userService';
import { postService } from '@/services/api/postService';

const Explore = () => {
  const [activeTab, setActiveTab] = useState('trending');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const tabs = [
    { id: 'trending', label: 'Trending', icon: 'TrendingUp' },
    { id: 'users', label: 'Users', icon: 'Users' },
    { id: 'posts', label: 'Posts', icon: 'FileText' }
  ];

  const handleSearch = async (query) => {
    try {
      setIsSearching(true);
      const results = await userService.searchUsers(query);
      setSearchResults(results);
      return results;
    } catch (error) {
      console.error('Search error:', error);
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  const handleUserSelect = (user) => {
    window.location.href = `/profile/${user.Id}`;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'trending':
        return <PostList variant="trending" />;
      case 'users':
        return <UserList variant="trending" />;
      case 'posts':
        return <PostList variant="all" />;
      default:
        return <PostList variant="trending" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Explore
        </h1>
        <p className="text-gray-600">
          Discover trending content and connect with new people
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-6"
      >
        <SearchBar 
          onSearch={handleSearch}
          onUserSelect={handleUserSelect}
          placeholder="Search users, posts, and hashtags..."
        />
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex items-center gap-2 mb-6 overflow-x-auto"
      >
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <ApperIcon name={tab.icon} size={16} />
            {tab.label}
          </Button>
        ))}
      </motion.div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderContent()}
      </motion.div>
    </div>
  );
};

export default Explore;