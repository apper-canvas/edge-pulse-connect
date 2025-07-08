import userData from '../mockData/users.json';
import followData from '../mockData/follows.json';

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
      .sort((a, b) => b.followersCount - a.followersCount)
      .slice(0, 5)
      .map(user => ({
        ...user,
        followersCount: follows.filter(f => f.followingId === user.Id).length,
        followingCount: follows.filter(f => f.followerId === user.Id).length
      }));
  },

  async getFollowers(userId) {
    await delay(250);
    const userFollows = follows.filter(f => f.followingId === userId);
    return userFollows.map(follow => {
      const user = users.find(u => u.Id === follow.followerId);
      return {
        ...user,
        followersCount: follows.filter(f => f.followingId === user.Id).length,
        followingCount: follows.filter(f => f.followerId === user.Id).length
      };
    });
  },

  async getFollowing(userId) {
    await delay(250);
    const userFollows = follows.filter(f => f.followerId === userId);
    return userFollows.map(follow => {
      const user = users.find(u => u.Id === follow.followingId);
      return {
        ...user,
        followersCount: follows.filter(f => f.followingId === user.Id).length,
        followingCount: follows.filter(f => f.followerId === user.Id).length
      };
    });
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
  }
};