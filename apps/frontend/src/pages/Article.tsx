import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, Bookmark } from "lucide-react";
import Layout from "@/components/Layout";

const Article = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Article data - in a real app, this would come from an API
  const articles: Record<string, any> = {
    "about-smile-factory": {
      title: "About Smile Factory: Empowering Innovation Ecosystems",
      author: "Smile Factory Team",
      date: "March 10, 2025",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop",
      content: `
        <h2>Our Mission</h2>
        <p>Smile Factory is more than a platform—it's a movement of innovators transforming communities through collaboration, breakthrough ideas, and sustainable impact. We connect entrepreneurs, investors, mentors, and organizations to create meaningful relationships that drive real change.</p>

        <h2>The Problem We Solve</h2>
        <p>Innovation doesn't happen in isolation. Yet, many talented individuals and organizations struggle to find the right collaborators, resources, and opportunities to bring their ideas to life. Geographic boundaries, lack of visibility, and fragmented networks create barriers to meaningful connections.</p>

        <h2>Our Solution</h2>
        <p>Smile Factory bridges these gaps by creating a unified ecosystem where:</p>
        <ul>
          <li><strong>Entrepreneurs</strong> find co-founders, mentors, and investors</li>
          <li><strong>Investors</strong> discover promising startups and opportunities</li>
          <li><strong>Mentors</strong> guide the next generation of innovators</li>
          <li><strong>Organizations</strong> collaborate on projects that matter</li>
          <li><strong>Students</strong> gain real-world experience and build networks</li>
        </ul>

        <h2>Our Core Values</h2>
        <p><strong>Innovation First:</strong> We foster breakthrough ideas and creative solutions that challenge the status quo.</p>
        <p><strong>Community Driven:</strong> We believe in the power of collaboration and building meaningful connections across the ecosystem.</p>
        <p><strong>Impact Focused:</strong> We're committed to creating lasting change in communities worldwide.</p>

        <h2>What Sets Us Apart</h2>
        <p>Unlike traditional networking platforms, Smile Factory combines:</p>
        <ul>
          <li>Advanced matching algorithms to connect the right people</li>
          <li>Comprehensive opportunity marketplace</li>
          <li>Mentorship and guidance programs</li>
          <li>Event management and networking tools</li>
          <li>Community-driven content and resources</li>
        </ul>

        <h2>Our Impact</h2>
        <p>Since our launch, we've facilitated thousands of meaningful connections, helped launch hundreds of startups, and created a thriving community of innovators across multiple continents.</p>

        <h2>Join the Movement</h2>
        <p>Whether you're an entrepreneur with a big idea, an investor looking for opportunities, or someone passionate about innovation, Smile Factory is your platform to connect, collaborate, and create impact.</p>
      `,
    },
  };

  const article = articles[slug || ""];

  if (!article) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/")} className="rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8 text-primary hover:text-primary/80"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Article Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-600 mb-6">
            <span>{article.author}</span>
            <span>•</span>
            <span>{article.date}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-12 rounded-2xl overflow-hidden shadow-lg">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-96 object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div
            dangerouslySetInnerHTML={{ __html: article.content }}
            className="text-gray-700 leading-relaxed space-y-6"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 py-8 border-t border-gray-200">
          <Button variant="outline" className="rounded-full">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" className="rounded-full">
            <Bookmark className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Article;

