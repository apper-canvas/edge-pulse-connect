import { toast } from 'react-toastify';
import { userService } from '@/services/api/userService';

export const messageService = {
  async getConversations() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { 
            field: { name: "participant_1_id" },
            referenceField: { field: { Name: "display_name" } }
          },
          { 
            field: { name: "participant_2_id" },
            referenceField: { field: { Name: "display_name" } }
          },
          { field: { Name: "last_message_content" } },
          { field: { Name: "last_message_sender_id" } },
          { field: { Name: "last_message_timestamp" } },
          { field: { Name: "last_message_is_read" } },
          { field: { Name: "unread_count" } },
          { field: { Name: "updated_at" } }
        ],
        orderBy: [{
          fieldName: "updated_at",
          sorttype: "DESC"
        }]
      };

      const response = await apperClient.fetchRecords('conversation', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching conversations:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getMessages(userId) {
    try {
      // Find conversation with this user first
      const conversations = await this.getConversations();
      const conversation = conversations.find(conv => 
        conv.participant_1_id === userId || conv.participant_2_id === userId
      );
      
      if (!conversation) {
        return [];
      }

      // For now, return basic message structure based on conversation data
      // In a full implementation, this would query a separate messages table
      return [{
        Id: 1,
        content: conversation.last_message_content || '',
        senderId: conversation.last_message_sender_id || userId,
        timestamp: conversation.last_message_timestamp || new Date().toISOString(),
        isRead: conversation.last_message_is_read || false
      }];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching messages:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async createConversation(userId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Check if conversation already exists
      const existingConversations = await this.getConversations();
      const existingConversation = existingConversations.find(conv => 
        conv.participant_1_id === userId || conv.participant_2_id === userId
      );
      
      if (existingConversation) {
        return existingConversation;
      }

      const currentUserId = 1; // Assuming current user ID is 1
      const params = {
        records: [{
          Name: `Conversation with ${userId}`,
          participant_1_id: currentUserId,
          participant_2_id: userId,
          last_message_content: "Say hello to start the conversation!",
          last_message_sender_id: currentUserId,
          last_message_timestamp: new Date().toISOString(),
          last_message_is_read: false,
          unread_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('conversation', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const successfulRecords = response.results.filter(result => result.success);
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating conversation:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async sendMessage(userId, content) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Find or create conversation
      let conversation = null;
      const conversations = await this.getConversations();
      conversation = conversations.find(conv => 
        conv.participant_1_id === userId || conv.participant_2_id === userId
      );
      
      if (!conversation) {
        conversation = await this.createConversation(userId);
        if (!conversation) {
          throw new Error('Failed to create conversation');
        }
      }

      const currentUserId = 1; // Assuming current user ID is 1
      
      // Update conversation with new message
      const updateParams = {
        records: [{
          Id: conversation.Id,
          last_message_content: content,
          last_message_sender_id: currentUserId,
          last_message_timestamp: new Date().toISOString(),
          last_message_is_read: false,
          updated_at: new Date().toISOString()
        }]
      };

      const response = await apperClient.updateRecord('conversation', updateParams);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      // Return mock message object
      const newMessage = {
        Id: Date.now(),
        content,
        senderId: currentUserId,
        timestamp: new Date().toISOString(),
        isRead: false
      };

      return newMessage;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error sending message:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      toast.error('Failed to send message');
      return null;
    }
  },

  async sendAutoReply(userId) {
    const autoReplies = [
      "Thanks for your message! I'll get back to you soon.",
      "Hey! How's it going?",
      "Great to hear from you!",
      "I'm currently away but I'll reply as soon as I can.",
      "That sounds interesting! Tell me more.",
      "Thanks for reaching out!",
      "I'm here! What's up?",
      "Nice to chat with you!",
      "Hope you're having a great day!",
      "Looking forward to our conversation!"
    ];
    
    const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
    
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Find conversation
      const conversations = await this.getConversations();
      const conversation = conversations.find(conv => 
        conv.participant_1_id === userId || conv.participant_2_id === userId
      );
      
      if (!conversation) return null;

      // Update conversation with auto reply
      const updateParams = {
        records: [{
          Id: conversation.Id,
          last_message_content: randomReply,
          last_message_sender_id: userId,
          last_message_timestamp: new Date().toISOString(),
          last_message_is_read: false,
          unread_count: (conversation.unread_count || 0) + 1,
          updated_at: new Date().toISOString()
        }]
      };

      const response = await apperClient.updateRecord('conversation', updateParams);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      // Return mock auto message
      const autoMessage = {
        Id: Date.now(),
        content: randomReply,
        senderId: userId,
        timestamp: new Date().toISOString(),
        isRead: false
      };

      return autoMessage;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error sending auto reply:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }
};