import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const featuredJobs = [
  {
    title: "Chief Technology Officer (CTO)",
    company: "Smile Factory",
    location: "Remote / Harare, Zimbabwe",
    type: "Full-time",
    salary: "$150K - $200K",
    description: "Lead our technology vision and engineering team as we scale our innovation platform. We're looking for an experienced technical leader who shares our mission of connecting innovators and entrepreneurs globally. Must have 10+ years of experience with React, Node.js, and cloud infrastructure.",
    posted: "Featured",
    tags: ["leadership", "react", "nodejs", "remote"],
  },
];

const mockJobs = [
  {
    title: "Senior Full-Stack Developer",
    company: "Faith Tech Innovations",
    location: "Remote",
    type: "Full-time",
    salary: "$120K - $160K",
    description: "Join our mission-driven team building technology solutions for global impact. Looking for experienced developers with React and Node.js expertise.",
    posted: "2 days ago",
    tags: ["react", "nodejs", "remote"],
  },
  {
    title: "Product Manager",
    company: "Innovation Ventures",
    location: "Harare, Zimbabwe",
    type: "Full-time",
    salary: "$80K - $110K",
    description: "Lead product development for our faith-driven marketplace platform. Experience in B2B SaaS and agile methodologies required.",
    posted: "1 week ago",
    tags: ["product", "management", "saas"],
  },
  {
    title: "Marketing Director",
    company: "Spirit Embassy Network",
    location: "Hybrid",
    type: "Full-time",
    salary: "$90K - $130K",
    description: "Drive marketing strategy for our global network of innovators and entrepreneurs. Experience in digital marketing and community building essential.",
    posted: "3 days ago",
    tags: ["marketing", "digital", "community"],
  },
];

export default function Jobs() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 md:pb-6">
      <Card className="bg-card">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-2">Job Board</h2>
          <p className="text-muted-foreground">
            Find opportunities with faith-driven organizations
          </p>
        </CardContent>
      </Card>

      {/* Featured Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary fill-primary" />
          <h3 className="text-lg font-semibold">Featured Jobs</h3>
        </div>
        <div className="space-y-4">
          {featuredJobs.map((job, index) => (
            <div key={index} className="relative">
              <div className="absolute -top-2 -left-2 z-10">
                <Badge className="bg-primary text-white shadow-lg">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              </div>
              <Card className="border-2 border-primary shadow-lg bg-gradient-to-br from-primary/5 to-transparent hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                      <p className="text-muted-foreground">{job.company}</p>
                    </div>
                    <Badge className="bg-primary text-white">{job.type}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span>📍 {job.location}</span>
                    <span>💰 {job.salary}</span>
                    <span>⭐ {job.posted}</span>
                  </div>
                  <p className="text-foreground mb-4">{job.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {job.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">All Jobs</h3>
        <div className="space-y-4">
          {mockJobs.map((job, index) => (
            <Card key={index} className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                    <p className="text-muted-foreground">{job.company}</p>
                  </div>
                  <Badge className="bg-primary text-white">{job.type}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>📍 {job.location}</span>
                  <span>💰 {job.salary}</span>
                  <span>🕒 {job.posted}</span>
                </div>
                <p className="text-foreground mb-4">{job.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {job.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

