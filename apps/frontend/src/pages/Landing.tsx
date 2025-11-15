import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowRight, Sparkles, Users, TrendingUp, Lightbulb, Building2, GraduationCap, Heart, MessageCircle, Star, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "@/hooks/use-toast";
import logoWhite from "@/assets/smile-factory-logo-white.svg";
import logoColored from "@/assets/smile-factory-logo.svg";
import heroBackground from "@/assets/young-businessmen-standing-together-holding-laptop.jpg";
import stakeholderImage1 from "@/assets/2148634783.jpg";
import stakeholderImage2 from "@/assets/image001-2.jpg";
import stakeholderImage3 from "@/assets/images (2).jpeg";
import AIChatbot from "@/components/AIChatbot";

const Landing = () => {
  const navigate = useNavigate();
  const { sendOtp, verifyOtp, isLoading, error, clearError } = useAuthStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [activeStakeholder, setActiveStakeholder] = useState(0);
  const aboutRef = useRef<HTMLDivElement>(null);

  // Unified OTP state (used for both sign in and sign up)
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 100; // Trigger transition after 100px scroll
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate stakeholder section every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStakeholder((prev) => (prev + 1) % 6); // Cycle through 6 stakeholders
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Stakeholder data - 6 types for innovation ecosystem
  const stakeholders = [
    {
      type: "Innovators",
      icon: Lightbulb,
      color: "from-blue-500 to-indigo-600",
      tagline: "Turn ideas into reality",
      benefits: ["Network", "Funding", "Mentorship"],
      keyBenefits: [
        "Access seed funding and investment opportunities",
        "Connect with experienced mentors and advisors"
      ]
    },
    {
      type: "Mentors",
      icon: GraduationCap,
      color: "from-purple-500 to-pink-600",
      tagline: "Guide the next generation",
      benefits: ["Impact", "Network", "Recognition"],
      keyBenefits: [
        "Share expertise with aspiring innovators",
        "Build your personal brand and reputation"
      ]
    },
    {
      type: "Industry Experts",
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-600",
      tagline: "Share your expertise",
      benefits: ["Collaborate", "Consult", "Grow"],
      keyBenefits: [
        "Discover consulting and advisory opportunities",
        "Expand your professional network"
      ]
    },
    {
      type: "Academic Students",
      icon: Users,
      color: "from-cyan-500 to-blue-600",
      tagline: "Launch your career",
      benefits: ["Learn", "Connect", "Opportunities"],
      keyBenefits: [
        "Connect with industry leaders and mentors",
        "Access internships and job opportunities"
      ]
    },
    {
      type: "Academic Institutions",
      icon: Building2,
      color: "from-orange-500 to-red-600",
      tagline: "Bridge academia and industry",
      benefits: ["Partner", "Research", "Talent"],
      keyBenefits: [
        "Partner with industry leaders and startups",
        "Showcase research and innovation projects"
      ]
    },
    {
      type: "Organizations",
      icon: Sparkles,
      color: "from-amber-500 to-yellow-600",
      tagline: "Drive innovation forward",
      benefits: ["Innovate", "Recruit", "Scale"],
      keyBenefits: [
        "Access top talent from the innovation ecosystem",
        "Discover partnership and collaboration opportunities"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Dynamic Toolbar with Scroll Effect */}
      <nav className={`fixed z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? 'top-0 left-0 w-full'
          : 'top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl'
      }`}>
        <div className={`backdrop-blur-lg border shadow-lg transition-all duration-500 ease-in-out ${
          isScrolled
            ? 'bg-white/95 border-gray-200/50 rounded-none px-6 py-4'
            : 'bg-white/10 border-white/20 rounded-full px-6 py-3'
        }`}>
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <img
                src={isScrolled ? logoColored : logoWhite}
                alt="Smile Factory"
                className="h-12 w-auto transition-all duration-500"
              />
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`text-sm transition-all duration-500 ${
                  isScrolled
                    ? 'text-gray-600 hover:text-gray-900'
                    : 'text-white/80 hover:text-white'
                }`}>Features</button>
              <div className="relative">
                <Link to="/feed" className={`text-sm transition-all duration-500 flex items-center gap-2 ${
                  isScrolled
                    ? 'text-gray-600 hover:text-gray-900'
                    : 'text-white/80 hover:text-white'
                }`}>
                  Community
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                </Link>
              </div>
              <button
                onClick={() => {
                  aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`text-sm transition-all duration-500 ${
                  isScrolled
                    ? 'text-gray-600 hover:text-gray-900'
                    : 'text-white/80 hover:text-white'
                }`}>
                About
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant={isScrolled ? "ghost" : "ghost"}
                size="sm"
                className={`transition-all duration-500 ${
                  isScrolled
                    ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    : 'text-white hover:text-white hover:bg-white/20'
                }`}
                onClick={() => setShowSignIn(true)}
              >
                Sign In
              </Button>
              <Button size="sm" className="rounded-full" onClick={() => setShowSignUp(true)}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Dark Theme with Background Image */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        {/* Background Image with positioning */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroBackground})`,
            backgroundPosition: '40% center', // Push image to the left
          }}
        />

        {/* Gradient Overlay - Radial gradient with dark outer edges and lighter center */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 85% 75% at 50% 50%, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 40%, rgba(0, 0, 0, 0.85) 70%, rgba(0, 0, 0, 1) 100%)',
          }}
        />

        {/* Decorative Glowing Dots/Stars - More Subtle */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-pulse"
              style={{
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                background: `rgba(251, 191, 36, ${Math.random() * 0.3 + 0.1})`,
                boxShadow: `0 0 ${Math.random() * 10 + 5}px rgba(251, 191, 36, ${Math.random() * 0.4 + 0.2})`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 4 + 3}s`,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 animate-fade-in">
              <Badge className="bg-primary text-white border-0 hover:bg-primary/90 shadow-lg">
                <Sparkles className="w-3 h-3 mr-1" />
                Innovation Ecosystem Network
              </Badge>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-white drop-shadow-lg">Impact Through</span>
                <span className="block bg-gradient-to-r from-primary via-primary-glow to-primary-glow bg-clip-text text-transparent drop-shadow-lg">
                  Innovation
                </span>
              </h1>

              <p className="text-lg text-gray-200 font-light max-w-xl drop-shadow-md">
                Smile Factory connects innovators, entrepreneurs, and industry leaders who drive growth through collaboration and breakthrough ideas.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="rounded-full group" asChild>
                  <Link to="/feed">
                    Start Connecting
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full" asChild>
                  <a href="#features">Explore Features</a>
                </Button>
              </div>

            </div>

            {/* Right - Symmetrical Overlapping Cards Showcase - Desktop */}
            <div className="relative h-[550px] hidden lg:block animate-scale-in">
              {/* Gradient Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary-glow/20 to-primary-glow/30 blur-3xl opacity-50" />

              {/* Symmetrical Card Layout - Mirrored Pairs + Center Focal Card */}

              {/* LEFT LARGE CARD - Event Card */}
              <Card className="absolute top-16 left-12 w-64 transform -rotate-3 hover:-rotate-1 hover:scale-105 hover:z-[100] transition-all duration-300 shadow-2xl hover:shadow-3xl bg-white/95 backdrop-blur-sm z-30 border border-gray-200 overflow-hidden animate-float">
                {/* Event Banner Image - Using provided event image */}
                <div className="h-32 relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80"
                    alt="Innovation Summit"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <Badge className="absolute top-3 right-3 bg-white/90 text-orange-700 border-orange-200">
                    Event
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-bold text-gray-900 mb-2 text-sm">Innovation Summit 2025</h4>
                  <div className="space-y-1 mb-2">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="font-semibold">📅</span>
                      <span>March 15-17, 2025</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="font-semibold">📍</span>
                      <span>Harare, Zimbabwe</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Join 500+ innovators and entrepreneurs
                  </p>
                  <Button size="sm" className="w-full bg-orange-500 hover:bg-orange-600 text-xs">
                    Register Now
                  </Button>
                </CardContent>
              </Card>

              {/* RIGHT LARGE CARD - Opportunity Card (Mirror of Event Card) */}
              <Card className="absolute top-16 right-12 w-64 transform rotate-3 hover:rotate-1 hover:scale-105 hover:z-[100] transition-all duration-300 shadow-2xl hover:shadow-3xl bg-white/95 backdrop-blur-sm z-30 border border-gray-200 overflow-hidden animate-float" style={{ animationDelay: '0.2s' }}>
                {/* Opportunity Header - Same height as Event image */}
                <div className="h-32 relative overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <TrendingUp className="h-16 w-16 text-blue-600" />
                  <Badge className="absolute top-3 right-3 bg-blue-600 text-white border-0">
                    💰 Opportunity
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-bold text-gray-900 mb-2 text-sm">Seed Funding Available</h4>
                  <div className="space-y-1 mb-2">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="font-semibold">💵</span>
                      <span>$50K-$200K Range</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="font-semibold">⏰</span>
                      <span>Deadline: Mar 31</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    For innovative tech startups
                  </p>
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-xs">
                    Apply Now →
                  </Button>
                </CardContent>
              </Card>

              {/* CENTER FOCAL CARD - Marketplace Card (HIDDEN FOR NOW) */}
              <Card className="hidden absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-60 transform rotate-0 hover:scale-110 hover:z-[100] transition-all duration-300 shadow-3xl hover:shadow-4xl bg-white/95 backdrop-blur-sm z-40 border-2 border-primary/30 overflow-hidden animate-float" style={{ animationDelay: '0.4s' }}>
                {/* Product Image */}
                <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <Lightbulb className="w-16 h-16 text-blue-500" />
                </div>
                <CardContent className="p-3">
                  <Badge className="mb-2 bg-amber-50 text-amber-700 border-amber-200 text-xs">
                    Marketplace
                  </Badge>
                  <h4 className="font-bold text-gray-900 mb-1 text-sm">Business Consulting</h4>
                  <p className="text-xs text-gray-600 mb-2">
                    Strategic guidance for scaling
                  </p>
                  {/* Price and CTA */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div>
                      <div className="text-xl font-bold text-gray-900">$2,500</div>
                      <div className="text-xs text-gray-500">Limited</div>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* LEFT MEDIUM CARD - Testimonial Card (Higher z-index) */}
              <Card className="absolute bottom-20 left-20 w-56 transform -rotate-2 hover:-rotate-1 hover:scale-105 hover:z-[100] transition-all duration-300 shadow-xl hover:shadow-3xl bg-white/95 backdrop-blur-sm z-50 border border-gray-200 animate-float" style={{ animationDelay: '0.6s' }}>
                <CardContent className="p-3">
                  {/* Star Rating at Top */}
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  {/* Quote */}
                  <p className="text-xs text-gray-800 leading-relaxed mb-3 italic">
                    "Smile Factory transformed how I find collaborators. Within 2 months, I connected with 3 investors!"
                  </p>
                  {/* User Info */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">AR</span>
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-gray-900">Agnès Remi</div>
                      <div className="text-xs text-gray-500">Tech Entrepreneur</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* RIGHT MEDIUM CARD - General Post (Mirror of Testimonial, Higher z-index) */}
              <Card className="absolute bottom-20 right-20 w-56 transform rotate-2 hover:rotate-1 hover:scale-105 hover:z-[100] transition-all duration-300 shadow-xl hover:shadow-3xl bg-white/90 backdrop-blur-sm z-50 border border-gray-200 animate-float" style={{ animationDelay: '0.8s' }}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">SC</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-xs text-gray-900">Sarah Chen</div>
                      <div className="text-xs text-gray-500">2h ago</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-800 leading-relaxed mb-3 italic">
                    Just closed our seed round! 🎉 Grateful for this amazing community and the connections made here.
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" /> 234
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" /> 45
                    </span>
                    <span className="ml-auto text-primary font-medium">Celebrate</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mobile - Horizontal Arc/Fan Card Layout (3 Cards) */}
            <div className="lg:hidden relative h-[320px] mt-8 animate-fade-in" style={{ perspective: '1000px' }}>
              {/* Gradient Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary-glow/10 to-primary-glow/20 blur-2xl opacity-40" />

              {/* CARD 1 - Testimonial Card (Center/Front of the fan) */}
              <Card className="absolute top-1/2 left-1/2 w-[70%] max-w-[240px] shadow-2xl bg-white/95 backdrop-blur-sm z-30 border border-gray-200 transition-all hover:scale-105"
                style={{
                  transform: 'translate(-50%, -50%) rotateY(0deg) rotateZ(0deg)',
                  transformOrigin: 'center center'
                }}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-800 leading-relaxed mb-3 italic">
                    "Smile Factory transformed how I find collaborators. Within 2 months, I connected with 3 investors!"
                  </p>
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">AR</span>
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-gray-900">Agnès Remi</div>
                      <div className="text-xs text-gray-500">Tech Entrepreneur</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CARD 2 - Event Card (Left side of fan, rotated left) */}
              <Card className="absolute top-1/2 left-[5%] w-[68%] max-w-[230px] shadow-xl bg-white/95 backdrop-blur-sm z-20 border border-gray-200 overflow-hidden transition-all hover:scale-105"
                style={{
                  transform: 'translate(0, -50%) rotateY(-15deg) rotateZ(-8deg)',
                  transformOrigin: 'right center'
                }}>
                <div className="h-16 relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80"
                    alt="Innovation Summit"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <Badge className="absolute top-2 right-2 bg-white/90 text-orange-700 border-orange-200 text-xs">
                    Event
                  </Badge>
                </div>
                <CardContent className="p-2">
                  <h4 className="font-bold text-gray-900 mb-1 text-xs">Innovation Summit 2025</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                    <span>📅 March 15-17</span>
                    <span>📍 Harare</span>
                  </div>
                  <Button size="sm" className="w-full bg-orange-500 hover:bg-orange-600 text-xs h-6">
                    Register Now
                  </Button>
                </CardContent>
              </Card>

              {/* CARD 3 - Marketplace Card (Right side of fan, rotated right) */}
              <Card className="absolute top-1/2 right-[5%] w-[68%] max-w-[230px] shadow-lg bg-white/90 backdrop-blur-sm z-10 border border-gray-200 overflow-hidden transition-all hover:scale-105"
                style={{
                  transform: 'translate(0, -50%) rotateY(15deg) rotateZ(8deg)',
                  transformOrigin: 'left center'
                }}>
                <div className="h-16 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <Lightbulb className="w-8 h-8 text-blue-500" />
                </div>
                <CardContent className="p-2">
                  <Badge className="mb-1 bg-amber-50 text-amber-700 border-amber-200 text-xs">
                    Marketplace
                  </Badge>
                  <h4 className="font-bold text-gray-900 mb-1 text-xs">Business Consulting</h4>
                  <p className="text-xs text-gray-600 mb-2">
                    Strategic guidance for scaling
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="text-sm font-bold text-gray-900">$2,500</div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs h-6 px-2">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Connect-Network-Impact Section - Light Theme with Overlap */}
      <section className="relative -mt-40 px-4 md:px-6 pb-20 bg-gradient-to-b from-transparent to-gray-50">
        <div className="w-full max-w-7xl mx-auto">
          {/* Responsive width: full on mobile, 10/12 columns on desktop */}
          <div className="w-full lg:w-10/12 mx-auto">
            <Card className="bg-white border-2 border-gray-200/80 shadow-2xl rounded-3xl overflow-hidden">
              <CardContent className="p-8 md:p-12">
                {/* Connect-Network-Impact Content */}
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                    Connect. Network. Impact.
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary-glow mx-auto mb-6"></div>
                  <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                    Smile Factory is more than a platform—it's a movement of innovators transforming communities through collaboration, breakthrough ideas, and sustainable impact. Join industry leaders who are driving real change.
                  </p>
                </div>

                {/* Three Pillars */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  <div className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:shadow-lg transition-all">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Connect</h3>
                    <p className="text-sm text-gray-600">
                      Build meaningful relationships with innovative entrepreneurs, investors, and mentors who share your vision.
                    </p>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:shadow-lg transition-all">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Network</h3>
                    <p className="text-sm text-gray-600">
                      Access a global community of innovators, resources, and opportunities to accelerate your mission.
                    </p>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:shadow-lg transition-all">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Lightbulb className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Impact</h3>
                    <p className="text-sm text-gray-600">
                      Transform communities and create lasting change through innovative solutions and collaborative projects.
                    </p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="rounded-full" asChild>
                    <Link to="/feed">
                      Join the Network
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full border-2">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Creative Bento-Grid Stakeholder Benefits Section */}
      <section id="features" className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-glow/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Innovation Ecosystem</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Everything You Need to Innovate Together
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with the right people, discover opportunities, and collaborate on projects that matter.
            </p>
          </div>

          {/* Creative Image + Floating Buttons Layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-start min-h-[600px]">
            {/* LEFT SIDE - Dynamic Content Based on Selected Stakeholder */}
            <div className="order-2 lg:order-1">
              {/* Title and Tagline - Above Images */}
              <div className="mb-6 animate-fade-in">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {stakeholders[activeStakeholder].type}
                </h3>
                <p className="text-lg text-gray-600">
                  {stakeholders[activeStakeholder].tagline}
                </p>
              </div>

              {/* Dynamic Content Container */}
              <div className="relative h-[500px]">
                {/* INNOVATORS - Circular Button Arrangement with Single Large Image */}
                {activeStakeholder === 0 && (
                  <>
                    {/* Main Image with Gradient */}
                    <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                      <img src={stakeholderImage1} alt="Innovators" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-transparent to-indigo-600/30"></div>
                    </div>
                    {/* Circular Floating Buttons - Arc Pattern */}
                    <Button className="absolute top-[12%] right-[8%] rounded-full shadow-2xl bg-blue-500 text-white hover:scale-110 border-4 border-white z-20 animate-float px-4 py-2">
                      <Lightbulb className="h-5 w-5 mr-2" />
                      {stakeholders[0].benefits[0]}
                    </Button>
                    <Button className="absolute top-[40%] right-[3%] rounded-full shadow-2xl bg-indigo-500 text-white hover:scale-110 border-4 border-white z-20 animate-float px-4 py-2" style={{ animationDelay: '0.3s' }}>
                      <TrendingUp className="h-5 w-5 mr-2" />
                      {stakeholders[0].benefits[1]}
                    </Button>
                    <Button className="absolute bottom-[12%] right-[10%] rounded-full shadow-2xl bg-purple-500 text-white hover:scale-110 border-4 border-white z-20 animate-float px-4 py-2" style={{ animationDelay: '0.6s' }}>
                      <Users className="h-5 w-5 mr-2" />
                      {stakeholders[0].benefits[2]}
                    </Button>
                  </>
                )}

                {/* MENTORS - Side-by-Side Layout with Organized Design */}
                {activeStakeholder === 1 && (
                  <>
                    {/* Left Image */}
                    <div className="absolute top-0 left-0 w-[48%] h-full rounded-2xl overflow-hidden shadow-2xl">
                      <img src={stakeholderImage2} alt="Mentors" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/25 to-transparent"></div>
                    </div>
                    {/* Right Image */}
                    <div className="absolute top-0 right-0 w-[48%] h-full rounded-2xl overflow-hidden shadow-2xl">
                      <img src={stakeholderImage3} alt="Mentoring" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-bl from-pink-600/25 to-transparent"></div>
                    </div>
                    {/* Centered Buttons - Vertical Stack */}
                    <Button className="absolute top-[15%] left-[50%] -translate-x-1/2 rounded-full shadow-2xl bg-purple-500 text-white hover:scale-110 border-4 border-white z-20 animate-float px-4 py-2">
                      <Heart className="h-5 w-5 mr-2" />
                      {stakeholders[1].benefits[0]}
                    </Button>
                    <Button className="absolute top-[45%] left-[50%] -translate-x-1/2 rounded-full shadow-2xl bg-pink-500 text-white hover:scale-110 border-4 border-white z-20 animate-float px-4 py-2" style={{ animationDelay: '0.4s' }}>
                      <Users className="h-5 w-5 mr-2" />
                      {stakeholders[1].benefits[1]}
                    </Button>
                    <Button className="absolute bottom-[15%] left-[50%] -translate-x-1/2 rounded-full shadow-2xl bg-fuchsia-500 text-white hover:scale-110 border-4 border-white z-20 animate-float px-4 py-2" style={{ animationDelay: '0.8s' }}>
                      <Star className="h-5 w-5 mr-2" />
                      {stakeholders[1].benefits[2]}
                    </Button>
                  </>
                )}

                {/* INDUSTRY EXPERTS - Single Large Image with Enhanced Colored Bubbles */}
                {activeStakeholder === 2 && (
                  <>
                    <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                      <img src={stakeholderImage1} alt="Industry Experts" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 via-transparent to-teal-600/20"></div>
                    </div>
                    {/* Enhanced Colored Bubbles with Buttons */}
                    <div className="absolute top-[18%] left-[8%] w-40 h-40 rounded-full bg-emerald-400/40 blur-3xl z-10 animate-float"></div>
                    <div className="absolute top-[50%] right-[15%] w-48 h-48 rounded-full bg-teal-400/40 blur-3xl z-10 animate-float" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute bottom-[12%] left-[25%] w-44 h-44 rounded-full bg-cyan-400/40 blur-3xl z-10 animate-float" style={{ animationDelay: '1s' }}></div>
                    <Button className="absolute top-[22%] left-[10%] rounded-full shadow-2xl bg-emerald-500 text-white hover:scale-110 border-4 border-white z-20 animate-float px-4 py-2">
                      <Users className="h-5 w-5 mr-2" />
                      {stakeholders[2].benefits[0]}
                    </Button>
                    <Button className="absolute top-[52%] right-[18%] rounded-full shadow-2xl bg-teal-500 text-white hover:scale-110 border-4 border-white z-20 animate-float px-4 py-2" style={{ animationDelay: '0.5s' }}>
                      <Lightbulb className="h-5 w-5 mr-2" />
                      {stakeholders[2].benefits[1]}
                    </Button>
                    <Button className="absolute bottom-[15%] left-[28%] rounded-full shadow-2xl bg-cyan-500 text-white hover:scale-110 border-4 border-white z-20 animate-float px-4 py-2" style={{ animationDelay: '1s' }}>
                      <TrendingUp className="h-5 w-5 mr-2" />
                      {stakeholders[2].benefits[2]}
                    </Button>
                  </>
                )}

                {/* ACADEMIC STUDENTS - Clean Horizontal Layout */}
                {activeStakeholder === 3 && (
                  <>
                    {/* Top Row - Two Images Side by Side */}
                    <div className="absolute top-0 left-0 w-[48%] h-[48%] rounded-xl overflow-hidden shadow-2xl">
                      <img src={stakeholderImage3} alt="Students" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/25 to-transparent"></div>
                    </div>
                    <div className="absolute top-0 right-0 w-[48%] h-[48%] rounded-xl overflow-hidden shadow-2xl">
                      <img src={stakeholderImage2} alt="Learning" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-bl from-blue-600/25 to-transparent"></div>
                    </div>
                    {/* Bottom - Full Width Image */}
                    <div className="absolute bottom-0 left-0 w-full h-[48%] rounded-xl overflow-hidden shadow-2xl">
                      <img src={stakeholderImage1} alt="Collaboration" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/25 to-transparent"></div>
                    </div>
                    {/* Buttons - Positioned on Images */}
                    <Button className="absolute top-[8%] left-[8%] rounded-full shadow-2xl bg-cyan-500 text-white hover:scale-110 border-4 border-white z-20 animate-float px-4 py-2">
                      <GraduationCap className="h-5 w-5 mr-2" />
                      {stakeholders[3].benefits[0]}
                    </Button>
                    <Button className="absolute top-[8%] right-[8%] rounded-full shadow-2xl bg-blue-500 text-white hover:scale-110 border-4 border-white z-20 animate-float px-4 py-2" style={{ animationDelay: '0.4s' }}>
                      <Users className="h-5 w-5 mr-2" />
                      {stakeholders[3].benefits[1]}
                    </Button>
                    <Button className="absolute bottom-[8%] left-[50%] -translate-x-1/2 rounded-full shadow-2xl bg-indigo-500 text-white hover:scale-110 border-4 border-white z-20 animate-float px-4 py-2" style={{ animationDelay: '0.8s' }}>
                      <Sparkles className="h-5 w-5 mr-2" />
                      {stakeholders[3].benefits[2]}
                    </Button>
                  </>
                )}

                {/* ACADEMIC INSTITUTIONS - Enhanced Grid Layout with Better Spacing */}
                {activeStakeholder === 4 && (
                  <>
                    {/* Top Left */}
                    <div className="absolute top-0 left-0 w-[47%] h-[47%] rounded-xl overflow-hidden shadow-lg">
                      <img src={stakeholderImage1} alt="Institution" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-transparent"></div>
                    </div>
                    {/* Top Right */}
                    <div className="absolute top-0 right-0 w-[47%] h-[47%] rounded-xl overflow-hidden shadow-lg">
                      <img src={stakeholderImage2} alt="Research" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-bl from-red-600/20 to-transparent"></div>
                    </div>
                    {/* Bottom Left */}
                    <div className="absolute bottom-0 left-0 w-[47%] h-[47%] rounded-xl overflow-hidden shadow-lg">
                      <img src={stakeholderImage3} alt="Campus" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/20 to-transparent"></div>
                    </div>
                    {/* Bottom Right - Icon Panel */}
                    <div className="absolute bottom-0 right-0 w-[47%] h-[47%] rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 flex items-center justify-center">
                      <Building2 className="h-24 w-24 text-white opacity-40" />
                    </div>
                    {/* Diagonal Buttons - Center Alignment */}
                    <Button className="absolute top-[18%] left-[38%] rounded-full shadow-2xl bg-orange-500 text-white hover:scale-110 border-4 border-white z-20 animate-float px-4 py-2">
                      <Users className="h-5 w-5 mr-2" />
                      {stakeholders[4].benefits[0]}
                    </Button>
                    <Button className="absolute top-[45%] left-[42%] rounded-full shadow-2xl bg-red-500 text-white hover:scale-110 border-4 border-white z-20 animate-float px-4 py-2" style={{ animationDelay: '0.4s' }}>
                      <Lightbulb className="h-5 w-5 mr-2" />
                      {stakeholders[4].benefits[1]}
                    </Button>
                    <Button className="absolute bottom-[18%] left-[38%] rounded-full shadow-2xl bg-rose-500 text-white hover:scale-110 border-4 border-white z-20 animate-float px-4 py-2" style={{ animationDelay: '0.8s' }}>
                      <GraduationCap className="h-5 w-5 mr-2" />
                      {stakeholders[4].benefits[2]}
                    </Button>
                  </>
                )}

                {/* ORGANIZATIONS - Large Image with Enhanced Scattered Buttons */}
                {activeStakeholder === 5 && (
                  <>
                    <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                      <img src={stakeholderImage2} alt="Organizations" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-600/30 via-transparent to-yellow-600/30"></div>
                    </div>
                    {/* Scattered Buttons with Better Spacing */}
                    <Button className="absolute top-[12%] left-[12%] rounded-full shadow-2xl bg-amber-500 text-white hover:scale-110 border-4 border-white z-20 animate-float px-4 py-2">
                      <Sparkles className="h-5 w-5 mr-2" />
                      {stakeholders[5].benefits[0]}
                    </Button>
                    <Button className="absolute top-[35%] right-[12%] rounded-full shadow-2xl bg-yellow-500 text-white hover:scale-110 border-4 border-white z-20 animate-float px-4 py-2" style={{ animationDelay: '0.3s' }}>
                      <Users className="h-5 w-5 mr-2" />
                      {stakeholders[5].benefits[1]}
                    </Button>
                    <Button className="absolute bottom-[18%] left-[28%] rounded-full shadow-2xl bg-orange-500 text-white hover:scale-110 border-4 border-white z-20 animate-float px-4 py-2" style={{ animationDelay: '0.6s' }}>
                      <TrendingUp className="h-5 w-5 mr-2" />
                      {stakeholders[5].benefits[2]}
                    </Button>
                  </>
                )}
              </div>

              {/* Key Benefits List Above CTA - Dynamic */}
              <div className="mt-6 mb-4 space-y-2">
                {stakeholders[activeStakeholder].keyBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-700">
                    <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${stakeholders[activeStakeholder].color}`}></div>
                    <span className="text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div>
                <Button size="lg" className="w-full rounded-full shadow-lg hover:shadow-xl transition-all" asChild>
                  <Link to="/feed">
                    Explore the Community
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* RIGHT SIDE - Stakeholder Selector */}
            {/* Desktop: Vertical Stack, Mobile: 2-Column Grid */}
            <div className="order-1 lg:order-2">
              {/* Stakeholder Selector Buttons */}
              <div className="grid grid-cols-2 lg:flex lg:flex-col gap-3 lg:gap-4">
              {stakeholders.map((stakeholder, index) => {
                const Icon = stakeholder.icon;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveStakeholder(index)}
                    className={`w-full text-left p-3 lg:p-6 rounded-xl border-2 transition-all duration-300 ${
                      activeStakeholder === index
                        ? 'bg-white border-primary shadow-lg scale-105'
                        : 'bg-white/50 border-gray-200 hover:border-gray-300 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row items-center lg:items-center gap-2 lg:gap-4">
                      <div className={`h-10 w-10 lg:h-12 lg:w-12 rounded-lg bg-gradient-to-br ${stakeholder.color} flex items-center justify-center transition-transform ${
                        activeStakeholder === index ? 'scale-110' : ''
                      }`}>
                        <Icon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                      </div>
                      <div className="flex-1 text-center lg:text-left">
                        <h4 className="font-bold text-sm lg:text-lg text-gray-900">{stakeholder.type}</h4>
                        <p className="text-xs lg:text-sm text-gray-500 hidden lg:block">
                          {stakeholder.tagline}
                        </p>
                      </div>
                      <div className={`hidden lg:block transition-transform ${activeStakeholder === index ? 'rotate-0' : '-rotate-90'}`}>
                        <ArrowRight className={`h-5 w-5 ${activeStakeholder === index ? 'text-primary' : 'text-gray-400'}`} />
                      </div>
                    </div>
                  </button>
                );
              })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Light Theme */}
      <section id="testimonials" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Success Stories</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Transforming Lives Through Connection
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from innovators and entrepreneurs who are making an impact through our platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="bg-white border-l-4 border-l-primary/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-warning fill-warning" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic leading-relaxed">
                  "Smile Factory helped me find the perfect co-founder for my tech startup. Within 3 months, we secured seed funding and launched our MVP!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-700">SC</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Sarah Chen</div>
                    <div className="text-sm text-gray-500">Tech Entrepreneur</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="bg-white border-l-4 border-l-success/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-warning fill-warning" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic leading-relaxed">
                  "As an investor, I've discovered incredible innovative projects here. The quality of entrepreneurs is outstanding!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-700">JF</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">James Foster</div>
                    <div className="text-sm text-gray-500">Angel Investor</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="bg-white border-l-4 border-l-accent/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-warning fill-warning" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic leading-relaxed">
                  "The mentorship I received through this platform was life-changing. Now I'm paying it forward by mentoring others!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-700">AR</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Agnès Remi</div>
                    <div className="text-sm text-gray-500">Business Consultant</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Content Section - Ticker Style with Infinite Scroll */}
      <section className="relative py-20 px-6 bg-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Content</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover trending opportunities, events, and marketplace services</p>
          </div>

          {/* Infinite Scrolling Ticker */}
          <div className="relative overflow-hidden">
            <style>{`
              @keyframes scroll-left {
                0% { transform: translateX(0); }
                100% { transform: translateX(-100%); }
              }
              .ticker-container {
                display: flex;
                animation: scroll-left 30s linear infinite;
              }
              .ticker-container:hover {
                animation-play-state: paused;
              }
              .ticker-item {
                flex-shrink: 0;
                width: 100%;
                max-width: 350px;
                margin-right: 24px;
              }
            `}</style>

            <div className="ticker-container">
              {/* Opportunity Card */}
              <div className="ticker-item">
                <Card className="bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl hover:border-primary/50 transition-all cursor-pointer h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                        Opportunity
                      </Badge>
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Seed Funding Available</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      $50K-$200K for innovative tech startups. Applications open until March 31st.
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" /> 234
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" /> 45
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Event Card */}
              <div className="ticker-item">
                <Card className="bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl hover:border-primary/50 transition-all cursor-pointer h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className="bg-orange-50 text-orange-700 border-orange-200">
                        Event
                      </Badge>
                      <Building2 className="h-5 w-5 text-orange-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Innovation Summit 2025</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Join 500+ entrepreneurs in Harare for 3 days of networking and learning. March 15-17.
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" /> 456
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" /> 89
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Marketplace Card */}
              <div className="ticker-item">
                <Card className="bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl hover:border-primary/50 transition-all cursor-pointer h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                        Marketplace
                      </Badge>
                      <Lightbulb className="h-5 w-5 text-amber-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Business Consulting Package</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Strategic guidance for scaling your business. Limited slots available.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">$2,500</span>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Heart className="h-3 w-3" /> 124
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Blog Card */}
              <div className="ticker-item">
                <Card className="bg-slate-800 border-slate-700 shadow-xl hover:shadow-2xl transition-all cursor-pointer h-full">
                  <CardContent className="p-5">
                    <Badge className="bg-purple-500 text-white border-0 mb-3 inline-block">
                      Blog
                    </Badge>
                    <h4 className="font-semibold text-white mb-2 text-sm">
                      5 Principles for Sustainable Entrepreneurship
                    </h4>
                    <p className="text-xs text-gray-300 mb-3">
                      Discover how to integrate purpose with business strategy for lasting impact.
                    </p>
                    <span className="text-xs text-gray-400">5 min read • Published 2 days ago</span>
                  </CardContent>
                </Card>
              </div>

              {/* Duplicate cards for seamless loop */}
              <div className="ticker-item">
                <Card className="bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl hover:border-primary/50 transition-all cursor-pointer h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                        Opportunity
                      </Badge>
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Seed Funding Available</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      $50K-$200K for innovative tech startups. Applications open until March 31st.
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" /> 234
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" /> 45
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Split Design with About Section */}
      <section id="about" ref={aboutRef} className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden border-0 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-0 items-stretch">
              {/* Left Side - Gradient Green Card with CTA */}
              <div className="p-12 bg-gradient-to-br from-primary via-primary-glow to-accent relative overflow-hidden flex flex-col justify-between order-2 md:order-1">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)]" />
                <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Ready to Connect with the Future?
                  </h2>
                  <p className="text-white/90 mb-8 text-lg">
                    Join thousands of innovators, investors, and changemakers shaping tomorrow.
                  </p>
                  <Button size="lg" variant="secondary" className="rounded-full" asChild>
                    <Link to="/feed">
                      Get Started Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                {/* Social Media Links - Bottom Left */}
                <div className="relative z-10 mt-12 pt-8 border-t border-white/20">
                  <p className="text-white/80 text-sm mb-4 font-medium">Follow Us</p>
                  <div className="flex gap-3">
                    <a href="#" className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                      <Facebook className="h-5 w-5 text-white" />
                    </a>
                    <a href="#" className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                      <Twitter className="h-5 w-5 text-white" />
                    </a>
                    <a href="#" className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                      <Linkedin className="h-5 w-5 text-white" />
                    </a>
                    <a href="#" className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                      <Instagram className="h-5 w-5 text-white" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Side - About Section with Outline Green */}
              <div className="p-12 bg-gray-50 flex flex-col justify-between order-1 md:order-2 border-l-2 border-l-primary/50">
                <div>
                  <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">About Smile Factory</Badge>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    Empowering Innovation Ecosystems
                  </h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Smile Factory is more than a platform—it's a movement of innovators transforming communities through collaboration, breakthrough ideas, and sustainable impact. We connect entrepreneurs, investors, mentors, and organizations to create meaningful relationships that drive real change.
                  </p>
                  <div className="space-y-3 mb-8">
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <Sparkles className="h-3 w-3 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Innovation First</h4>
                        <p className="text-sm text-gray-600">Fostering breakthrough ideas and creative solutions</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <Users className="h-3 w-3 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Community Driven</h4>
                        <p className="text-sm text-gray-600">Building meaningful connections across the ecosystem</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <TrendingUp className="h-3 w-3 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Impact Focused</h4>
                        <p className="text-sm text-gray-600">Creating lasting change in communities worldwide</p>
                      </div>
                    </div>
                  </div>
                </div>
                <Button size="lg" className="rounded-full w-full" asChild>
                  <Link to="/article/about-smile-factory">
                    Learn More About Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer - Dark Theme */}
      <footer className="bg-slate-900 text-gray-300 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-4 cursor-pointer hover:opacity-80 transition-opacity inline-block">
                <img src={logoWhite} alt="Smile Factory" className="h-12 w-auto" />
              </Link>
              <p className="text-sm text-gray-400 mb-4">
                Empowering innovators and entrepreneurs to transform communities through collaboration and breakthrough ideas.
              </p>
              {/* Social Media Icons */}
              <div className="flex gap-3">
                <a href="#" className="h-10 w-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="h-10 w-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="h-10 w-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="h-10 w-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#testimonials" className="hover:text-primary transition-colors">Testimonials</a></li>
                <li><Link to="/feed" className="hover:text-primary transition-colors">Feed</Link></li>
                <li><Link to="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link></li>
                <li><Link to="/events" className="hover:text-primary transition-colors">Events</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-white mb-4">Contact Us</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href="mailto:info@smilefactory.com" className="hover:text-primary transition-colors">
                    info@smilefactory.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <a href="tel:+263123456789" className="hover:text-primary transition-colors">
                    +263 123 456 789
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary mt-1" />
                  <span>Harare, Zimbabwe</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
              <p>© 2025 Smile Factory. All rights reserved.</p>
              <p>Empowering Innovation Ecosystems</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Sign In Modal */}
      <Dialog open={showSignIn} onOpenChange={(open) => {
        setShowSignIn(open);
        if (!open) {
          setEmail("");
          setOtpSent(false);
          setOtp("");
          clearError();
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign In to Smile Factory</DialogTitle>
            <DialogDescription>
              {!otpSent
                ? "Enter your email to receive a verification code"
                : "Enter the 6-digit code sent to your email"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}
            {!otpSent ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={async () => {
                    if (email) {
                      try {
                        await sendOtp(email);
                        setOtpSent(true);
                        toast({
                          title: "Code sent!",
                          description: "Check your email for the verification code.",
                        });
                      } catch (err) {
                        toast({
                          title: "Error",
                          description: "Failed to send verification code. Please try again.",
                          variant: "destructive",
                        });
                      }
                    }
                  }}
                  disabled={!email || isLoading}
                >
                  {isLoading ? "Sending..." : "Send Verification Code"}
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="signin-otp">Verification Code</Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={async () => {
                    if (otp.length === 6) {
                      try {
                        await verifyOtp(email, otp);
                        toast({
                          title: "Success!",
                          description: "You've been signed in successfully.",
                        });
                        navigate("/feed");
                      } catch (err) {
                        toast({
                          title: "Error",
                          description: "Invalid verification code. Please try again.",
                          variant: "destructive",
                        });
                      }
                    }
                  }}
                  disabled={otp.length !== 6 || isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify & Sign In"}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setOtpSent(false)}
                >
                  Change Email
                </Button>
              </>
            )}
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                onClick={() => {
                  setShowSignIn(false);
                  setShowSignUp(true);
                }}
                className="text-primary hover:underline"
              >
                Sign up
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sign Up Modal */}
      <Dialog open={showSignUp} onOpenChange={(open) => {
        setShowSignUp(open);
        if (!open) {
          setEmail("");
          setOtpSent(false);
          setOtp("");
          clearError();
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Get Started with Smile Factory</DialogTitle>
            <DialogDescription>
              {!otpSent
                ? "Join the innovation ecosystem - same process as sign in!"
                : "Enter the 6-digit code sent to your email"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}
            {!otpSent ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={async () => {
                    if (email) {
                      try {
                        await sendOtp(email);
                        setOtpSent(true);
                        toast({
                          title: "Code sent!",
                          description: "Check your email for the verification code.",
                        });
                      } catch (err) {
                        toast({
                          title: "Error",
                          description: "Failed to send verification code. Please try again.",
                          variant: "destructive",
                        });
                      }
                    }
                  }}
                  disabled={!email || isLoading}
                >
                  {isLoading ? "Sending..." : "Send Verification Code"}
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="signup-otp">Verification Code</Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={async () => {
                    if (otp.length === 6) {
                      try {
                        await verifyOtp(email, otp);
                        toast({
                          title: "Welcome!",
                          description: "Your account has been created successfully.",
                        });
                        navigate("/feed");
                      } catch (err) {
                        toast({
                          title: "Error",
                          description: "Invalid verification code. Please try again.",
                          variant: "destructive",
                        });
                      }
                    }
                  }}
                  disabled={otp.length !== 6 || isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify & Get Started"}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setOtpSent(false)}
                >
                  Change Email
                </Button>
              </>
            )}
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                onClick={() => {
                  setShowSignUp(false);
                  setShowSignIn(true);
                }}
                className="text-primary hover:underline"
              >
                Sign in
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Chatbot */}
      <AIChatbot onOpenSignUp={() => setShowSignUp(true)} />
    </div>
  );
};

export default Landing;
