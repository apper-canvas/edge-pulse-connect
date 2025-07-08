import commentData from '../mockData/comments.json';
import userData from '../mockData/users.json';

let comments = [...commentData];
let users = [...userData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const commentService = {
  async getByPostId(postId) {
    await delay(250);
    const postComments = comments.filter(c => c.postId === postId);
    return postComments
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .map(comment => {
        const author = users.find(u => u.Id === comment.authorId);
        return {
          ...comment,
          author: author || null
        };
      });
  },

  async create(commentData) {
    await delay(200);
    const newComment = {
      Id: Math.max(...comments.map(c => c.Id)) + 1,
      ...commentData,
      timestamp: new Date().toISOString()
    };
    
    comments.push(newComment);
    
    const author = users.find(u => u.Id === newComment.authorId);
    return {
      ...newComment,
      author: author || null
    };
  },

  async delete(id) {
    await delay(200);
    const index = comments.findIndex(c => c.Id === id);
    if (index !== -1) {
      comments.splice(index, 1);
      return true;
    }
    return false;
  }
};