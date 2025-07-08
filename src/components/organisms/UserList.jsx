import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserCard from '@/components/molecules/UserCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { userService } from '@/services/api/userService';

const UserList = ({ variant = 'all', userId, className }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      switch (variant) {
        case 'trending':
          data = await userService.getTrendingUsers();
          break;
        case 'followers':
          data = await userService.getFollowers(userId);
          break;
        case 'following':
          data = await userService.getFollowing(userId);
          break;
        default:
          data = await userService.getAll();
      }
      
      setUsers(data);
    } catch (err) {
      setError(err.message || 'Failed to load users');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [variant, userId]);

const handleFollow = async (userIdToFollow) => {
    try {
      const currentUserId = 1; // This would come from auth context
      
      // Check if user is blocked
      const isBlocked = await userService.isBlocked(currentUserId, userIdToFollow);
      if (isBlocked) {
        toast.error('Cannot follow blocked user');
        return;
      }
      
      await userService.followUser(currentUserId, userIdToFollow);
      toast.success('User followed successfully!');
      
      // Update user counts
      setUsers(prev => prev.map(user => 
        user.Id === userIdToFollow 
          ? { ...user, followersCount: user.followersCount + 1 }
          : user
      ));
    } catch (err) {
      console.error('Error following user:', err);
      toast.error('Failed to follow user');
    }
  };

const handleUnfollow = async (userIdToUnfollow) => {
    try {
      const currentUserId = 1; // This would come from auth context
      
      // Check if user is blocked
      const isBlocked = await userService.isBlocked(currentUserId, userIdToUnfollow);
      if (isBlocked) {
        toast.error('Cannot unfollow blocked user');
        return;
      }
      
      await userService.unfollowUser(currentUserId, userIdToUnfollow);
      toast.success('User unfollowed successfully!');
      
      // Update user counts
      setUsers(prev => prev.map(user => 
        user.Id === userIdToUnfollow 
          ? { ...user, followersCount: Math.max(0, user.followersCount - 1) }
          : user
      ));
    } catch (err) {
      console.error('Error unfollowing user:', err);
      toast.error('Failed to unfollow user');
    }
  };

  if (loading) {
    return <Loading variant="users" className={className} />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load users"
        message={error}
        onRetry={loadUsers}
        className={className}
      />
    );
  }

  if (users.length === 0) {
    const emptyConfig = {
      trending: {
        title: "No trending users",
        message: "Check back later for popular users!",
        variant: 'followers'
      },
      followers: {
        title: "No followers yet",
        message: "Share interesting content to attract followers!",
        actionLabel: "Create Post",
        onAction: () => navigate('/create')
      },
      following: {
        title: "Not following anyone",
        message: "Discover and follow interesting users!",
        actionLabel: "Explore Users",
        onAction: () => navigate('/explore')
      }
    };

    const config = emptyConfig[variant] || {
      title: "No users found",
      message: "Try refreshing the page or check back later.",
      variant: 'followers'
    };

    return (
      <Empty
        title={config.title}
        message={config.message}
        actionLabel={config.actionLabel}
        onAction={config.onAction}
        variant={config.variant}
        className={className}
      />
    );
  }

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {users.map((user) => (
        <UserCard
          key={user.Id}
          user={user}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
          isFollowing={false} // This would be determined by checking follow relationship
        />
      ))}
    </div>
  );
};

export default UserList;