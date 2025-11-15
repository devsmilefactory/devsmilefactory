import { create } from 'zustand';

export type PostType = "general" | "opportunity" | "project" | "marketplace" | "event" | "blog" | "update";
export type UserType = "innovator" | "investor" | "mentor" | "student" | "organization";

export interface Post {
  id: string;
  type: PostType;
  author: {
    id: string;
    name: string;
    avatar?: string;
    userType: UserType;
  };
  title?: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  image?: string;
  tags?: string[];
  location?: string;
  date?: string;
  price?: string;
}

interface PostsState {
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'likes' | 'comments' | 'timestamp'>) => void;
  likePost: (postId: string) => void;
  deletePost: (postId: string) => void;
}

const mockPosts: Post[] = [
  {
    id: "1",
    type: "opportunity",
    author: {
      id: "u1",
      name: "Tech Ventures Capital",
      userType: "investor",
    },
    title: "Seed Funding Opportunity - Climate Tech",
    content: "Looking for early-stage climate tech startups. We offer up to $500K in seed funding plus mentorship from industry leaders. Strong focus on carbon capture and renewable energy solutions.",
    timestamp: "2 hours ago",
    likes: 45,
    comments: 12,
    tags: ["funding", "climatetech", "seed"],
  },
  {
    id: "2",
    type: "project",
    author: {
      id: "u2",
      name: "Sarah Chen",
      userType: "innovator",
    },
    title: "AI-Powered Healthcare Platform",
    content: "Building an AI diagnostic tool for early disease detection. Currently seeking co-founders with ML expertise and healthcare industry experience. We have initial validation from 3 hospitals.",
    timestamp: "5 hours ago",
    likes: 89,
    comments: 24,
    tags: ["ai", "healthcare", "collaboration"],
  },
  {
    id: "3",
    type: "event",
    author: {
      id: "u3",
      name: "Innovation Hub",
      userType: "organization",
    },
    title: "Global Innovation Summit 2024",
    content: "Join 500+ innovators, investors, and industry experts for 3 days of workshops, networking, and pitch competitions. Featured speakers from Google, Tesla, and leading VCs.",
    timestamp: "1 day ago",
    likes: 234,
    comments: 67,
    date: "March 15-17, 2024",
    location: "San Francisco, CA",
    tags: ["networking", "summit", "pitching"],
  },
  {
    id: "4",
    type: "general",
    author: {
      id: "u4",
      name: "Dr. Michael Park",
      userType: "mentor",
    },
    content: "Just finished mentoring my 50th startup this year! The innovation ecosystem is thriving. Key lesson: Focus on solving real problems, not just building technology. Happy to connect with founders who need guidance on product-market fit.",
    timestamp: "3 days ago",
    likes: 312,
    comments: 45,
    tags: ["mentorship", "startup", "advice"],
  },
  {
    id: "5",
    type: "general",
    author: {
      id: "u5",
      name: "Emma Rodriguez",
      userType: "student",
    },
    content: "Excited to share that our university project on sustainable packaging just won first place at the Innovation Challenge! Looking forward to developing this further. Thanks to everyone who supported us!",
    timestamp: "4 days ago",
    likes: 178,
    comments: 32,
    tags: ["sustainability", "student", "innovation"],
  },
];

export const usePostsStore = create<PostsState>((set) => ({
  posts: mockPosts,
  
  addPost: (post) => set((state) => ({
    posts: [{
      ...post,
      id: `post-${Date.now()}`,
      likes: 0,
      comments: 0,
      timestamp: 'Just now',
    }, ...state.posts]
  })),
  
  likePost: (postId) => set((state) => ({
    posts: state.posts.map(post =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    )
  })),
  
  deletePost: (postId) => set((state) => ({
    posts: state.posts.filter(post => post.id !== postId)
  })),
}));

