
"use client";

import { useState } from 'react';
import type { ChatMessage } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageCircle, Bot, User, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { formatDistanceToNow } from 'date-fns';
import { askSpiritualChatbot } from '@/ai/flows/spiritual-chat-flow'; // Import the Genkit flow

// Placeholder for quick replies
const quickReplies = [
  "Tell me a comforting bible verse.",
  "How can I pray effectively?",
  "What does the Bible say about hope?",
];

export default function ChatPage() {
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoadingResponse(true);

    const botMessageId = `msg-${Date.now() + 1}`;
    setMessages((prev) => [
      ...prev,
      {
        id: botMessageId,
        text: '',
        sender: 'bot',
        timestamp: new Date().toISOString(),
        status: 'loading',
      },
    ]);

    try {
      const response = await askSpiritualChatbot({ message: messageText });
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? { ...msg, text: response.response, status: undefined }
            : msg
        )
      );
    } catch (error) {
      console.error("Error getting bot response:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? { ...msg, text: "Sorry, I encountered an error. Please try again.", status: 'error' }
            : msg
        )
      );
    } finally {
      setIsLoadingResponse(false);
    }
  };

  const getSenderAvatar = (sender: 'user' | 'bot') => {
    if (sender === 'user') {
      return {
        src: currentUser?.profilePictureUrl,
        fallback: currentUser?.displayName?.charAt(0).toUpperCase() || 'U',
        alt: currentUser?.displayName || 'User',
        dataAiHint: 'profile person'
      };
    }
    return {
      src: undefined, // Or a specific bot avatar URL
      fallback: <Bot className="h-5 w-5"/>,
      alt: 'KaddaBot',
      dataAiHint: 'bot avatar'
    };
  };

  return (
    <div className="container mx-auto max-w-2xl py-0 md:py-6 h-[calc(100vh-var(--header-height,0px)-var(--bottom-nav-height,0px))] md:h-auto">
      <Card className="flex flex-col h-full shadow-xl rounded-xl">
        <CardHeader className="text-center border-b">
          <MessageCircle className="mx-auto h-10 w-10 text-primary mb-2" />
          <CardTitle className="text-2xl font-headline">Spiritual Guidance Chat</CardTitle>
          <p className="text-sm text-muted-foreground">Ask questions, find encouragement, or explore topics of faith.</p>
        </CardHeader>
        
        <ScrollArea className="flex-grow p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-10">
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <Avatar className="h-8 w-8 self-start border">
                  <AvatarImage src={getSenderAvatar(msg.sender).src} alt={getSenderAvatar(msg.sender).alt} data-ai-hint={getSenderAvatar(msg.sender).dataAiHint} />
                  <AvatarFallback>{getSenderAvatar(msg.sender).fallback}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[70%] rounded-lg px-3 py-2 shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border'
                }`}
              >
                {msg.status === 'loading' && <Loader2 className="h-4 w-4 animate-spin my-1" />}
                {msg.status === 'error' && <p className="text-destructive-foreground flex items-center"><AlertTriangle className="h-4 w-4 mr-1.5"/> {msg.text}</p>}
                {msg.status !== 'loading' && msg.status !== 'error' && <p className="text-sm whitespace-pre-wrap">{msg.text}</p>}
                <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground'}`}>
                  {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                </p>
              </div>
              {msg.sender === 'user' && (
                 <Avatar className="h-8 w-8 self-start border">
                  <AvatarImage src={getSenderAvatar(msg.sender).src} alt={getSenderAvatar(msg.sender).alt} data-ai-hint={getSenderAvatar(msg.sender).dataAiHint} />
                  <AvatarFallback>{getSenderAvatar(msg.sender).fallback}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </ScrollArea>

        <div className="p-4 border-t">
           {messages.length > 0 && messages[messages.length -1].sender === 'bot' && !isLoadingResponse && quickReplies.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSendMessage(reply)}
                  className="text-xs rounded-full"
                >
                  {reply}
                </Button>
              ))}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-grow rounded-lg"
              disabled={isLoadingResponse}
            />
            <Button type="submit" size="icon" className="rounded-lg bg-primary hover:bg-primary/90" disabled={isLoadingResponse || !inputValue.trim()}>
              {isLoadingResponse ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </Card>
       {/* CSS trick to help ScrollArea fill height on mobile */}
      <style jsx global>{`
        :root {
          --header-height: ${typeof window !== 'undefined' && window.innerWidth < 768 ? '4rem' : '0px'}; /* 64px for mobile header */
          --bottom-nav-height: ${typeof window !== 'undefined' && window.innerWidth < 768 ? '4rem' : '0px'}; /* 64px for mobile bottom nav */
        }
      `}</style>
    </div>
  );
}
