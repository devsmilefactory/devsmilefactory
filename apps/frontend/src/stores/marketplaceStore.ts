import { create } from 'zustand';
import { Post } from './postsStore';

interface MarketplaceState {
  items: Post[];
  featuredItems: Post[];
}

const featuredMarketplaceItems: Post[] = [
  {
    id: "m-featured-1",
    type: "marketplace",
    author: {
      id: "org1",
      name: "Business Solutions Group",
      userType: "organization",
    },
    title: "Premium Business Mentorship Program",
    content: "Exclusive 6-month mentorship program with successful entrepreneurs. Includes weekly 1-on-1 sessions, group workshops, and access to our investor network. Limited to 10 participants per cohort.",
    timestamp: "Featured",
    likes: 189,
    comments: 45,
    price: "$5,000",
    tags: ["mentorship", "premium", "business-growth"],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop",
  },
  {
    id: "m-featured-2",
    type: "marketplace",
    author: {
      id: "org5",
      name: "Innovation Lab",
      userType: "organization",
    },
    title: "AI-Powered Analytics Platform",
    content: "Enterprise-grade analytics platform with AI-driven insights. Real-time data visualization, predictive analytics, and custom reporting. Perfect for data-driven decision making.",
    timestamp: "Featured",
    likes: 245,
    comments: 67,
    price: "$999/month",
    tags: ["ai", "analytics", "saas"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
  },
  {
    id: "m-featured-3",
    type: "marketplace",
    author: {
      id: "org6",
      name: "Creative Studio Pro",
      userType: "organization",
    },
    title: "Brand Identity Design Package",
    content: "Complete brand identity package including logo design, brand guidelines, business cards, and social media templates. Professional design team with 10+ years experience.",
    timestamp: "Featured",
    likes: 156,
    comments: 34,
    price: "$3,500",
    tags: ["design", "branding", "creative"],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop",
  },
];

const mockMarketplaceItems: Post[] = [
  {
    id: "m1",
    type: "marketplace",
    author: {
      id: "org2",
      name: "DevTools Inc",
      userType: "organization",
    },
    title: "Cloud Infrastructure Package",
    content: "Complete cloud setup for startups: AWS credits, monitoring tools, CI/CD pipeline, and security suite. Perfect for scaling your MVP to production.",
    timestamp: "2 days ago",
    likes: 56,
    comments: 18,
    price: "$299/month",
    tags: ["cloud", "infrastructure", "devtools"],
  },
  {
    id: "m2",
    type: "marketplace",
    author: {
      id: "org3",
      name: "Strategic Consulting Partners",
      userType: "organization",
    },
    title: "Business Strategy Consulting",
    content: "Purpose-driven business consulting for startups and growing companies. Strategic planning, market analysis, and growth strategies aligned with your values.",
    timestamp: "1 day ago",
    likes: 42,
    comments: 15,
    price: "$2,500",
    tags: ["consulting", "strategy", "business"],
  },
  {
    id: "m3",
    type: "marketplace",
    author: {
      id: "org4",
      name: "Tech Solutions Co",
      userType: "organization",
    },
    title: "Custom Software Development",
    content: "Full-stack development services for web and mobile applications. Experienced team specializing in React, Node.js, and cloud infrastructure.",
    timestamp: "3 days ago",
    likes: 38,
    comments: 12,
    price: "$150/hour",
    tags: ["development", "software", "tech"],
  },
];

export const useMarketplaceStore = create<MarketplaceState>(() => ({
  items: mockMarketplaceItems,
  featuredItems: featuredMarketplaceItems,
}));

