import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Avatar } from '@/components/atoms/Avatar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { messageService } from '@/services/api/messageService';
import { userService } from '@/services/api/userService';
import { formatDistanceToNow } from 'date-fns';

const Messages = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await messageService.getConversations();
      setConversations(data);
    } catch (err) {
      setError('Failed to load conversations');
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setUsersLoading(true);
      const data = await userService.getUsersForChat();
      setUsers(data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleStartNewChat = async () => {
    setShowUserModal(true);
    await loadUsers();
  };

  const handleUserSelect = async (user) => {
    try {
      // Check if conversation already exists
      const existingConversation = conversations.find(conv => 
        conv.participants.some(p => p.Id === user.Id)
      );
      
      if (existingConversation) {
        navigate(`/chat/${user.Id}`);
        setShowUserModal(false);
        return;
      }

      // Create new conversation
      const newConversation = await messageService.createConversation(user.Id);
      setConversations(prev => [newConversation, ...prev]);
      navigate(`/chat/${user.Id}`);
      setShowUserModal(false);
      toast.success(`Started new chat with ${user.name}`);
    } catch (err) {
      toast.error('Failed to start new chat');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadConversations} />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-card">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <Button 
              onClick={handleStartNewChat}
              className="bg-primary text-white hover:bg-primary/90"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              New Chat
            </Button>
          </div>
          
          <div className="relative">
            <ApperIcon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="divide-y divide-gray-200">
          {filteredConversations.length === 0 ? (
            <div className="p-12 text-center">
              <ApperIcon name="MessageCircle" size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
              <p className="text-gray-600 mb-6">Start chatting with someone to see your conversations here.</p>
              <Button 
                onClick={handleStartNewChat}
                className="bg-primary text-white hover:bg-primary/90"
              >
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Start New Chat
              </Button>
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const otherParticipant = conversation.participants.find(p => p.Id !== 1); // Assuming current user ID is 1
              
              return (
                <motion.div
                  key={conversation.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/chat/${otherParticipant.Id}`)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar 
                      src={otherParticipant.avatar} 
                      alt={otherParticipant.name}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {otherParticipant.name}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-gray-600 text-sm truncate">
                          {conversation.lastMessage.content}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* User Selection Modal */}
      <AnimatePresence>
        {showUserModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowUserModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full max-h-96 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Start New Chat</h3>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {usersLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading users...</p>
                  </div>
                ) : users.length === 0 ? (
                  <div className="p-8 text-center">
                    <ApperIcon name="Users" size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No users available</p>
                  </div>
                ) : (
                  users.map((user) => (
                    <motion.div
                      key={user.Id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar src={user.avatar} alt={user.name} size="sm" />
                        <div>
                          <h4 className="font-semibold text-gray-900">{user.name}</h4>
                          <p className="text-sm text-gray-500">@{user.username}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Messages;