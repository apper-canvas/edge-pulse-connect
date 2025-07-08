import postData from '../mockData/posts.json';
import userData from '../mockData/users.json';
import followData from '../mockData/follows.json';

let posts = [...postData];
let users = [...userData];
let follows = [...followData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const postService = {
  async getAll() {
    await delay(400);
    return posts
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map(post => {
        const author = users.find(u => u.Id === post.authorId);
        return {
          ...post,
          author: author || null
        };
      });
  },

  async getById(id) {
    await delay(200);
    const post = posts.find(p => p.Id === id);
    if (!post) return null;
    
    const author = users.find(u => u.Id === post.authorId);
    return {
      ...post,
      author: author || null
    };
  },

  async getByUserId(userId) {
    await delay(300);
    const userPosts = posts.filter(p => p.authorId === userId);
    return userPosts
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map(post => {
        const author = users.find(u => u.Id === post.authorId);
        return {
          ...post,
          author: author || null
        };
      });
  },

  async getFeed(userId) {
    await delay(350);
    const userFollows = follows.filter(f => f.followerId === userId);
    const followingIds = userFollows.map(f => f.followingId);
    
    // Include user's own posts and posts from followed users
    const feedPosts = posts.filter(p => 
      followingIds.includes(p.authorId) || p.authorId === userId
    );
    
    return feedPosts
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map(post => {
        const author = users.find(u => u.Id === post.authorId);
        return {
          ...post,
          author: author || null
        };
      });
  },

  async getTrending() {
    await delay(300);
    return posts
      .sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments))
      .slice(0, 10)
      .map(post => {
        const author = users.find(u => u.Id === post.authorId);
        return {
          ...post,
          author: author || null
        };
      });
  },

  async create(postData) {
    await delay(300);
    const newPost = {
      Id: Math.max(...posts.map(p => p.Id)) + 1,
      ...postData,
      likes: 0,
      comments: 0,
      timestamp: new Date().toISOString()
    };
    
    posts.unshift(newPost);
    
    const author = users.find(u => u.Id === newPost.authorId);
    return {
      ...newPost,
      author: author || null
    };
  },

  async like(postId, userId) {
    await delay(200);
    const post = posts.find(p => p.Id === postId);
    if (post) {
      post.likes += 1;
      return post.likes;
    }
    return 0;
  },

  async unlike(postId, userId) {
    await delay(200);
    const post = posts.find(p => p.Id === postId);
    if (post && post.likes > 0) {
      post.likes -= 1;
      return post.likes;
    }
    return 0;
  },

  async searchPosts(query) {
    await delay(250);
    const lowerQuery = query.toLowerCase();
    return posts
      .filter(post => 
        post.content.toLowerCase().includes(lowerQuery) ||
        post.hashtags.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 20)
      .map(post => {
        const author = users.find(u => u.Id === post.authorId);
        return {
          ...post,
          author: author || null
        };
      });
  },

  async delete(id) {
    await delay(200);
    const index = posts.findIndex(p => p.Id === id);
    if (index !== -1) {
      posts.splice(index, 1);
      return true;
    }
    return false;
  }
};