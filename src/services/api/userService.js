import { toast } from 'react-toastify';

export const userService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "username" } },
          { field: { Name: "display_name" } },
          { field: { Name: "avatar" } },
          { field: { Name: "bio" } },
          { field: { Name: "followers_count" } },
          { field: { Name: "following_count" } },
          { field: { Name: "posts_count" } },
          { field: { Name: "is_private" } }
        ]
      };

      const response = await apperClient.fetchRecords('user_profile', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching users:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "username" } },
          { field: { Name: "display_name" } },
          { field: { Name: "avatar" } },
          { field: { Name: "bio" } },
          { field: { Name: "followers_count" } },
          { field: { Name: "following_count" } },
          { field: { Name: "posts_count" } },
          { field: { Name: "is_private" } }
        ]
      };

      const response = await apperClient.getRecordById('user_profile', id, params);
      
      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching user with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async searchUsers(query) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "username" } },
          { field: { Name: "display_name" } },
          { field: { Name: "avatar" } },
          { field: { Name: "bio" } },
          { field: { Name: "followers_count" } },
          { field: { Name: "following_count" } },
          { field: { Name: "posts_count" } }
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [{
                fieldName: "username",
                operator: "Contains",
                values: [query]
              }],
              operator: "OR"
            },
            {
              conditions: [{
                fieldName: "display_name",
                operator: "Contains",
                values: [query]
              }],
              operator: "OR"
            }
          ]
        }],
        pagingInfo: {
          limit: 10,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords('user_profile', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching users:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getTrendingUsers() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "username" } },
          { field: { Name: "display_name" } },
          { field: { Name: "avatar" } },
          { field: { Name: "bio" } },
          { field: { Name: "followers_count" } },
          { field: { Name: "following_count" } },
          { field: { Name: "posts_count" } }
        ],
        orderBy: [{
          fieldName: "followers_count",
          sorttype: "DESC"
        }],
        pagingInfo: {
          limit: 10,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords('user_profile', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching trending users:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getUsersForChat() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "username" } },
          { field: { Name: "display_name" } },
          { field: { Name: "avatar" } }
        ]
      };

      const response = await apperClient.fetchRecords('user_profile', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching users for chat:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async followUser(followerId, followingId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          follower_id: followerId,
          following_id: followingId,
          timestamp: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('follow', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error following user:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

  async unfollowUser(followerId, followingId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // First find the follow record
      const searchParams = {
        fields: [{ field: { Name: "Name" } }],
        whereGroups: [{
          operator: "AND",
          subGroups: [
            {
              conditions: [{
                fieldName: "follower_id",
                operator: "EqualTo",
                values: [followerId]
              }],
              operator: "AND"
            },
            {
              conditions: [{
                fieldName: "following_id", 
                operator: "EqualTo",
                values: [followingId]
              }],
              operator: "AND"
            }
          ]
        }]
      };

      const searchResponse = await apperClient.fetchRecords('follow', searchParams);
      
      if (!searchResponse.success || !searchResponse.data || searchResponse.data.length === 0) {
        return true; // Already unfollowed
      }

      const followRecord = searchResponse.data[0];
      const deleteParams = {
        RecordIds: [followRecord.Id]
      };

      const response = await apperClient.deleteRecord('follow', deleteParams);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error unfollowing user:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

  async isFollowing(followerId, followingId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [{ field: { Name: "Name" } }],
        whereGroups: [{
          operator: "AND",
          subGroups: [
            {
              conditions: [{
                fieldName: "follower_id",
                operator: "EqualTo",
                values: [followerId]
              }],
              operator: "AND"
            },
            {
              conditions: [{
                fieldName: "following_id",
                operator: "EqualTo", 
                values: [followingId]
              }],
              operator: "AND"
            }
          ]
        }]
      };

      const response = await apperClient.fetchRecords('follow', params);
      
      if (!response.success) {
        return false;
      }

      return response.data && response.data.length > 0;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error checking follow status:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

  async getNotificationPreferences(userId) {
    const saved = localStorage.getItem(`notification_prefs_${userId}`);
    return saved ? JSON.parse(saved) : {
      likes: true,
      comments: true,
      follows: true,
      messages: true,
      pushEnabled: false
    };
  },

  async updateNotificationPreferences(userId, preferences) {
    localStorage.setItem(`notification_prefs_${userId}`, JSON.stringify(preferences));
    return preferences;
  },

  async getPrivacySettings(userId) {
    const saved = localStorage.getItem(`privacy_settings_${userId}`);
    return saved ? JSON.parse(saved) : {
      isPrivateProfile: false,
      allowPostVisibility: 'everyone',
      allowComments: 'everyone',
      allowMessages: 'everyone',
      showInSearch: true,
      showOnlineStatus: true
    };
  },

  async updatePrivacySettings(userId, settings) {
    localStorage.setItem(`privacy_settings_${userId}`, JSON.stringify(settings));
    return settings;
  },

  async blockUser(blockerId, blockedId) {
    const blocked = await this.getBlockedUsers(blockerId);
    
    // Check if already blocked
    const isAlreadyBlocked = blocked.some(user => user.Id === blockedId);
    if (isAlreadyBlocked) return true;

    // Get user to block
    const userToBlock = await this.getById(blockedId);
    if (!userToBlock) throw new Error('User not found');
    
    // Add to blocked list
    blocked.push(userToBlock);
    localStorage.setItem(`blocked_users_${blockerId}`, JSON.stringify(blocked));
    
    // Also unfollow if following
    await this.unfollowUser(blockerId, blockedId);
    await this.unfollowUser(blockedId, blockerId);
    
    return true;
  },

  async unblockUser(blockerId, blockedId) {
    const blocked = await this.getBlockedUsers(blockerId);
    const updatedList = blocked.filter(user => user.Id !== blockedId);
    localStorage.setItem(`blocked_users_${blockerId}`, JSON.stringify(updatedList));
    return true;
  },

  async getBlockedUsers(userId) {
    const saved = localStorage.getItem(`blocked_users_${userId}`);
    return saved ? JSON.parse(saved) : [];
  },

  async isBlocked(userId, targetUserId) {
    const [blockedByUser, blockedByTarget] = await Promise.all([
      this.getBlockedUsers(userId),
      this.getBlockedUsers(targetUserId)
    ]);
    
    return blockedByUser.some(user => user.Id === targetUserId) || 
           blockedByTarget.some(user => user.Id === userId);
  }
};