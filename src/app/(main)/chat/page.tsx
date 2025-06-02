
"use client";

import { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageCircle, Bot, User, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { formatDistanceToNow } from 'date-fns';
import { askSpiritualChatbot } from '@/ai/flows/spiritual-chat-flow'; 

const quickReplies = [
  "I'm feeling stressed today.",
  "Can you give me a Bible verse for encouragement?",
  "What does the Bible say about forgiveness?",
  "I need a prayer for strength."
];

export default function ChatPage() {
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [chatContainerHeight, setChatContainerHeight] = useState('auto');


  useEffect(() => {
    const updateHeight = () => {
      if (typeof window !== 'undefined') {
        const headerHeight = window.innerWidth < 768 ? (document.querySelector('.md\\:hidden.sticky.top-0')?.clientHeight || 64) : (document.querySelector('.hidden.md\\:flex.sticky.top-0')?.clientHeight || 64);
        const bottomNavHeight = window.innerWidth < 768 ? (document.querySelector('nav.fixed.bottom-0')?.clientHeight || 64) : 0;
        const viewportHeight = window.innerHeight;
        // Subtract padding/margins of parent elements as well if any. Let's assume 24px total for p-3 on mobile.
        const pagePadding = window.innerWidth < 768 ? 24 : 48; // p-3 vs md:p-6
        
        const availableHeight = viewportHeight - headerHeight - bottomNavHeight - pagePadding;
        setChatContainerHeight(`${Math.max(300, availableHeight)}px`); // Min height 300px
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);


  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      const scrollableViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollableViewport) {
        scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText || !currentUser) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    const currentMessagesWithUser = [...messages, userMessage];
    setMessages(currentMessagesWithUser);
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
      // Prepare history for the Genkit flow
      const historyForFlow = currentMessagesWithUser.map(msg => ({
        sender: msg.sender,
        text: msg.text,
      }));
      
      const response = await askSpiritualChatbot({ 
        message: messageText,
        userName: currentUser.displayName.split(' ')[0] || currentUser.displayName, // Use first name
        history: historyForFlow.slice(0, -1) // Pass all messages except the current user message
      });

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
    if (sender === 'user' && currentUser) {
      return {
        src: currentUser.profilePictureUrl,
        fallback: currentUser.displayName?.charAt(0).toUpperCase() || 'U',
        alt: currentUser.displayName || 'User',
        dataAiHint: 'profile person'
      };
    }
    // For bot, using a generic icon. You can replace with a specific bot avatar URL if you have one.
    return {
      src: undefined, 
      fallback: <Bot className="h-5 w-5 text-primary"/>, // Changed to use primary color for bot fallback
      alt: "The Potter's Wisdom A.I.",
      dataAiHint: 'bot avatar'
    };
  };

  return (
    <div 
        className="container mx-auto max-w-2xl py-0 md:py-6"
        style={{ height: chatContainerHeight }}
    >
      <Card className="flex flex-col h-full shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="text-center border-b p-4">
          <div className="flex items-center justify-center gap-2">
            <Avatar className="h-10 w-10 border-2 border-primary/30">
                 <AvatarImage src={undefined} alt="The Potter's Wisdom A.I." data-ai-hint="bot avatar wisdom" />
                 <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    <MessageCircle className="h-5 w-5"/>
                 </AvatarFallback>
            </Avatar>
            <div>
                <CardTitle className="text-xl md:text-2xl font-headline text-primary">The Potter&apos;s Wisdom A.I.</CardTitle>
                <p className="text-xs md:text-sm text-muted-foreground">Your companion for spiritual encouragement.</p>
            </div>
          </div>
        </CardHeader>
        
        <ScrollArea ref={scrollAreaRef} className="flex-grow p-4 space-y-4 bg-muted/20">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-10 flex flex-col items-center justify-center h-full">
              <MessageCircle className="h-16 w-16 text-primary/50 mb-4" />
              <p className="text-lg font-semibold">Welcome, {currentUser?.displayName?.split(' ')[0]}!</p>
              <p>How are you feeling today?</p>
              <p className="text-xs mt-2">You can start by typing a message or selecting a quick reply below.</p>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <Avatar className="h-8 w-8 self-start border shadow-sm">
                  <AvatarImage src={getSenderAvatar(msg.sender).src} alt={getSenderAvatar(msg.sender).alt as string} data-ai-hint={getSenderAvatar(msg.sender).dataAiHint} />
                  <AvatarFallback>{getSenderAvatar(msg.sender).fallback}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[75%] rounded-xl px-3.5 py-2.5 shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-card border rounded-bl-none'
                }`}
              >
                {msg.status === 'loading' && <Loader2 className="h-4 w-4 animate-spin my-1 text-muted-foreground" />}
                {msg.status === 'error' && <p className="text-destructive-foreground flex items-center text-sm"><AlertTriangle className="h-4 w-4 mr-1.5"/> {msg.text}</p>}
                {msg.status !== 'loading' && msg.status !== 'error' && <p className="text-sm whitespace-pre-wrap">{msg.text}</p>}
                <p className={`text-xs mt-1.5 ${msg.sender === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground/80'}`}>
                  {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                </p>
              </div>
              {msg.sender === 'user' && currentUser && (
                 <Avatar className="h-8 w-8 self-start border shadow-sm">
                  <AvatarImage src={getSenderAvatar(msg.sender).src} alt={getSenderAvatar(msg.sender).alt as string} data-ai-hint={getSenderAvatar(msg.sender).dataAiHint} />
                  <AvatarFallback>{getSenderAvatar(msg.sender).fallback}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </ScrollArea>

        <div className="p-4 border-t bg-card">
           {(messages.length === 0 || (messages.length > 0 && messages[messages.length -1].sender === 'bot' && !isLoadingResponse)) && quickReplies.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSendMessage(reply)}
                  className="text-xs rounded-full shadow-sm hover:bg-primary/10 hover:border-primary/50"
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
              placeholder="Type your message to The Potter's Wisdom..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-grow rounded-lg shadow-inner text-sm"
              disabled={isLoadingResponse || !currentUser}
            />
            <Button type="submit" size="icon" className="rounded-lg bg-primary hover:bg-primary/90 shadow-md w-10 h-10" disabled={isLoadingResponse || !inputValue.trim() || !currentUser}>
              {isLoadingResponse ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

