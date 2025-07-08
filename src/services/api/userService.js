import userData from "@/services/mockData/users.json";
import followData from "@/services/mockData/follows.json";

let users = [...userData];
let follows = [...followData];
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
  async getAll() {
    await delay(300);
    return users.map(user => ({
      ...user,
      followersCount: follows.filter(f => f.followingId === user.Id).length,
      followingCount: follows.filter(f => f.followerId === user.Id).length
    }));
  },

  async getById(id) {
    await delay(200);
    const user = users.find(u => u.Id === id);
    if (!user) return null;
    
    return {
      ...user,
      followersCount: follows.filter(f => f.followingId === user.Id).length,
      followingCount: follows.filter(f => f.followerId === user.Id).length
    };
  },

  async searchUsers(query) {
    await delay(250);
    const lowerQuery = query.toLowerCase();
    return users
      .filter(user => 
        user.username.toLowerCase().includes(lowerQuery) ||
        user.displayName.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 10)
      .map(user => ({
        ...user,
        followersCount: follows.filter(f => f.followingId === user.Id).length,
        followingCount: follows.filter(f => f.followerId === user.Id).length
      }));
  },

async getTrendingUsers() {
    await delay(300);
    return users
      .sort((a, b) => {
        const aFollowers = follows.filter(f => f.followingId === a.Id).length;
        const bFollowers = follows.filter(f => f.followingId === b.Id).length;
        return bFollowers - aFollowers;
      })
      .slice(0, 10)
      .map(user => ({
        ...user,
        followersCount: follows.filter(f => f.followingId === user.Id).length,
        followingCount: follows.filter(f => f.followerId === user.Id).length
      }));
  },

  async getUsersForChat() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return all users except current user (assuming current user ID is 1)
    return users.filter(user => user.Id !== 1).map(user => ({
      Id: user.Id,
      name: user.name,
      username: user.username,
      avatar: user.avatar
    }));
  },

async getFollowers(userId) {
    await delay(250);
    const userFollows = follows.filter(f => f.followingId === userId);
    return userFollows.map(follow => {
      const user = users.find(u => u.Id === follow.followerId);
      if (!user) return null;
      return {
        ...user,
        followersCount: follows.filter(f => f.followingId === user.Id).length,
        followingCount: follows.filter(f => f.followerId === user.Id).length
      };
    }).filter(Boolean);
  },

async getFollowing(userId) {
    await delay(250);
    const userFollows = follows.filter(f => f.followerId === userId);
    return userFollows.map(follow => {
      const user = users.find(u => u.Id === follow.followingId);
      if (!user) return null;
      return {
        ...user,
        followersCount: follows.filter(f => f.followingId === user.Id).length,
        followingCount: follows.filter(f => f.followerId === user.Id).length
      };
    }).filter(Boolean);
  },

  async followUser(followerId, followingId) {
    await delay(200);
    const existingFollow = follows.find(f => 
      f.followerId === followerId && f.followingId === followingId
    );
    
    if (!existingFollow) {
      follows.push({
        followerId,
        followingId,
        timestamp: new Date().toISOString()
      });
    }
    
    return true;
  },

  async unfollowUser(followerId, followingId) {
    await delay(200);
    follows = follows.filter(f => 
      !(f.followerId === followerId && f.followingId === followingId)
    );
    
    return true;
  },

  async isFollowing(followerId, followingId) {
    await delay(100);
    return follows.some(f => 
f.followerId === followerId && f.followingId === followingId
    );
  },

  async getNotificationPreferences(userId) {
    await delay(100);
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
    await delay(100);
    localStorage.setItem(`notification_prefs_${userId}`, JSON.stringify(preferences));
    return preferences;
  },
  async getPrivacySettings(userId) {
    await delay(100);
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
    await delay(200);
    localStorage.setItem(`privacy_settings_${userId}`, JSON.stringify(settings));
    return settings;
  },

  async blockUser(blockerId, blockedId) {
    await delay(200);
    const blocked = this.getBlockedUsers(blockerId);
    const blockedList = await blocked;
    
    // Check if already blocked
    const isAlreadyBlocked = blockedList.some(user => user.Id === blockedId);
    if (isAlreadyBlocked) return true;
// Get user to block
    const userToBlock = users.find(u => u.Id === blockedId);
    if (!userToBlock) throw new Error('User not found');
    
    // Add to blocked list
    blockedList.push(userToBlock);
    localStorage.setItem(`blocked_users_${blockerId}`, JSON.stringify(blockedList));
    
    // Also unfollow if following
    await this.unfollowUser(blockerId, blockedId);
    await this.unfollowUser(blockedId, blockerId);
    
    return true;
  },

  async unblockUser(blockerId, blockedId) {
    await delay(200);
    const blocked = await this.getBlockedUsers(blockerId);
    const updatedList = blocked.filter(user => user.Id !== blockedId);
    localStorage.setItem(`blocked_users_${blockerId}`, JSON.stringify(updatedList));
    return true;
  },

  async getBlockedUsers(userId) {
    await delay(100);
    const saved = localStorage.getItem(`blocked_users_${userId}`);
    return saved ? JSON.parse(saved) : [];
  },

  async isBlocked(userId, targetUserId) {
    await delay(100);
    const [blockedByUser, blockedByTarget] = await Promise.all([
      this.getBlockedUsers(userId),
      this.getBlockedUsers(targetUserId)
    ]);
    
    return blockedByUser.some(user => user.Id === targetUserId) || 
           blockedByTarget.some(user => user.Id === userId);
  }
};