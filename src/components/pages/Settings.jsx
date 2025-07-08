import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import PrivacySettingsModal from '@/components/molecules/PrivacySettingsModal';
import { userService } from '@/services/api/userService';
import { notificationService } from '@/services/api/notificationService';
const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    likes: true,
    comments: true,
    follows: true,
    messages: true,
    pushEnabled: false
  });
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  
  const currentUserId = 1; // This would come from auth context in real app
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setLoading(true);
        const userPrefs = await userService.getNotificationPreferences(currentUserId);
        setPreferences(userPrefs);
        
        // Check current permission status
        if ('Notification' in window) {
          setPermissionStatus(Notification.permission);
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
        toast.error('Failed to load notification preferences');
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const handleToggle = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePushToggle = async () => {
    if (!preferences.pushEnabled) {
      // Request permission when enabling push notifications
      try {
        const granted = await notificationService.requestPermission();
        if (granted) {
          setPreferences(prev => ({
            ...prev,
            pushEnabled: true
          }));
          setPermissionStatus('granted');
          toast.success('Push notifications enabled');
        } else {
          toast.error('Push notification permission denied');
        }
      } catch (error) {
        console.error('Error requesting permission:', error);
        toast.error('Failed to enable push notifications');
      }
    } else {
      // Disable push notifications
      setPreferences(prev => ({
        ...prev,
        pushEnabled: false
      }));
      toast.info('Push notifications disabled');
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await userService.updateNotificationPreferences(currentUserId, preferences);
      toast.success('Notification preferences saved');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const notificationTypes = [
    {
      key: 'likes',
      label: 'Likes',
      description: 'When someone likes your posts',
      icon: 'Heart'
    },
    {
      key: 'comments',
      label: 'Comments',
      description: 'When someone comments on your posts',
      icon: 'MessageCircle'
    },
    {
      key: 'follows',
      label: 'Follows',
      description: 'When someone follows you',
      icon: 'UserPlus'
    },
    {
      key: 'messages',
      label: 'Messages',
      description: 'When you receive new messages',
      icon: 'Mail'
    }
  ];

  const getPermissionStatusText = () => {
    switch (permissionStatus) {
      case 'granted':
        return { text: 'Enabled', color: 'text-success' };
      case 'denied':
        return { text: 'Blocked', color: 'text-error' };
      default:
        return { text: 'Not requested', color: 'text-warning' };
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Loading />
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your notification preferences</p>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Notification Preferences
          </h2>
          <p className="text-sm text-gray-600">
            Choose what notifications you want to receive
          </p>
        </div>

        <div className="p-6">
          {/* Push Notifications Toggle */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Bell" size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Push Notifications</h3>
                  <p className="text-sm text-gray-600">
                    Status: <span className={getPermissionStatusText().color}>
                      {getPermissionStatusText().text}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={handlePushToggle}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  preferences.pushEnabled ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                    preferences.pushEnabled ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-gray-500 ml-13">
              Enable browser notifications for real-time updates
            </p>
          </div>

          {/* Notification Types */}
          <div className="space-y-4">
            {notificationTypes.map((type) => (
              <div
                key={type.key}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name={type.icon} size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{type.label}</h3>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(type.key)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                    preferences[type.key] ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                      preferences[type.key] ? 'transform translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full"
            >
              {saving ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <ApperIcon name="Save" size={16} />
                  Save Preferences
                </>
              )}
            </Button>
          </div>
</div>
      </motion.div>

      {/* Privacy Settings Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Privacy & Safety
          </h2>
          <p className="text-sm text-gray-600">
            Control who can see and interact with your content
          </p>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Shield" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Privacy Settings</h3>
                <p className="text-sm text-gray-600">
                  Manage profile visibility, interactions, and blocked users
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPrivacyModal(true)}
              className="whitespace-nowrap"
            >
              <ApperIcon name="Settings" size={16} />
              Configure
            </Button>
          </div>
        </div>
      </motion.div>
      {/* Browser Support Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
      >
        <div className="flex items-start gap-3">
          <ApperIcon name="Info" size={20} className="text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">About Push Notifications</h3>
            <p className="text-sm text-blue-700">
              Push notifications work in modern browsers when this page is open or in the background. 
              Your browser may ask for permission to show notifications.
            </p>
          </div>
</div>
      </motion.div>

      {/* Privacy Settings Modal */}
      <PrivacySettingsModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
    </div>
  );
};

export default Settings;