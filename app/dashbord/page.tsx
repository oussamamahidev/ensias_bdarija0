"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Tag,
  Award,
  Users,
  BookOpen,
  HelpCircle,
} from "lucide-react";
import HeroSection from "@/components/dashbord/HeroSection";
import FeatureCard from "@/components/dashbord/FeatureCard";
import TrendingTags from "@/components/dashbord/TrendingTags";
import FeaturedQuestions from "@/components/dashbord/FeaturedQuestions";
import CommunitySection from "@/components/dashbord/CommunitySection";
import CallToAction from "@/components/dashbord/CallToAction";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-10 pb-20">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="container mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 px-4 py-2 bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 rounded-full">
            Explore Features
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark100_light900 mb-4">
            Everything you need to{" "}
            <span className="primary-text-gradient">succeed</span>
          </h2>
          <p className="text-dark400_light700 max-w-2xl mx-auto">
            D2sOverflow provides all the tools you need to ask questions, share
            knowledge, and grow your programming skills.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<HelpCircle size={24} />}
            title="Ask Questions"
            description="Post your programming questions and get answers from the community."
            link="/ask-question"
            linkText="Ask a Question"
            color="orange"
            delay={0.1}
          />
          <FeatureCard
            icon={<MessageSquare size={24} />}
            title="Answer & Earn"
            description="Share your knowledge by answering questions and earn reputation points."
            link="/questions"
            linkText="Browse Questions"
            color="blue"
            delay={0.2}
          />
          <FeatureCard
            icon={<Tag size={24} />}
            title="Explore Tags"
            description="Browse questions by tags to find topics that interest you."
            link="/tags"
            linkText="View Tags"
            color="green"
            delay={0.3}
          />
          <FeatureCard
            icon={<Users size={24} />}
            title="Community"
            description="Connect with other developers and build your professional network."
            link="/community"
            linkText="Meet the Community"
            color="purple"
            delay={0.4}
          />
          <FeatureCard
            icon={<BookOpen size={24} />}
            title="Knowledge Base"
            description="Access tutorials, guides, and best practices for various technologies."
            link="/knowledge-base"
            linkText="Read Articles"
            color="cyan"
            delay={0.5}
          />
          <FeatureCard
            icon={<Award size={24} />}
            title="Reputation & Badges"
            description="Earn badges and build your reputation by contributing to the community."
            link="/badges"
            linkText="View Badges"
            color="yellow"
            delay={0.6}
          />
        </div>
      </section>

      {/* Trending Tags Section */}
      <TrendingTags />

      {/* Featured Questions Section */}
      <FeaturedQuestions />

      {/* Community Section */}
      <CommunitySection />

      {/* Call to Action */}
      <CallToAction />
    </div>
  );
}
