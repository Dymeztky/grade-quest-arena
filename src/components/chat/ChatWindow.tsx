import { useState, useEffect, useRef } from "react";
import { X, Send, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

interface ChatWindowProps {
  friend: {
    id: string;
    name: string;
    level: number;
  };
  onClose: () => void;
}

export const ChatWindow = ({ friend, onClose }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      senderId: friend.id,
      content: "Hey! Ready for the next challenge?",
      timestamp: new Date(Date.now() - 3600000),
      isOwn: false,
    },
    {
      id: "2",
      senderId: "me",
      content: "Absolutely! Let's do it 🔥",
      timestamp: new Date(Date.now() - 3500000),
      isOwn: true,
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: "me",
      content: newMessage,
      timestamp: new Date(),
      isOwn: true,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 h-[450px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/50 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/20 text-primary font-bold">
              {friend.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold text-sm">{friend.name}</h4>
            <span className="text-xs text-muted-foreground">Level {friend.level}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                  message.isOwn
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-secondary text-secondary-foreground rounded-bl-sm"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <span
                  className={`text-[10px] ${
                    message.isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
            <Smile className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 h-9 bg-secondary border-0"
          />
          <Button
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={handleSend}
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};