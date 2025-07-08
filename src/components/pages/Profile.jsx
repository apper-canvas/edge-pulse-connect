import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import PostList from '@/components/organisms/PostList';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { userService } from '@/services/api/userService';

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userData = await userService.getById(parseInt(id));
      if (!userData) {
        setError('User not found');
        return;
      }
      
      setUser(userData);
      
      // Check if current user is following this user
      const following = await userService.isFollowing(1, parseInt(id));
      setIsFollowing(following);
    } catch (err) {
      setError(err.message || 'Failed to load user profile');
      console.error('Error loading user:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadUser();
    }
  }, [id]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await userService.unfollowUser(1, parseInt(id));
        setIsFollowing(false);
        setUser(prev => ({ ...prev, followersCount: prev.followersCount - 1 }));
        toast.success('User unfollowed successfully!');
      } else {
        await userService.followUser(1, parseInt(id));
        setIsFollowing(true);
        setUser(prev => ({ ...prev, followersCount: prev.followersCount + 1 }));
        toast.success('User followed successfully!');
      }
    } catch (err) {
      console.error('Error toggling follow:', err);
      toast.error('Failed to update follow status');
    }
  };

  const isOwnProfile = parseInt(id) === 1; // Current user ID

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Loading variant="profile" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Error
          title="Profile not found"
          message={error}
          onRetry={loadUser}
        />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'posts', label: 'Posts', icon: 'FileText' },
    { id: 'followers', label: 'Followers', icon: 'Users' },
    { id: 'following', label: 'Following', icon: 'UserPlus' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return <PostList variant="user" userId={parseInt(id)} />;
      case 'followers':
        return (
          <div className="bg-white rounded-xl border border-gray-200 shadow-card p-6 text-center">
            <ApperIcon name="Users" size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Followers feature coming soon!
            </h3>
            <p className="text-gray-500">
              We're working on bringing you detailed follower lists.
            </p>
          </div>
        );
      case 'following':
        return (
          <div className="bg-white rounded-xl border border-gray-200 shadow-card p-6 text-center">
            <ApperIcon name="UserPlus" size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Following feature coming soon!
            </h3>
            <p className="text-gray-500">
              We're working on bringing you detailed following lists.
            </p>
          </div>
        );
      default:
        return <PostList variant="user" userId={parseInt(id)} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl border border-gray-200 shadow-card p-6 mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <Avatar
            src={user.avatar}
            alt={user.displayName}
            size="2xl"
            fallback={user.displayName?.[0]}
            className="mx-auto md:mx-0"
          />
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {user.displayName}
            </h1>
            <p className="text-gray-500 mb-4">
              @{user.username}
            </p>
            
            {user.bio && (
              <p className="text-gray-700 mb-4 max-w-md">
                {user.bio}
              </p>
            )}
            
            <div className="flex items-center justify-center md:justify-start gap-6 mb-4">
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">
                  {user.postsCount || 0}
                </p>
                <p className="text-sm text-gray-500">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">
                  {user.followersCount || 0}
                </p>
                <p className="text-sm text-gray-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">
                  {user.followingCount || 0}
                </p>
                <p className="text-sm text-gray-500">Following</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            {!isOwnProfile && (
              <Button
                variant={isFollowing ? "outline" : "primary"}
                onClick={handleFollow}
                className="min-w-[120px]"
              >
                {isFollowing ? (
                  <>
                    <ApperIcon name="UserMinus" size={16} />
                    Following
                  </>
                ) : (
                  <>
                    <ApperIcon name="UserPlus" size={16} />
                    Follow
                  </>
                )}
              </Button>
            )}
            
            <Button variant="ghost" size="sm">
              <ApperIcon name="MoreHorizontal" size={16} />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
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

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderTabContent()}
      </motion.div>
    </div>
  );
};

export default Profile;