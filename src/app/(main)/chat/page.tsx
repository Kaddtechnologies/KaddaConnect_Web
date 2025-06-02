
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import type { ChatMessage, ChatConversation } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageCircle, Bot, User, AlertTriangle, Loader2, Menu, PlusCircle, Trash2, Edit3, Save } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/auth-context';
import { useUserData } from '@/contexts/user-data-context';
import { formatDistanceToNow } from 'date-fns';
import { askSpiritualChatbot } from '@/ai/flows/spiritual-chat-flow'; 
import { useToast } from '@/hooks/use-toast';

const quickReplies = [
  "I'm feeling stressed today.",
  "Can you give me a Bible verse for encouragement?",
  "What does the Bible say about forgiveness?",
  "I need a prayer for strength."
];

export default function ChatPage() {
  const { user: currentUser } = useAuth();
  const { 
    chatConversations, 
    activeChatConversationId, 
    setActiveChatConversationId,
    getActiveConversation,
    saveNewChatConversation,
    addMessageToChatConversation,
    deleteChatConversation,
    renameChatConversation
  } = useUserData();
  const { toast } = useToast();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [chatContainerHeight, setChatContainerHeight] = useState('auto');
  const [currentConversationTitle, setCurrentConversationTitle] = useState("New Chat");
  const [isSheetOpen, setIsSheetOpen] = useState(false);


  useEffect(() => {
    const updateHeight = () => {
      if (typeof window !== 'undefined') {
        const headerHeight = window.innerWidth < 768 ? (document.querySelector('.md\\:hidden.sticky.top-0')?.clientHeight || 64) : (document.querySelector('.hidden.md\\:flex.sticky.top-0')?.clientHeight || 64);
        const bottomNavHeight = window.innerWidth < 768 ? (document.querySelector('nav.fixed.bottom-0')?.clientHeight || 64) : 0;
        const viewportHeight = window.innerHeight;
        const pagePadding = window.innerWidth < 768 ? 24 : 48;
        const availableHeight = viewportHeight - headerHeight - bottomNavHeight - pagePadding;
        setChatContainerHeight(`${Math.max(300, availableHeight)}px`);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollableViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollableViewport) {
        scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    if (activeChatConversationId) {
      const activeConvo = getActiveConversation();
      if (activeConvo) {
        setMessages(activeConvo.messages);
        setCurrentConversationTitle(activeConvo.title);
      } else {
        // Active ID is set, but convo not found (e.g. after deletion)
        setActiveChatConversationId(null); // Reset to new chat
        setMessages([]);
        setCurrentConversationTitle("New Chat");
      }
    } else {
      // No active conversation ID, means it's a new chat
      setMessages([]);
      setCurrentConversationTitle("New Chat");
    }
  }, [activeChatConversationId, chatConversations, getActiveConversation, setActiveChatConversationId]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText || !currentUser) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    const updatedMessagesWithUser = [...messages, userMessage];
    setMessages(updatedMessagesWithUser); // Update local UI immediately
    setInputValue('');
    setIsLoadingResponse(true);

    // Add placeholder for bot message
    const botMessageId = `msg-${Date.now() + 1}`;
    const messagesWithBotLoading = [
      ...updatedMessagesWithUser,
      {
        id: botMessageId,
        text: '',
        sender: 'bot' as 'bot',
        timestamp: new Date().toISOString(),
        status: 'loading' as 'loading',
      },
    ];
    setMessages(messagesWithBotLoading);


    try {
      const historyForFlow = updatedMessagesWithUser.map(msg => ({
        sender: msg.sender,
        text: msg.text,
      }));
      
      const response = await askSpiritualChatbot({ 
        message: messageText,
        userName: currentUser.displayName.split(' ')[0] || currentUser.displayName,
        history: historyForFlow.slice(0, -1) 
      });

      const botMessage: ChatMessage = {
        id: botMessageId,
        text: response.response,
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      
      const finalMessages = [...updatedMessagesWithUser, botMessage];
      setMessages(finalMessages);

      if (activeChatConversationId) {
        addMessageToChatConversation(activeChatConversationId, userMessage);
        addMessageToChatConversation(activeChatConversationId, botMessage);
      }
      // If it's a new chat, messages are accumulating locally until saved.

    } catch (error) {
      console.error("Error getting bot response:", error);
      const errorBotMessage: ChatMessage = {
        id: botMessageId,
        text: "Sorry, I encountered an error. Please try again.",
        sender: 'bot',
        timestamp: new Date().toISOString(),
        status: 'error',
      };
      const finalMessagesWithError = [...updatedMessagesWithUser, errorBotMessage];
      setMessages(finalMessagesWithError);
       if (activeChatConversationId) {
        addMessageToChatConversation(activeChatConversationId, userMessage);
        addMessageToChatConversation(activeChatConversationId, errorBotMessage);
      }
    } finally {
      setIsLoadingResponse(false);
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setActiveChatConversationId(conversationId);
    setIsSheetOpen(false);
  };

  const handleNewChat = () => {
    setActiveChatConversationId(null);
    setMessages([]);
    setCurrentConversationTitle("New Chat");
    setIsSheetOpen(false);
  };

  const handleSaveCurrentChat = () => {
    if (!currentUser) {
      toast({ title: "Error", description: "You must be logged in to save a chat.", variant: "destructive" });
      return;
    }
    if (messages.length === 0) {
      toast({ title: "Cannot Save", description: "Chat is empty.", variant: "destructive" });
      return;
    }
    if (activeChatConversationId) { // Already saved, just a "checkpoint"
        toast({ title: "Chat Updated", description: "Conversation progress saved." });
        // Messages are already being added to active convo, so this is more like a sync point if needed
        // Or, if we weren't auto-saving messages to active convo, this is where we'd do it.
        // For now, this path might not be strictly necessary if messages are auto-added.
        return;
    }

    let title = prompt("Enter a title for this chat:", messages[0]?.text.substring(0, 30) || "New Chat");
    if (title === null) return; // User cancelled prompt
    title = title.trim() ||  messages[0]?.text.substring(0, 30) || "New Chat";

    const newConvoId = saveNewChatConversation(messages, title);
    setCurrentConversationTitle(title);
    toast({ title: "Chat Saved", description: `Conversation "${title}" has been saved.` });
  };

  const handleDeleteSelectedConversation = (conversationId: string, conversationTitle: string) => {
    if (window.confirm(`Are you sure you want to delete the chat "${conversationTitle}"?`)) {
      deleteChatConversation(conversationId);
      toast({ title: "Chat Deleted", description: `"${conversationTitle}" has been removed.`, variant: "destructive" });
       if (activeChatConversationId === conversationId) {
         handleNewChat(); // Go to a new chat state
       }
    }
  };

  const handleRenameSelectedConversation = (conversationId: string, currentTitle: string) => {
    let newTitle = prompt("Enter new title for the chat:", currentTitle);
    if (newTitle === null) return; // User cancelled
    newTitle = newTitle.trim();
    if (newTitle && newTitle !== currentTitle) {
      renameChatConversation(conversationId, newTitle);
      toast({ title: "Chat Renamed", description: `Conversation renamed to "${newTitle}".` });
      if (activeChatConversationId === conversationId) {
        setCurrentConversationTitle(newTitle);
      }
    } else if (!newTitle) {
      toast({ title: "Rename Cancelled", description: "Title cannot be empty.", variant: "destructive" });
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
    return {
      src: undefined, 
      fallback: <Bot className="h-5 w-5 text-primary"/>,
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
        <CardHeader className="text-center border-b p-4 flex flex-row items-center justify-between">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open Conversations</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 flex flex-col">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="text-lg">Chat History</SheetTitle>
              </SheetHeader>
              <div className="p-4">
                <Button onClick={handleNewChat} className="w-full mb-3">
                  <PlusCircle className="h-4 w-4 mr-2" /> New Chat
                </Button>
              </div>
              <ScrollArea className="flex-grow px-4">
                {chatConversations.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No saved chats yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {chatConversations.map(convo => (
                      <li key={convo.id} className="group">
                        <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors">
                          <button
                            onClick={() => handleSelectConversation(convo.id)}
                            className={`flex-grow text-left text-sm truncate ${activeChatConversationId === convo.id ? 'font-semibold text-primary' : 'text-foreground'}`}
                            title={convo.title}
                          >
                            {convo.title}
                          </button>
                          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRenameSelectedConversation(convo.id, convo.title)}>
                              <Edit3 className="h-4 w-4"/>
                              <span className="sr-only">Rename</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/80" onClick={() => handleDeleteSelectedConversation(convo.id, convo.title)}>
                              <Trash2 className="h-4 w-4"/>
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </ScrollArea>
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center justify-center gap-2 flex-grow">
            <Avatar className="h-10 w-10 border-2 border-primary/30">
                 <AvatarImage src={undefined} alt="The Potter's Wisdom A.I." data-ai-hint="bot avatar wisdom" />
                 <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    <MessageCircle className="h-5 w-5"/>
                 </AvatarFallback>
            </Avatar>
            <div>
                <CardTitle className="text-base md:text-xl font-headline text-primary truncate max-w-[150px] md:max-w-xs" title={currentConversationTitle}>
                    {currentConversationTitle}
                </CardTitle>
                <p className="text-xs text-muted-foreground">Your companion for spiritual encouragement.</p>
            </div>
          </div>
           <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSaveCurrentChat}
              disabled={isLoadingResponse || messages.length === 0 || !!activeChatConversationId}
              className={`${activeChatConversationId ? 'invisible' : ''}`} // Hide if already saved
            >
              <Save className="h-4 w-4 mr-2" /> Save
            </Button>
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
