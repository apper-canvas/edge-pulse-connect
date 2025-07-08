import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Textarea from '@/components/atoms/Textarea';
import Avatar from '@/components/atoms/Avatar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { messageService } from '@/services/api/messageService';
import { userService } from '@/services/api/userService';
import { formatDistanceToNow } from 'date-fns';

const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (userId) {
      loadChatData();
    }
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load user info and messages
      const [userInfo, chatMessages] = await Promise.all([
        userService.getById(parseInt(userId)),
        messageService.getMessages(parseInt(userId))
      ]);
      
      setOtherUser(userInfo);
      setMessages(chatMessages);
    } catch (err) {
      setError('Failed to load chat');
      toast.error('Failed to load chat');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

const handleSendMessage = async () => {
    if (!messageText.trim() || sending) return;

    // Declare tempMessage outside try-catch for proper scope access
    let tempMessage;

    try {
      setSending(true);
      
      // Optimistic update
      tempMessage = {
        Id: Date.now(), // Temporary ID
        content: messageText,
        senderId: 1, // Assuming current user ID is 1
        timestamp: new Date().toISOString(),
        isRead: false
      };
      
      setMessages(prev => [...prev, tempMessage]);
      setMessageText('');
      
      // Send to server
      const newMessage = await messageService.sendMessage(parseInt(userId), messageText);
      
      // Replace temp message with server response
      setMessages(prev => prev.map(msg => 
        msg.Id === tempMessage.Id ? newMessage : msg
      ));
      
      // Simulate typing indicator and auto-reply
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(async () => {
          setIsTyping(false);
          const autoReply = await messageService.sendAutoReply(parseInt(userId));
          setMessages(prev => [...prev, autoReply]);
        }, 2000);
      }, 1000);
      
    } catch (err) {
      toast.error('Failed to send message');
      // Remove temp message on error - now tempMessage is accessible
      if (tempMessage) {
        setMessages(prev => prev.filter(msg => msg.Id !== tempMessage.Id));
      }
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadChatData} />;
  if (!otherUser) return <Error message="User not found" onRetry={() => navigate('/messages')} />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-card h-[600px] flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 flex items-center space-x-3">
          <Button
            onClick={() => navigate('/messages')}
            variant="ghost"
            size="sm"
            className="mr-2"
          >
            <ApperIcon name="ArrowLeft" size={16} />
          </Button>
          <Avatar src={otherUser.avatar} alt={otherUser.name} size="sm" />
          <div>
            <h2 className="font-semibold text-gray-900">{otherUser.name}</h2>
            <p className="text-sm text-gray-500">@{otherUser.username}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <ApperIcon name="MessageCircle" size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-600">Start the conversation by sending a message!</p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isOwnMessage = message.senderId === 1; // Assuming current user ID is 1
              const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
              
              return (
                <motion.div
                  key={message.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end space-x-2 max-w-xs ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {showAvatar && !isOwnMessage && (
                      <Avatar src={otherUser.avatar} alt={otherUser.name} size="xs" />
                    )}
                    {!showAvatar && !isOwnMessage && (
                      <div className="w-6 h-6" /> // Spacer
                    )}
                    
                    <div className={`px-4 py-2 rounded-2xl ${
                      isOwnMessage 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        isOwnMessage ? 'text-primary-100' : 'text-gray-500'
                      }`}>
                        {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
          
          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center space-x-2"
              >
                <Avatar src={otherUser.avatar} alt={otherUser.name} size="xs" />
                <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <Textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${otherUser.name}...`}
                className="resize-none"
                rows={1}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!messageText.trim() || sending}
              className="bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {sending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <ApperIcon name="Send" size={16} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;