import { create } from 'zustand';

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  authorRole: string;
  excerpt: string;
  image: string;
  readTime: string;
  date: string;
  tags: string[];
  featured?: boolean;
}

interface BlogState {
  posts: BlogPost[];
  featuredPosts: BlogPost[];
}

const featuredBlogPosts: BlogPost[] = [
  {
    id: "b-featured-1",
    title: "The Future of Innovation: Trends Shaping 2024",
    author: "Dr. Sarah Johnson",
    authorRole: "Innovation Expert",
    excerpt: "Explore the cutting-edge trends that are transforming how we innovate, collaborate, and create value in the modern economy. From AI integration to sustainable practices, discover what's next.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    readTime: "8 min read",
    date: "March 10, 2024",
    tags: ["innovation", "trends", "technology"],
    featured: true,
  },
];

const mockBlogPosts: BlogPost[] = [
  {
    id: "b1",
    title: "Building a Purpose-Driven Business: 5 Essential Principles",
    author: "Michael Chen",
    authorRole: "Business Mentor",
    excerpt: "Learn how to integrate purpose and business practices to create lasting impact in your community while building a sustainable enterprise.",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
    readTime: "6 min read",
    date: "March 8, 2024",
    tags: ["business", "purpose", "entrepreneurship"],
  },
  {
    id: "b2",
    title: "How to Pitch Your Startup to Investors: A Complete Guide",
    author: "Emma Rodriguez",
    authorRole: "Venture Capitalist",
    excerpt: "Master the art of pitching with proven strategies from a seasoned investor. Learn what VCs really want to hear and how to stand out.",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
    readTime: "10 min read",
    date: "March 5, 2024",
    tags: ["startups", "funding", "pitching"],
  },
  {
    id: "b3",
    title: "The Power of Mentorship in Innovation Ecosystems",
    author: "Dr. James Williams",
    authorRole: "Academic Researcher",
    excerpt: "Research shows that mentorship accelerates innovation and success. Discover how to find the right mentor and build meaningful relationships.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    readTime: "7 min read",
    date: "March 3, 2024",
    tags: ["mentorship", "networking", "growth"],
  },
  {
    id: "b4",
    title: "Sustainable Innovation: Balancing Profit and Purpose",
    author: "Lisa Thompson",
    authorRole: "Sustainability Consultant",
    excerpt: "Explore how leading companies are integrating sustainability into their innovation strategies without compromising profitability.",
    image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&q=80",
    readTime: "9 min read",
    date: "February 28, 2024",
    tags: ["sustainability", "innovation", "impact"],
  },
  {
    id: "b5",
    title: "From Idea to Market: The Startup Journey",
    author: "David Park",
    authorRole: "Serial Entrepreneur",
    excerpt: "A practical roadmap for taking your idea from concept to a market-ready product. Learn from real experiences and avoid common pitfalls.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    readTime: "12 min read",
    date: "February 25, 2024",
    tags: ["startups", "product", "entrepreneurship"],
  },
  {
    id: "b6",
    title: "Networking Strategies for Introverted Innovators",
    author: "Rachel Kim",
    authorRole: "Career Coach",
    excerpt: "Networking doesn't have to be overwhelming. Discover authentic strategies that work for introverts in the innovation space.",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80",
    readTime: "5 min read",
    date: "February 22, 2024",
    tags: ["networking", "career", "personal-growth"],
  },
];

export const useBlogStore = create<BlogState>(() => ({
  posts: mockBlogPosts,
  featuredPosts: featuredBlogPosts,
}));

