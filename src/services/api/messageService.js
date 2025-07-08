import conversationsData from '@/services/mockData/conversations.json';
import { userService } from '@/services/api/userService';

const mockConversations = [...conversationsData];
const mockMessages = {};

// Initialize some sample messages for conversations
mockConversations.forEach(conv => {
  mockMessages[conv.Id] = [
    {
      Id: conv.Id * 100 + 1,
      content: conv.lastMessage.content,
      senderId: conv.lastMessage.senderId,
      timestamp: conv.lastMessage.timestamp,
      isRead: conv.lastMessage.isRead
    }
  ];
});

let nextMessageId = 1000;

const generateMessageId = () => {
  return ++nextMessageId;
};

export const messageService = {
  async getConversations() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockConversations];
  },

  async getMessages(userId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Find conversation with this user
    const conversation = mockConversations.find(conv => 
      conv.participants.some(p => p.Id === userId)
    );
    
    if (!conversation) {
      return [];
    }
    
    return mockMessages[conversation.Id] || [];
  },

  async createConversation(userId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check if conversation already exists
    const existingConversation = mockConversations.find(conv => 
      conv.participants.some(p => p.Id === userId)
    );
    
    if (existingConversation) {
      return existingConversation;
    }
    
    // Get user info
    const otherUser = await userService.getById(userId);
    const currentUser = await userService.getById(1); // Assuming current user ID is 1
    
    const newConversation = {
      Id: mockConversations.length + 1,
      participants: [currentUser, otherUser],
      lastMessage: {
        Id: generateMessageId(),
        content: "Say hello to start the conversation!",
        senderId: 1,
        timestamp: new Date().toISOString(),
        isRead: false
      },
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockConversations.unshift(newConversation);
    mockMessages[newConversation.Id] = [];
    
    return { ...newConversation };
  },

  async sendMessage(userId, content) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Find or create conversation
    let conversation = mockConversations.find(conv => 
      conv.participants.some(p => p.Id === userId)
    );
    
    if (!conversation) {
      conversation = await this.createConversation(userId);
    }
    
    const newMessage = {
      Id: generateMessageId(),
      content,
      senderId: 1, // Assuming current user ID is 1
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    // Add message to conversation
    if (!mockMessages[conversation.Id]) {
      mockMessages[conversation.Id] = [];
    }
    mockMessages[conversation.Id].push(newMessage);
    
    // Update conversation's last message
    conversation.lastMessage = { ...newMessage };
    conversation.updatedAt = new Date().toISOString();
    
    // Move conversation to top
    const index = mockConversations.findIndex(c => c.Id === conversation.Id);
    if (index > 0) {
      mockConversations.splice(index, 1);
      mockConversations.unshift(conversation);
    }
    
    return { ...newMessage };
  },

  async sendAutoReply(userId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
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
    
    const conversation = mockConversations.find(conv => 
      conv.participants.some(p => p.Id === userId)
    );
    
    if (!conversation) return null;
    
    const autoMessage = {
      Id: generateMessageId(),
      content: randomReply,
      senderId: userId,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    mockMessages[conversation.Id].push(autoMessage);
    
    // Update conversation's last message
    conversation.lastMessage = { ...autoMessage };
    conversation.updatedAt = new Date().toISOString();
    conversation.unreadCount = (conversation.unreadCount || 0) + 1;
    
    return { ...autoMessage };
  }
};