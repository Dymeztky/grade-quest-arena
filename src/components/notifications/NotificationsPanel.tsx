import { useState } from "react";
import { Bell, X, UserPlus, Trophy, Gift, MessageCircle, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  type: "friend_request" | "achievement" | "reward" | "message" | "system";
  title: string;
  description: string;
  time: string;
  read: boolean;
  actionable?: boolean;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsPanel = ({ isOpen, onClose }: NotificationsPanelProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "friend_request",
      title: "New Friend Request",
      description: "John Doe wants to be your friend",
      time: "2 min ago",
      read: false,
      actionable: true
    },
    {
      id: "2",
      type: "achievement",
      title: "Achievement Unlocked!",
      description: "You've reached Level 25!",
      time: "1 hour ago",
      read: false
    },
    {
      id: "3",
      type: "reward",
      title: "Daily Reward Available",
      description: "Claim your daily login bonus",
      time: "3 hours ago",
      read: false,
      actionable: true
    },
    {
      id: "4",
      type: "message",
      title: "New Message",
      description: "Sarah: Hey, want to study together?",
      time: "5 hours ago",
      read: true
    },
    {
      id: "5",
      type: "system",
      title: "Grade Update",
      description: "Your Mathematics grade has been updated",
      time: "1 day ago",
      read: true
    }
  ]);

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "friend_request": return <UserPlus className="w-5 h-5 text-blue-500" />;
      case "achievement": return <Trophy className="w-5 h-5 text-gold" />;
      case "reward": return <Gift className="w-5 h-5 text-primary" />;
      case "message": return <MessageCircle className="w-5 h-5 text-green-500" />;
      case "system": return <Star className="w-5 h-5 text-purple-500" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed top-16 right-6 w-96 max-h-[calc(100vh-100px)] z-50 animate-fade-in">
        <div className="glass-card overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="font-display text-lg font-bold">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Actions */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-b border-border flex gap-2">
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                <Check className="w-3 h-3 mr-1" />
                Mark all read
              </Button>
              <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs text-destructive">
                Clear all
              </Button>
            </div>
          )}

          {/* Notifications List */}
          <ScrollArea className="max-h-96">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`w-full p-4 text-left hover:bg-secondary/50 transition-colors flex gap-3 ${
                      !notification.read ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-medium truncate ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{notification.description}</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">{notification.time}</p>
                      {notification.actionable && !notification.read && (
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" className="h-7 text-xs">Accept</Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs">Decline</Button>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </>
  );
};
