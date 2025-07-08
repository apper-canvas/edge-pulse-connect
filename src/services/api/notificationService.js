import { userService } from './userService';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const notificationService = {
  async requestPermission() {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  },

  async sendNotification(userId, notificationData) {
    await delay(100);
    
    try {
      // Get user's notification preferences
      const preferences = await userService.getNotificationPreferences(userId);
      
      // Check if this type of notification is enabled
      const { type } = notificationData;
      if (!preferences[type] || !preferences.pushEnabled) {
        return;
      }

      // Send browser push notification if permission granted
      if (Notification.permission === 'granted') {
        const notification = new Notification(this.getNotificationTitle(type), {
          body: notificationData.message,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: `pulse-connect-${type}-${notificationData.userId || 'system'}`,
          renotify: false,
          silent: false,
          requireInteraction: false
        });

        // Auto-close after 5 seconds
        setTimeout(() => {
          notification.close();
        }, 5000);

        // Handle notification click
        notification.onclick = () => {
          window.focus();
          this.handleNotificationClick(notificationData);
          notification.close();
        };
      }

      // Store notification in local storage for the notifications page
      this.storeNotification(userId, notificationData);
      
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  },

  getNotificationTitle(type) {
    switch (type) {
      case 'like':
        return 'New Like';
      case 'comment':
        return 'New Comment';
      case 'follow':
        return 'New Follower';
      case 'message':
        return 'New Message';
      default:
        return 'Pulse Connect';
    }
  },

  handleNotificationClick(notificationData) {
    const { type, postId, userId } = notificationData;
    
    switch (type) {
      case 'like':
      case 'comment':
        if (postId) {
          window.location.href = `/post/${postId}`;
        }
        break;
      case 'follow':
        if (userId) {
          window.location.href = `/profile/${userId}`;
        }
        break;
      case 'message':
        if (userId) {
          window.location.href = `/chat/${userId}`;
        }
        break;
      default:
        window.location.href = '/notifications';
        break;
    }
  },

  storeNotification(userId, notificationData) {
    try {
      const key = `notifications_${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      
      const newNotification = {
        Id: Date.now(),
        ...notificationData,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      existing.unshift(newNotification);
      
      // Keep only last 50 notifications
      if (existing.length > 50) {
        existing.splice(50);
      }
      
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (error) {
      console.error('Error storing notification:', error);
    }
  },

  async getStoredNotifications(userId) {
    await delay(100);
    try {
      const key = `notifications_${userId}`;
      const notifications = JSON.parse(localStorage.getItem(key) || '[]');
      return notifications;
    } catch (error) {
      console.error('Error retrieving notifications:', error);
      return [];
    }
  },

  async markAsRead(userId, notificationId) {
    await delay(100);
    try {
      const key = `notifications_${userId}`;
      const notifications = JSON.parse(localStorage.getItem(key) || '[]');
      
      const updated = notifications.map(notification => 
        notification.Id === notificationId 
          ? { ...notification, read: true }
          : notification
      );
      
      localStorage.setItem(key, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  },

  async markAllAsRead(userId) {
    await delay(100);
    try {
      const key = `notifications_${userId}`;
      const notifications = JSON.parse(localStorage.getItem(key) || '[]');
      
      const updated = notifications.map(notification => ({
        ...notification,
        read: true
      }));
      
      localStorage.setItem(key, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }
};