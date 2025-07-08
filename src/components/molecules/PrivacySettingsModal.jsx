import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { userService } from '@/services/api/userService';

const PrivacySettingsModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    isPrivateProfile: false,
    allowPostVisibility: 'everyone', // everyone, followers, nobody
    allowComments: 'everyone', // everyone, followers, nobody
    allowMessages: 'everyone', // everyone, followers, nobody
    showInSearch: true,
    showOnlineStatus: true
  });
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [blockUserQuery, setBlockUserQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const currentUserId = 1;

  useEffect(() => {
    if (isOpen) {
      loadPrivacySettings();
      loadBlockedUsers();
    }
  }, [isOpen]);

  const loadPrivacySettings = async () => {
    try {
      setLoading(true);
      const settings = await userService.getPrivacySettings(currentUserId);
      setPrivacySettings(settings);
    } catch (error) {
      console.error('Error loading privacy settings:', error);
      toast.error('Failed to load privacy settings');
    } finally {
      setLoading(false);
    }
  };

  const loadBlockedUsers = async () => {
    try {
      const blocked = await userService.getBlockedUsers(currentUserId);
      setBlockedUsers(blocked);
    } catch (error) {
      console.error('Error loading blocked users:', error);
    }
  };

  const handleSettingChange = (key, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleToggle = (key) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const results = await userService.searchUsers(query);
      // Filter out current user and already blocked users
      const filteredResults = results.filter(user => 
        user.Id !== currentUserId && 
        !blockedUsers.some(blocked => blocked.Id === user.Id)
      );
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    } finally {
      setSearching(false);
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      await userService.blockUser(currentUserId, userId);
      toast.success('User blocked successfully');
      loadBlockedUsers();
      setBlockUserQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error blocking user:', error);
      toast.error('Failed to block user');
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      await userService.unblockUser(currentUserId, userId);
      toast.success('User unblocked successfully');
      loadBlockedUsers();
    } catch (error) {
      console.error('Error unblocking user:', error);
      toast.error('Failed to unblock user');
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await userService.updatePrivacySettings(currentUserId, privacySettings);
      toast.success('Privacy settings saved successfully');
      onClose();
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      toast.error('Failed to save privacy settings');
    } finally {
      setSaving(false);
    }
  };

  const privacyOptions = [
    { value: 'everyone', label: 'Everyone' },
    { value: 'followers', label: 'Followers only' },
    { value: 'nobody', label: 'Nobody' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Privacy Settings</h2>
            <p className="text-sm text-gray-600 mt-1">Control who can see and interact with your content</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <ApperIcon name="Loader2" size={24} className="animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Profile Privacy */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Profile Privacy</h3>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <ApperIcon name="Lock" size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Private Profile</h4>
                      <p className="text-sm text-gray-600">Only followers can see your posts and profile details</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('isPrivateProfile')}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      privacySettings.isPrivateProfile ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                        privacySettings.isPrivateProfile ? 'transform translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Search" size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Show in Search</h4>
                      <p className="text-sm text-gray-600">Allow others to find your profile in search results</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('showInSearch')}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      privacySettings.showInSearch ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                        privacySettings.showInSearch ? 'transform translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Circle" size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Show Online Status</h4>
                      <p className="text-sm text-gray-600">Let others see when you're online</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('showOnlineStatus')}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      privacySettings.showOnlineStatus ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                        privacySettings.showOnlineStatus ? 'transform translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Interaction Controls */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Interaction Controls</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <ApperIcon name="FileText" size={20} className="text-gray-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">Post Visibility</h4>
                        <p className="text-sm text-gray-600">Who can see your posts</p>
                      </div>
                    </div>
                    <select
                      value={privacySettings.allowPostVisibility}
                      onChange={(e) => handleSettingChange('allowPostVisibility', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {privacyOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <ApperIcon name="MessageCircle" size={20} className="text-gray-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">Comments</h4>
                        <p className="text-sm text-gray-600">Who can comment on your posts</p>
                      </div>
                    </div>
                    <select
                      value={privacySettings.allowComments}
                      onChange={(e) => handleSettingChange('allowComments', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {privacyOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <ApperIcon name="Mail" size={20} className="text-gray-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">Messages</h4>
                        <p className="text-sm text-gray-600">Who can send you messages</p>
                      </div>
                    </div>
                    <select
                      value={privacySettings.allowMessages}
                      onChange={(e) => handleSettingChange('allowMessages', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {privacyOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Blocked Users */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Blocked Users</h3>
                
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        placeholder="Search users to block..."
                        value={blockUserQuery}
                        onChange={(e) => {
                          setBlockUserQuery(e.target.value);
                          searchUsers(e.target.value);
                        }}
                        className="w-full"
                      />
                    </div>
                    {searching && (
                      <div className="flex items-center px-3">
                        <ApperIcon name="Loader2" size={16} className="animate-spin text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Search Results */}
                  {searchResults.length > 0 && (
                    <div className="border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                      {searchResults.map(user => (
                        <div key={user.Id} className="flex items-center justify-between p-3 hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar}
                              alt={user.displayName}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <p className="font-medium text-sm text-gray-900">{user.displayName}</p>
                              <p className="text-xs text-gray-500">@{user.username}</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBlockUser(user.Id)}
                            className="text-red-600 hover:text-red-700 border-red-200"
                          >
                            Block
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Currently Blocked Users */}
                  {blockedUsers.length > 0 ? (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-700">Currently Blocked</h4>
                      <div className="border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                        {blockedUsers.map(user => (
                          <div key={user.Id} className="flex items-center justify-between p-3 hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <img
                                src={user.avatar}
                                alt={user.displayName}
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <p className="font-medium text-sm text-gray-900">{user.displayName}</p>
                                <p className="text-xs text-gray-500">@{user.username}</p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnblockUser(user.Id)}
                              className="text-green-600 hover:text-green-700 border-green-200"
                            >
                              Unblock
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <ApperIcon name="Shield" size={48} className="mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No blocked users</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || loading}
          >
            {saving ? (
              <>
                <ApperIcon name="Loader2" size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <ApperIcon name="Save" size={16} />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacySettingsModal;