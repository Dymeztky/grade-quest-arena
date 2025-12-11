import { useState, useEffect, useRef } from "react";
import { Send, Search, Users, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ChatUser {
  id: string;
  display_name: string;
  username: string | null;
  level: number;
  avatar_base: string | null;
  lastMessage?: string;
  lastMessageTime?: Date;
  online?: boolean;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: Date;
  isOwn: boolean;
}

export const GlobalChatPage = () => {
  const { user, profile } = useAuth();
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("user_id, display_name, username, level, avatar_base")
      .neq("user_id", user?.id || "");

    if (!error && data) {
      setUsers(data.map(u => ({
        id: u.user_id,
        display_name: u.display_name || "User",
        username: u.username,
        level: u.level || 1,
        avatar_base: u.avatar_base,
        online: Math.random() > 0.5 // Mock online status
      })));
    }
  };

  const handleSelectUser = (chatUser: ChatUser) => {
    setSelectedUser(chatUser);
    // Mock messages for demo
    setMessages([
      {
        id: "1",
        content: "Hey! How's your studying going?",
        sender_id: chatUser.id,
        created_at: new Date(Date.now() - 3600000),
        isOwn: false
      },
      {
        id: "2",
        content: "Pretty good! Working on math right now.",
        sender_id: user?.id || "",
        created_at: new Date(Date.now() - 3500000),
        isOwn: true
      },
      {
        id: "3",
        content: "Nice! Let me know if you need any help.",
        sender_id: chatUser.id,
        created_at: new Date(Date.now() - 3400000),
        isOwn: false
      }
    ]);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender_id: user?.id || "",
      created_at: new Date(),
      isOwn: true
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Mock response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: "Thanks for the message! 👋",
        sender_id: selectedUser.id,
        created_at: new Date(),
        isOwn: false
      }]);
    }, 1000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredUsers = users.filter(u => 
    u.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Chat</h1>
            <p className="text-muted-foreground">Message other users</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
          {/* Users List */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <ScrollArea className="h-[calc(100%-60px)]">
              {filteredUsers.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No users found</p>
                </div>
              ) : (
                filteredUsers.map((chatUser) => (
                  <button
                    key={chatUser.id}
                    onClick={() => handleSelectUser(chatUser)}
                    className={`w-full p-3 flex items-center gap-3 hover:bg-secondary/50 transition-colors ${
                      selectedUser?.id === chatUser.id ? "bg-secondary" : ""
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/50 text-primary-foreground">
                          {chatUser.display_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {chatUser.online && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-sm">{chatUser.display_name}</p>
                      <p className="text-xs text-muted-foreground">Level {chatUser.level}</p>
                    </div>
                  </button>
                ))
              )}
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 border border-border rounded-lg overflow-hidden flex flex-col">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/50 text-primary-foreground">
                      {selectedUser.display_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedUser.display_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedUser.online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            msg.isOwn
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-secondary rounded-bl-md"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${msg.isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                            {formatTime(msg.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center">
                <div>
                  <MessageCircle className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">Select a user to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
