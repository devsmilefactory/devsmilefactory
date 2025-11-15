import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Send, Bot, Sparkles, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  quickReplies?: QuickReply[];
  actions?: ChatAction[];
  timestamp: Date;
}

interface QuickReply {
  id: string;
  text: string;
  response: string;
}

interface ChatAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  type: "navigate" | "modal" | "custom";
  target?: string;
  handler?: () => void;
}

interface AIChatbotProps {
  initialOpen?: boolean;
  onOpenSignUp?: () => void;
  mode?: "general" | "fintech";
}

export default function AIChatbot({ initialOpen = false, onOpenSignUp, mode = "general" }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState<"general" | "fintech">(mode);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Check if user is logged in (simulated)
  const isLoggedIn = false; // Change this based on your auth logic

  // Open chat when initialOpen changes
  useEffect(() => {
    if (initialOpen) {
      setIsOpen(true);
    }
  }, [initialOpen]);

  // Update mode when prop changes
  useEffect(() => {
    if (mode !== chatMode) {
      setChatMode(mode);
      // Clear messages when mode changes
      setMessages([]);
    }
  }, [mode, chatMode]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Send welcome message when chat opens
      setTimeout(() => {
        if (chatMode === "fintech") {
          // Fintech mode welcome
          addAIMessage(
            "Welcome to Smile Factory Fintech & Banking! 💰 I'm your AI financial assistant. How can I help you with your financial needs today?",
            [
              { id: "1", text: "Open Bank Account", response: "bank_account" },
              { id: "2", text: "Insurance Services", response: "insurance" },
              { id: "3", text: "Market Insights", response: "market_insights" },
              { id: "4", text: "Investment Opportunities", response: "investments" },
              { id: "5", text: "Financial Planning", response: "financial_planning" },
            ],
            []
          );
        } else {
          // General mode welcome
          addAIMessage(
            isLoggedIn
              ? "Hello! 👋 I'm your AI assistant. How can I help you get the most out of the Smile Factory platform today?"
              : "Welcome to Smile Factory! 👋 I'm your AI assistant. I noticed you're not logged in yet. Would you like to create an account to unlock all features?",
            isLoggedIn
              ? [
                  { id: "1", text: "Show me around", response: "explore" },
                  { id: "2", text: "Find connections", response: "connections" },
                  { id: "3", text: "Discover events", response: "events" },
                ]
              : [
                  { id: "1", text: "Tell me more", response: "learn_more" },
                  { id: "2", text: "Sign up now", response: "signup" },
                ],
            isLoggedIn
              ? []
              : [
                  {
                    id: "signup",
                    label: "Create Account",
                    icon: <Sparkles className="h-4 w-4" />,
                    type: "modal",
                    handler: () => {
                      if (onOpenSignUp) {
                        onOpenSignUp();
                        setIsOpen(false);
                      }
                    },
                  },
                ]
          );
        }
      }, 500);
    }
  }, [isOpen, messages.length, isLoggedIn, onOpenSignUp, chatMode]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const addAIMessage = (
    content: string,
    quickReplies?: QuickReply[],
    actions?: ChatAction[]
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "ai",
      content,
      quickReplies,
      actions,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setIsTyping(false);
  };

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleQuickReply = (reply: QuickReply) => {
    addUserMessage(reply.text);
    setIsTyping(true);

    setTimeout(() => {
      handleAIResponse(reply.response);
    }, 1000);
  };

  const handleAIResponse = (responseType: string) => {
    switch (responseType) {
      case "explore":
        addAIMessage(
          "Great! Let me show you around. The platform has several key areas:",
          [
            { id: "1", text: "View Feed", response: "feed" },
            { id: "2", text: "Browse Profiles", response: "profiles" },
            { id: "3", text: "Check Marketplace", response: "marketplace" },
          ]
        );
        break;

      case "connections":
        addAIMessage(
          "I can help you find the right connections! What type of people are you looking to connect with?",
          [
            { id: "1", text: "Investors", response: "find_investors" },
            { id: "2", text: "Mentors", response: "find_mentors" },
            { id: "3", text: "Innovators", response: "find_innovators" },
          ]
        );
        break;

      case "events":
        addAIMessage(
          "Let me take you to our events page where you can discover upcoming networking opportunities and workshops.",
          [],
          [
            {
              id: "events",
              label: "View Events",
              icon: <ArrowRight className="h-4 w-4" />,
              type: "navigate",
              target: "/events",
              handler: () => navigate("/events"),
            },
          ]
        );
        break;

      case "feed":
        addAIMessage(
          "The Feed is where you'll see updates from your network and discover new content.",
          [],
          [
            {
              id: "feed",
              label: "Go to Feed",
              icon: <ArrowRight className="h-4 w-4" />,
              type: "navigate",
              target: "/feed",
              handler: () => navigate("/feed"),
            },
          ]
        );
        break;

      case "profiles":
        addAIMessage(
          "Browse profiles to discover innovators, investors, mentors, and students in our ecosystem.",
          [],
          [
            {
              id: "profiles",
              label: "Browse Profiles",
              icon: <ArrowRight className="h-4 w-4" />,
              type: "navigate",
              target: "/profiles",
              handler: () => navigate("/profiles"),
            },
          ]
        );
        break;

      case "marketplace":
        addAIMessage(
          "The Marketplace is where you can discover products, services, and opportunities.",
          [],
          [
            {
              id: "marketplace",
              label: "Visit Marketplace",
              icon: <ArrowRight className="h-4 w-4" />,
              type: "navigate",
              target: "/marketplace",
              handler: () => navigate("/marketplace"),
            },
          ]
        );
        break;

      case "learn_more":
        addAIMessage(
          "Smile Factory is an Innovation Ecosystem Network connecting innovators, investors, mentors, and students. By creating an account, you can:\n\n• Build your professional profile\n• Connect with like-minded individuals\n• Discover opportunities\n• Participate in events\n• Access the marketplace",
          [{ id: "1", text: "I'm ready to join!", response: "signup" }]
        );
        break;

      case "signup":
        addAIMessage(
          "Excellent! Let's get you started. Click the button below to create your account.",
          [],
          [
            {
              id: "signup",
              label: "Create Account",
              icon: <Sparkles className="h-4 w-4" />,
              type: "modal",
              handler: () => {
                if (onOpenSignUp) {
                  onOpenSignUp();
                  setIsOpen(false);
                }
              },
            },
          ]
        );
        break;

      case "find_investors":
      case "find_mentors":
      case "find_innovators":
        const profileType = responseType.replace("find_", "");
        addAIMessage(
          `I'll take you to the profiles page where you can filter for ${profileType}.`,
          [],
          [
            {
              id: "profiles",
              label: `Find ${profileType.charAt(0).toUpperCase() + profileType.slice(1)}`,
              icon: <ArrowRight className="h-4 w-4" />,
              type: "navigate",
              target: "/profiles",
              handler: () => navigate("/profiles"),
            },
          ]
        );
        break;

      // Fintech-specific responses
      case "bank_account":
        addAIMessage(
          "Great choice! Opening a bank account with Smile Factory Bank is quick and easy. We offer:\n\n• Zero monthly fees\n• High-yield savings accounts\n• Instant digital account setup\n• Mobile banking app\n• 24/7 customer support\n\nWhat type of account would you like to open?",
          [
            { id: "1", text: "Savings Account", response: "savings_account" },
            { id: "2", text: "Current Account", response: "current_account" },
            { id: "3", text: "Business Account", response: "business_account" },
          ],
          [
            {
              id: "open_account",
              label: "Start Application",
              icon: <Sparkles className="h-4 w-4" />,
              type: "custom",
              handler: () => {
                if (onOpenSignUp) {
                  onOpenSignUp();
                  setIsOpen(false);
                }
              },
            },
          ]
        );
        break;

      case "savings_account":
        addAIMessage(
          "Excellent! Our Savings Account offers:\n\n• 4.5% annual interest rate\n• No minimum balance\n• Free ATM withdrawals\n• Instant transfers\n\nReady to open your account?",
          [],
          [
            {
              id: "apply_savings",
              label: "Apply Now",
              icon: <ArrowRight className="h-4 w-4" />,
              type: "custom",
              handler: () => {
                if (onOpenSignUp) {
                  onOpenSignUp();
                  setIsOpen(false);
                }
              },
            },
          ]
        );
        break;

      case "current_account":
        addAIMessage(
          "Perfect! Our Current Account includes:\n\n• Free debit card\n• Unlimited transactions\n• Overdraft facility available\n• Online & mobile banking\n\nLet's get you started!",
          [],
          [
            {
              id: "apply_current",
              label: "Apply Now",
              icon: <ArrowRight className="h-4 w-4" />,
              type: "custom",
              handler: () => {
                if (onOpenSignUp) {
                  onOpenSignUp();
                  setIsOpen(false);
                }
              },
            },
          ]
        );
        break;

      case "business_account":
        addAIMessage(
          "Great for entrepreneurs! Our Business Account features:\n\n• Multi-user access\n• Invoicing tools\n• Payment gateway integration\n• Business credit cards\n• Dedicated account manager\n\nReady to grow your business?",
          [],
          [
            {
              id: "apply_business",
              label: "Apply Now",
              icon: <ArrowRight className="h-4 w-4" />,
              type: "custom",
              handler: () => {
                if (onOpenSignUp) {
                  onOpenSignUp();
                  setIsOpen(false);
                }
              },
            },
          ]
        );
        break;

      case "insurance":
        addAIMessage(
          "We offer comprehensive insurance solutions to protect what matters most:\n\n• Life Insurance\n• Health Insurance\n• Property Insurance\n• Business Insurance\n• Travel Insurance\n\nWhich type of insurance are you interested in?",
          [
            { id: "1", text: "Life Insurance", response: "life_insurance" },
            { id: "2", text: "Health Insurance", response: "health_insurance" },
            { id: "3", text: "Business Insurance", response: "business_insurance" },
          ]
        );
        break;

      case "life_insurance":
        addAIMessage(
          "Our Life Insurance plans provide:\n\n• Coverage up to $5M\n• Flexible premium payments\n• Critical illness cover\n• Family protection\n• Tax benefits\n\nGet a free quote today!",
          [],
          [
            {
              id: "life_quote",
              label: "Get Quote",
              icon: <Sparkles className="h-4 w-4" />,
              type: "custom",
              handler: () => {
                if (onOpenSignUp) {
                  onOpenSignUp();
                  setIsOpen(false);
                }
              },
            },
          ]
        );
        break;

      case "health_insurance":
        addAIMessage(
          "Our Health Insurance covers:\n\n• Hospitalization expenses\n• Pre & post hospitalization\n• Daycare procedures\n• Ambulance charges\n• No claim bonus\n\nProtect your health today!",
          [],
          [
            {
              id: "health_quote",
              label: "Get Quote",
              icon: <Sparkles className="h-4 w-4" />,
              type: "custom",
              handler: () => {
                if (onOpenSignUp) {
                  onOpenSignUp();
                  setIsOpen(false);
                }
              },
            },
          ]
        );
        break;

      case "business_insurance":
        addAIMessage(
          "Protect your business with:\n\n• Property damage cover\n• Liability insurance\n• Business interruption\n• Employee benefits\n• Cyber insurance\n\nSecure your business now!",
          [],
          [
            {
              id: "business_quote",
              label: "Get Quote",
              icon: <Sparkles className="h-4 w-4" />,
              type: "custom",
              handler: () => {
                if (onOpenSignUp) {
                  onOpenSignUp();
                  setIsOpen(false);
                }
              },
            },
          ]
        );
        break;

      case "market_insights":
        addAIMessage(
          "Stay ahead with our real-time market insights:\n\n• Stock market analysis\n• Cryptocurrency trends\n• Forex updates\n• Commodity prices\n• Economic indicators\n\nWhat market would you like to explore?",
          [
            { id: "1", text: "Stock Market", response: "stock_market" },
            { id: "2", text: "Cryptocurrency", response: "crypto_market" },
            { id: "3", text: "Forex", response: "forex_market" },
          ]
        );
        break;

      case "stock_market":
        addAIMessage(
          "📈 Today's Market Highlights:\n\n• S&P 500: +1.2%\n• NASDAQ: +0.8%\n• DOW: +1.5%\n\nTop Gainers:\n• Tech stocks leading\n• Energy sector strong\n\nGet personalized stock recommendations!",
          [],
          [
            {
              id: "stock_recs",
              label: "Get Recommendations",
              icon: <Sparkles className="h-4 w-4" />,
              type: "custom",
              handler: () => {
                if (onOpenSignUp) {
                  onOpenSignUp();
                  setIsOpen(false);
                }
              },
            },
          ]
        );
        break;

      case "crypto_market":
        addAIMessage(
          "💰 Crypto Market Update:\n\n• Bitcoin: $45,230 (+2.3%)\n• Ethereum: $3,120 (+1.8%)\n• Top altcoins trending\n\nExplore crypto investment opportunities!",
          [],
          [
            {
              id: "crypto_invest",
              label: "Explore Crypto",
              icon: <Sparkles className="h-4 w-4" />,
              type: "custom",
              handler: () => {
                if (onOpenSignUp) {
                  onOpenSignUp();
                  setIsOpen(false);
                }
              },
            },
          ]
        );
        break;

      case "forex_market":
        addAIMessage(
          "💱 Forex Market Overview:\n\n• EUR/USD: 1.0850\n• GBP/USD: 1.2650\n• USD/JPY: 148.50\n\nGet live forex trading signals!",
          [],
          [
            {
              id: "forex_signals",
              label: "Get Signals",
              icon: <Sparkles className="h-4 w-4" />,
              type: "custom",
              handler: () => {
                if (onOpenSignUp) {
                  onOpenSignUp();
                  setIsOpen(false);
                }
              },
            },
          ]
        );
        break;

      case "investments":
        addAIMessage(
          "Grow your wealth with our investment solutions:\n\n• Mutual Funds\n• Fixed Deposits\n• Bonds & Debentures\n• Real Estate Investment Trusts (REITs)\n• Portfolio Management\n\nWhat type of investment interests you?",
          [
            { id: "1", text: "Mutual Funds", response: "mutual_funds" },
            { id: "2", text: "Fixed Deposits", response: "fixed_deposits" },
            { id: "3", text: "Portfolio Management", response: "portfolio_mgmt" },
          ]
        );
        break;

      case "mutual_funds":
        addAIMessage(
          "Our Mutual Fund offerings:\n\n• Equity funds (High growth)\n• Debt funds (Stable returns)\n• Hybrid funds (Balanced)\n• Tax-saving ELSS\n• SIP starting from $50/month\n\nStart investing today!",
          [],
          [
            {
              id: "mf_invest",
              label: "Start SIP",
              icon: <Sparkles className="h-4 w-4" />,
              type: "custom",
              handler: () => {
                if (onOpenSignUp) {
                  onOpenSignUp();
                  setIsOpen(false);
                }
              },
            },
          ]
        );
        break;

      case "fixed_deposits":
        addAIMessage(
          "Fixed Deposit Benefits:\n\n• Interest rates up to 7.5%\n• Flexible tenure (7 days - 10 years)\n• Guaranteed returns\n• Loan against FD available\n• Senior citizen benefits\n\nSecure your savings now!",
          [],
          [
            {
              id: "fd_apply",
              label: "Open FD",
              icon: <Sparkles className="h-4 w-4" />,
              type: "custom",
              handler: () => {
                if (onOpenSignUp) {
                  onOpenSignUp();
                  setIsOpen(false);
                }
              },
            },
          ]
        );
        break;

      case "portfolio_mgmt":
        addAIMessage(
          "Professional Portfolio Management:\n\n• Personalized investment strategy\n• Risk assessment\n• Regular rebalancing\n• Expert fund managers\n• Transparent reporting\n\nLet experts manage your wealth!",
          [],
          [
            {
              id: "portfolio_start",
              label: "Get Started",
              icon: <Sparkles className="h-4 w-4" />,
              type: "custom",
              handler: () => {
                if (onOpenSignUp) {
                  onOpenSignUp();
                  setIsOpen(false);
                }
              },
            },
          ]
        );
        break;

      case "financial_planning":
        addAIMessage(
          "Comprehensive Financial Planning Services:\n\n• Retirement planning\n• Tax planning\n• Estate planning\n• Education planning\n• Goal-based planning\n\nWhat's your primary financial goal?",
          [
            { id: "1", text: "Retirement Planning", response: "retirement_plan" },
            { id: "2", text: "Tax Planning", response: "tax_plan" },
            { id: "3", text: "Education Planning", response: "education_plan" },
          ]
        );
        break;

      case "retirement_plan":
        addAIMessage(
          "Secure Your Retirement:\n\n• Pension plans\n• Retirement savings calculator\n• Annuity options\n• Social security optimization\n• Healthcare planning\n\nPlan your golden years today!",
          [],
          [
            {
              id: "retirement_calc",
              label: "Calculate Retirement Needs",
              icon: <Sparkles className="h-4 w-4" />,
              type: "custom",
              handler: () => {
                if (onOpenSignUp) {
                  onOpenSignUp();
                  setIsOpen(false);
                }
              },
            },
          ]
        );
        break;

      case "tax_plan":
        addAIMessage(
          "Smart Tax Planning:\n\n• Tax-saving investments\n• Deduction optimization\n• Tax filing assistance\n• Capital gains planning\n• Expert consultation\n\nMaximize your tax savings!",
          [],
          [
            {
              id: "tax_consult",
              label: "Book Consultation",
              icon: <Sparkles className="h-4 w-4" />,
              type: "custom",
              handler: () => {
                if (onOpenSignUp) {
                  onOpenSignUp();
                  setIsOpen(false);
                }
              },
            },
          ]
        );
        break;

      case "education_plan":
        addAIMessage(
          "Plan for Your Child's Education:\n\n• Education savings plans\n• College fund calculator\n• Scholarship guidance\n• Student loan planning\n• International education funding\n\nInvest in their future!",
          [],
          [
            {
              id: "education_calc",
              label: "Calculate Education Costs",
              icon: <Sparkles className="h-4 w-4" />,
              type: "custom",
              handler: () => {
                if (onOpenSignUp) {
                  onOpenSignUp();
                  setIsOpen(false);
                }
              },
            },
          ]
        );
        break;

      default:
        addAIMessage(
          "I'm here to help! Feel free to ask me anything about the platform.",
          [
            { id: "1", text: "Show me around", response: "explore" },
            { id: "2", text: "Find connections", response: "connections" },
          ]
        );
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    addUserMessage(inputValue);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      addAIMessage(
        "Thanks for your message! I'm a simulated AI assistant. In a production environment, I would process your request and provide helpful guidance.",
        [
          { id: "1", text: "Show me around", response: "explore" },
          { id: "2", text: "Find connections", response: "connections" },
        ]
      );
    }, 1000);
  };

  const handleActionClick = (action: ChatAction) => {
    if (action.handler) {
      action.handler();
      if (action.type === "navigate") {
        setIsOpen(false);
      }
    }
  };

  return (
    <>
      {/* Chat Button - Bottom Right */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 z-50"
          size="icon"
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] max-h-[calc(100vh-3rem)] shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary to-primary/80 text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs opacity-90">Always here to help</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2",
                    message.type === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.type === "ai" && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-3 space-y-2",
                      message.type === "user"
                        ? "bg-primary text-white"
                        : "bg-muted"
                    )}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>

                    {/* Quick Replies */}
                    {message.quickReplies && message.quickReplies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {message.quickReplies.map((reply) => (
                          <Button
                            key={reply.id}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickReply(reply)}
                            className="text-xs"
                          >
                            {reply.text}
                          </Button>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    {message.actions && message.actions.length > 0 && (
                      <div className="flex flex-col gap-2 mt-2">
                        {message.actions.map((action) => (
                          <Button
                            key={action.id}
                            onClick={() => handleActionClick(action)}
                            className="w-full justify-between"
                            size="sm"
                          >
                            <span>{action.label}</span>
                            {action.icon}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                  {message.type === "user" && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-2">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}

