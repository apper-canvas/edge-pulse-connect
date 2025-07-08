import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import { userService } from '@/services/api/userService';
import { postService } from '@/services/api/postService';

const TrendingSidebar = ({ className }) => {
  const [trendingUsers, setTrendingUsers] = useState([]);
  const [trendingHashtags, setTrendingHashtags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrendingData = async () => {
      try {
        setLoading(true);
        const [users, posts] = await Promise.all([
          userService.getTrendingUsers(),
          postService.getTrending()
        ]);
        
        setTrendingUsers(users.slice(0, 3));
        
        // Extract trending hashtags from posts
        const hashtags = posts.flatMap(post => post.hashtags || []);
        const hashtagCounts = hashtags.reduce((acc, tag) => {
          acc[tag] = (acc[tag] || 0) + 1;
          return acc;
        }, {});
        
        const sortedHashtags = Object.entries(hashtagCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([tag, count]) => ({ tag, count }));
        
        setTrendingHashtags(sortedHashtags);
      } catch (error) {
        console.error('Error loading trending data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrendingData();
  }, []);

  if (loading) {
    return (
      <div className={`space-y-6 ${className || ''}`}>
        <div className="bg-white rounded-xl border border-gray-200 shadow-card p-4">
          <div className="h-4 bg-gray-200 rounded w-32 mb-4 shimmer" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full shimmer" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-24 shimmer" />
                  <div className="h-3 bg-gray-200 rounded w-16 shimmer" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Trending Users */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl border border-gray-200 shadow-card p-4"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <ApperIcon name="TrendingUp" size={20} className="text-primary" />
          Who to follow
        </h3>
        
        <div className="space-y-3">
          {trendingUsers.map((user, index) => (
            <motion.div
              key={user.Id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <Link to={`/profile/${user.Id}`}>
                <Avatar
                  src={user.avatar}
                  alt={user.displayName}
                  size="sm"
                  fallback={user.displayName?.[0]}
                />
              </Link>
              
              <div className="flex-1 min-w-0">
                <Link 
                  to={`/profile/${user.Id}`}
                  className="block font-medium text-gray-900 truncate hover:text-primary transition-colors"
                >
                  {user.displayName}
                </Link>
                <p className="text-sm text-gray-500 truncate">
                  {user.followersCount} followers
                </p>
              </div>
              
              <Button variant="outline" size="sm">
                Follow
              </Button>
            </motion.div>
          ))}
        </div>
        
        <Link to="/explore">
          <Button variant="ghost" size="sm" className="w-full mt-4">
            Show more
          </Button>
        </Link>
      </motion.div>

      {/* Trending Hashtags */}
      {trendingHashtags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-200 shadow-card p-4"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ApperIcon name="Hash" size={20} className="text-secondary" />
            Trending
          </h3>
          
          <div className="space-y-3">
            {trendingHashtags.map((hashtag, index) => (
              <motion.div
                key={hashtag.tag}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    #{hashtag.tag}
                  </p>
                  <p className="text-sm text-gray-500">
                    {hashtag.count} posts
                  </p>
                </div>
                
                <Badge variant="secondary" size="sm">
                  {index + 1}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-4"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-3">
          Quick Actions
        </h3>
        
        <div className="space-y-2">
          <Link to="/create">
            <Button variant="primary" size="sm" className="w-full">
              <ApperIcon name="Plus" size={16} />
              Create Post
            </Button>
          </Link>
          
          <Link to="/explore">
            <Button variant="outline" size="sm" className="w-full">
              <ApperIcon name="Compass" size={16} />
              Explore
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default TrendingSidebar;