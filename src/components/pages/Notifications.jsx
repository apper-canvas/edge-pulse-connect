import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Mock notifications data
  const mockNotifications = [
    {
      Id: 1,
      type: 'like',
      message: 'liked your post',
      user: {
        Id: 2,
        displayName: 'Sarah Chen',
        username: 'sarah_chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c9e14a?w=150&h=150&fit=crop&crop=face'
      },
      timestamp: '2024-01-15T10:30:00Z',
      read: false
    },
    {
      Id: 2,
      type: 'comment',
      message: 'commented on your post',
      user: {
        Id: 3,
        displayName: 'Mike Rodriguez',
        username: 'mike_adventures',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      timestamp: '2024-01-15T09:15:00Z',
      read: false
    },
    {
      Id: 3,
      type: 'follow',
      message: 'started following you',
      user: {
        Id: 4,
        displayName: 'Emma Johnson',
        username: 'emma_creates',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      timestamp: '2024-01-14T16:20:00Z',
      read: true
    },
    {
      Id: 4,
      type: 'like',
      message: 'liked your post',
      user: {
        Id: 5,
        displayName: 'Alex Thompson',
        username: 'alex_fitness',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      timestamp: '2024-01-14T14:45:00Z',
      read: true
    }
  ];

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications(mockNotifications);
      setLoading(false);
    };

    loadNotifications();
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return { name: 'Heart', color: 'text-accent' };
      case 'comment':
        return { name: 'MessageCircle', color: 'text-primary' };
      case 'follow':
        return { name: 'UserPlus', color: 'text-secondary' };
      default:
        return { name: 'Bell', color: 'text-gray-500' };
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.Id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'read', label: 'Read' }
  ];

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Loading variant="users" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Notifications
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className="flex items-center gap-2"
          >
            <ApperIcon name="CheckCheck" size={16} />
            Mark all as read
          </Button>
        </div>
        
        <p className="text-gray-600">
          Stay updated with your latest interactions
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex items-center gap-2 mb-6 overflow-x-auto"
      >
        {filters.map((filterOption) => (
          <Button
            key={filterOption.id}
            variant={filter === filterOption.id ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter(filterOption.id)}
            className="whitespace-nowrap"
          >
            {filterOption.label}
          </Button>
        ))}
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {filteredNotifications.length === 0 ? (
          <Empty
            title="No notifications"
            message="You're all caught up! Check back later for updates."
            variant="notifications"
          />
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification, index) => {
              const icon = getNotificationIcon(notification.type);
              
              return (
                <motion.div
                  key={notification.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`bg-white rounded-xl border border-gray-200 shadow-card p-4 cursor-pointer transition-all duration-200 hover:shadow-card-hover ${
                    !notification.read ? 'border-l-4 border-l-primary' : ''
                  }`}
                  onClick={() => markAsRead(notification.Id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar
                        src={notification.user.avatar}
                        alt={notification.user.displayName}
                        size="md"
                        fallback={notification.user.displayName?.[0]}
                      />
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center border-2 border-white ${icon.color}`}>
                        <ApperIcon name={icon.name} size={12} />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900">
                          {notification.user.displayName}
                        </p>
                        <span className="text-gray-500">
                          {notification.message}
                        </span>
                        {!notification.read && (
                          <Badge variant="accent" size="sm">
                            New
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Notifications;