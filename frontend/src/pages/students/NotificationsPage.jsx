// src/pages/students/NotificationsPage.jsx
import React, { useEffect, useState } from "react";
import { api } from "../../api";

function NotificationCard({ notification, onMarkRead }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getIcon = (type) => {
    switch (type) {
      case 'transcript_ready':
        return '📜';
      case 'grade_published':
        return '📊';
      default:
        return '📢';
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'transcript_ready':
        return 'border-l-blue-500';
      case 'grade_published':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg border ${getBorderColor(notification.type)} border-l-4 p-4 shadow-sm hover:shadow-md transition-shadow ${
        !notification.is_read ? 'bg-blue-50' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="text-2xl">{getIcon(notification.type)}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900">{notification.title}</h3>
              {!notification.is_read && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  New
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm whitespace-pre-line">{notification.message}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-500">
                {formatDate(notification.created_at)}
              </span>
              {notification.unit && (
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {notification.unit.code}
                </span>
              )}
            </div>
          </div>
        </div>
        {!notification.is_read && (
          <button
            onClick={() => onMarkRead(notification.id)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-4"
          >
            Mark as read
          </button>
        )}
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications');
      setNotifications(response.notifications || []);
    } catch (err) {
      setError("Failed to load notifications");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, is_read: true }
            : notif
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/all/read');
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      );
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.is_read;
    if (filter === 'read') return notif.is_read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-gray-200 h-8 w-64 rounded"></div>
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="animate-pulse bg-gray-200 h-24 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'all', label: 'All', count: notifications.length },
          { key: 'unread', label: 'Unread', count: unreadCount },
          { key: 'read', label: 'Read', count: notifications.length - unreadCount }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📬</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'unread' ? 'No unread notifications' : 
               filter === 'read' ? 'No read notifications' : 'No notifications'}
            </h3>
            <p className="text-gray-600">
              {filter === 'all' ? "You'll receive notifications here when lecturers publish grades or when transcripts are ready." :
               filter === 'unread' ? "All your notifications have been read." :
               "You haven't read any notifications yet."}
            </p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkRead={markAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
}