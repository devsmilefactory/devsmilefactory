import { create } from 'zustand';
import { Post } from './postsStore';

interface EventsState {
  events: Post[];
  featuredEvents: Post[];
}

const featuredEvents: Post[] = [
  {
    id: "e-featured-1",
    type: "event",
    author: {
      id: "org5",
      name: "Innovation Hub Zimbabwe",
      userType: "organization",
    },
    title: "Global Innovation Summit 2024",
    content: "Join 500+ innovators, investors, and industry experts for 3 days of workshops, networking, and pitch competitions. Featured speakers from leading tech companies and VCs. Early bird tickets available now!",
    timestamp: "Featured",
    likes: 456,
    comments: 89,
    date: "April 15-17, 2024",
    location: "Harare International Conference Centre",
    tags: ["networking", "summit", "pitching", "innovation"],
  },
];

const mockEvents: Post[] = [
  {
    id: "e1",
    type: "event",
    author: {
      id: "org6",
      name: "Startup Accelerator",
      userType: "organization",
    },
    title: "Pitch Night: Seed Stage Startups",
    content: "Watch 10 promising startups pitch to a panel of investors. Network with founders, investors, and mentors. Free entry, registration required.",
    timestamp: "Next Week",
    likes: 234,
    comments: 45,
    date: "March 22, 2024",
    location: "Innovation Hub, Harare",
    tags: ["pitching", "startups", "networking"],
  },
  {
    id: "e2",
    type: "event",
    author: {
      id: "org7",
      name: "Tech Community Zimbabwe",
      userType: "organization",
    },
    title: "AI & Machine Learning Workshop",
    content: "Hands-on workshop covering the fundamentals of AI and ML. Build your first ML model. Suitable for beginners. Laptops required.",
    timestamp: "2 weeks away",
    likes: 189,
    comments: 34,
    date: "March 28, 2024",
    location: "Tech Hub, Bulawayo",
    tags: ["ai", "workshop", "machine-learning"],
  },
  {
    id: "e3",
    type: "event",
    author: {
      id: "org8",
      name: "Kingdom Business Network",
      userType: "organization",
    },
    title: "Faith & Business Leadership Conference",
    content: "Explore how to integrate faith principles into business leadership. Keynote speakers, panel discussions, and networking sessions.",
    timestamp: "3 weeks away",
    likes: 312,
    comments: 67,
    date: "April 5, 2024",
    location: "Celebration Centre, Harare",
    tags: ["leadership", "faith", "business"],
  },
  {
    id: "e4",
    type: "event",
    author: {
      id: "org9",
      name: "Women in Tech Zimbabwe",
      userType: "organization",
    },
    title: "Women Founders Meetup",
    content: "Monthly meetup for women entrepreneurs and founders. Share experiences, challenges, and opportunities. Guest speaker: Sarah Chen, CEO of TechVentures.",
    timestamp: "1 month away",
    likes: 156,
    comments: 28,
    date: "April 10, 2024",
    location: "Co-Working Space, Harare",
    tags: ["women-in-tech", "entrepreneurship", "networking"],
  },
];

export const useEventsStore = create<EventsState>(() => ({
  events: mockEvents,
  featuredEvents: featuredEvents,
}));

