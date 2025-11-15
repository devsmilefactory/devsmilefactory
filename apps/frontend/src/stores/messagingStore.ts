import { create } from 'zustand';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface MessagingState {
  conversations: Conversation[];
  messages: Message[];
  selectedConversationId: string | null;
  selectConversation: (conversationId: string) => void;
  sendMessage: (conversationId: string, content: string) => void;
  markAsRead: (conversationId: string) => void;
  getConversationMessages: (conversationId: string) => Message[];
}

export const useMessagingStore = create<MessagingState>((set, get) => ({
  conversations: [
    {
      id: "conv-1",
      participantId: "user-1",
      participantName: "Dr. Sarah Johnson",
      lastMessage: "That sounds like a great opportunity!",
      lastMessageTime: "2 hours ago",
      unreadCount: 2,
    },
    {
      id: "conv-2",
      participantId: "user-2",
      participantName: "Michael Chen",
      lastMessage: "Let's schedule a call next week",
      lastMessageTime: "1 day ago",
      unreadCount: 0,
    },
    {
      id: "conv-3",
      participantId: "user-3",
      participantName: "Tech Innovations Hub",
      lastMessage: "Thanks for your interest in our program",
      lastMessageTime: "3 days ago",
      unreadCount: 1,
    },
  ],

  messages: [
    {
      id: "msg-1",
      conversationId: "conv-1",
      senderId: "user-1",
      senderName: "Dr. Sarah Johnson",
      content: "Hi! I saw your post about the AI healthcare platform. Very interesting!",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "msg-2",
      conversationId: "conv-1",
      senderId: "current-user",
      senderName: "EFF HGG",
      content: "Thank you! I'd love to discuss potential collaboration opportunities.",
      timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "msg-3",
      conversationId: "conv-1",
      senderId: "user-1",
      senderName: "Dr. Sarah Johnson",
      content: "That sounds like a great opportunity!",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: "msg-4",
      conversationId: "conv-2",
      senderId: "user-2",
      senderName: "Michael Chen",
      content: "I'm interested in investing in your project. Can we talk?",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "msg-5",
      conversationId: "conv-2",
      senderId: "current-user",
      senderName: "EFF HGG",
      content: "Absolutely! I'm available next week.",
      timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "msg-6",
      conversationId: "conv-2",
      senderId: "user-2",
      senderName: "Michael Chen",
      content: "Let's schedule a call next week",
      timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
  ],

  selectedConversationId: null,

  selectConversation: (conversationId) => {
    set({ selectedConversationId: conversationId });
    get().markAsRead(conversationId);
  },

  sendMessage: (conversationId, content) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: "current-user",
      senderName: "EFF HGG",
      content,
      timestamp: new Date().toISOString(),
      read: true,
    };

    set((state) => ({
      messages: [...state.messages, newMessage],
      conversations: state.conversations.map(conv =>
        conv.id === conversationId
          ? {
              ...conv,
              lastMessage: content,
              lastMessageTime: "Just now",
            }
          : conv
      ),
    }));
  },

  markAsRead: (conversationId) => {
    set((state) => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId
          ? { ...conv, unreadCount: 0 }
          : conv
      ),
      messages: state.messages.map(msg =>
        msg.conversationId === conversationId
          ? { ...msg, read: true }
          : msg
      ),
    }));
  },

  getConversationMessages: (conversationId) => {
    const { messages } = get();
    return messages
      .filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },
}));

