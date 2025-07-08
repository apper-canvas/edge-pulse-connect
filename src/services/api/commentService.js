import { toast } from 'react-toastify';
import { notificationService } from './notificationService';
import { userService } from './userService';

export const commentService = {
  async getByPostId(postId) {
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
          { field: { Name: "timestamp" } },
          { field: { Name: "post_id" } },
          { field: { Name: "parent_id" } },
          { 
            field: { name: "author_id" },
            referenceField: { field: { Name: "display_name" } }
          }
        ],
        where: [{
          FieldName: "post_id",
          Operator: "EqualTo",
          Values: [postId]
        }],
        orderBy: [{
          fieldName: "timestamp",
          sorttype: "ASC"
        }]
      };

      const response = await apperClient.fetchRecords('app_Comment', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching comments:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async create(commentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: commentData.content?.substring(0, 50) || 'New Comment',
          content: commentData.content,
          timestamp: new Date().toISOString(),
          post_id: commentData.postId,
          author_id: commentData.authorId,
          parent_id: commentData.parentId || null
        }]
      };

      const response = await apperClient.createRecord('app_Comment', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} comments:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const newComment = successfulRecords[0].data;
          
          // Send notification to post author (if different from commenter)
          if (commentData.authorId !== commentData.postAuthorId) {
            const author = await userService.getById(commentData.authorId);
            if (author) {
              notificationService.sendNotification(commentData.postAuthorId, {
                type: 'comment',
                message: `${author.display_name} commented on your post`,
                userId: commentData.authorId,
                postId: commentData.postId
              });
            }
          }
          
          toast.success('Comment added successfully!');
          return newComment;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating comment:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      toast.error('Failed to add comment');
      return null;
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

      const response = await apperClient.deleteRecord('app_Comment', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} comments:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
        
        toast.success('Comment deleted successfully!');
        return true;
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting comment:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      toast.error('Failed to delete comment');
      return false;
    }
  }
};