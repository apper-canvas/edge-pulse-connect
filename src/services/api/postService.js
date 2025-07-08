import { toast } from 'react-toastify';
import { notificationService } from './notificationService';
import { userService } from './userService';

export const postService = {
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
          { field: { Name: "content" } },
          { field: { Name: "media_urls" } },
          { field: { Name: "likes" } },
          { field: { Name: "comments" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "hashtags" } },
          { 
            field: { name: "author_id" },
            referenceField: { field: { Name: "display_name" } }
          }
        ],
        orderBy: [{
          fieldName: "timestamp",
          sorttype: "DESC"
        }]
      };

      const response = await apperClient.fetchRecords('post', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching posts:", error?.response?.data?.message);
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
          { field: { Name: "content" } },
          { field: { Name: "media_urls" } },
          { field: { Name: "likes" } },
          { field: { Name: "comments" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "hashtags" } },
          { 
            field: { name: "author_id" },
            referenceField: { field: { Name: "display_name" } }
          }
        ]
      };

      const response = await apperClient.getRecordById('post', id, params);
      
      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching post with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async getByUserId(userId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "content" } },
          { field: { Name: "media_urls" } },
          { field: { Name: "likes" } },
          { field: { Name: "comments" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "hashtags" } },
          { 
            field: { name: "author_id" },
            referenceField: { field: { Name: "display_name" } }
          }
        ],
        where: [{
          FieldName: "author_id",
          Operator: "EqualTo",
          Values: [userId]
        }],
        orderBy: [{
          fieldName: "timestamp",
          sorttype: "DESC"
        }]
      };

      const response = await apperClient.fetchRecords('post', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching user posts:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getFeed(userId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Get following list first
      const followParams = {
        fields: [{ field: { Name: "following_id" } }],
        where: [{
          FieldName: "follower_id",
          Operator: "EqualTo",
          Values: [userId]
        }]
      };

      const followResponse = await apperClient.fetchRecords('follow', followParams);
      const followingIds = [userId]; // Include own posts
      
      if (followResponse.success && followResponse.data) {
        followResponse.data.forEach(follow => {
          if (follow.following_id) {
            followingIds.push(follow.following_id);
          }
        });
      }

      // Get posts from followed users
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "content" } },
          { field: { Name: "media_urls" } },
          { field: { Name: "likes" } },
          { field: { Name: "comments" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "hashtags" } },
          { 
            field: { name: "author_id" },
            referenceField: { field: { Name: "display_name" } }
          }
        ],
        where: [{
          FieldName: "author_id",
          Operator: "ExactMatch",
          Values: followingIds,
          Include: true
        }],
        orderBy: [{
          fieldName: "timestamp",
          sorttype: "DESC"
        }]
      };

      const response = await apperClient.fetchRecords('post', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching feed:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getTrending() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "content" } },
          { field: { Name: "media_urls" } },
          { field: { Name: "likes" } },
          { field: { Name: "comments" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "hashtags" } },
          { 
            field: { name: "author_id" },
            referenceField: { field: { Name: "display_name" } }
          }
        ],
        orderBy: [{
          fieldName: "likes",
          sorttype: "DESC"
        }],
        pagingInfo: {
          limit: 10,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords('post', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching trending posts:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async create(postData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: postData.content?.substring(0, 50) || 'New Post',
          content: postData.content,
          media_urls: postData.mediaUrls?.join(',') || '',
          likes: 0,
          comments: 0,
          timestamp: new Date().toISOString(),
          hashtags: postData.hashtags?.join(',') || '',
          author_id: postData.authorId
        }]
      };

      const response = await apperClient.createRecord('post', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} posts:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Post created successfully!');
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating post:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      toast.error('Failed to create post');
      return null;
    }
  },

  async like(postId, userId) {
    try {
      // Get current post to increment likes
      const post = await this.getById(postId);
      if (!post) return 0;

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const newLikes = (post.likes || 0) + 1;
      
      const params = {
        records: [{
          Id: postId,
          likes: newLikes
        }]
      };

      const response = await apperClient.updateRecord('post', params);
      
      if (!response.success) {
        console.error(response.message);
        return post.likes || 0;
      }

      // Send notification to post author
      if (post.author_id && post.author_id !== userId) {
        const liker = await userService.getById(userId);
        if (liker) {
          notificationService.sendNotification(post.author_id, {
            type: 'like',
            message: `${liker.display_name} liked your post`,
            userId: userId,
            postId: postId
          });
        }
      }

      return newLikes;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error liking post:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return 0;
    }
  },

  async unlike(postId, userId) {
    try {
      // Get current post to decrement likes
      const post = await this.getById(postId);
      if (!post) return 0;

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const newLikes = Math.max((post.likes || 0) - 1, 0);
      
      const params = {
        records: [{
          Id: postId,
          likes: newLikes
        }]
      };

      const response = await apperClient.updateRecord('post', params);
      
      if (!response.success) {
        console.error(response.message);
        return post.likes || 0;
      }

      return newLikes;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error unliking post:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return 0;
    }
  },

  async searchPosts(query) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "content" } },
          { field: { Name: "media_urls" } },
          { field: { Name: "likes" } },
          { field: { Name: "comments" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "hashtags" } },
          { 
            field: { name: "author_id" },
            referenceField: { field: { Name: "display_name" } }
          }
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [{
                fieldName: "content",
                operator: "Contains",
                values: [query]
              }],
              operator: "OR"
            },
            {
              conditions: [{
                fieldName: "hashtags",
                operator: "Contains",
                values: [query]
              }],
              operator: "OR"
            }
          ]
        }],
        orderBy: [{
          fieldName: "timestamp",
          sorttype: "DESC"
        }],
        pagingInfo: {
          limit: 20,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords('post', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching posts:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('post', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} posts:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
        
        toast.success('Post deleted successfully!');
        return true;
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting post:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      toast.error('Failed to delete post');
      return false;
    }
  }
};