"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, Sparkles, Check } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import ThemeToggle from "./ThemeToggle";

export default function HeroSection() {
  const { isSignedIn } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20 pb-24">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
      <div className="absolute top-20 right-10 w-64 h-64 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl"></div>

      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Floating particles */}
      <motion.div
        className="absolute top-20 left-[20%] w-6 h-6 rounded-full bg-orange-500/30 dark:bg-orange-500/20"
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-40 right-[30%] w-4 h-4 rounded-full bg-blue-500/30 dark:bg-blue-500/20"
        animate={{
          y: [0, -20, 0],
          x: [0, -15, 0],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute bottom-20 left-[40%] w-8 h-8 rounded-full bg-green-500/30 dark:bg-green-500/20"
        animate={{
          y: [0, 20, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Hero content */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block mb-4"
            >
              <div className="flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full">
                <Sparkles size={16} />
                <span className="text-sm font-medium">
                  Developer Q&A Platform
                </span>
              </div>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-dark100_light900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Where Developers <br className="hidden sm:block" />
              <span className="primary-text-gradient">
                Learn, Share & Build
              </span>
            </motion.h1>

            <motion.p
              className="text-dark400_light700 text-base sm:text-lg mb-8 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              D2sOverflow is a community for programmers to learn, share their
              knowledge, and build their careers. Join thousands of developers
              and take your coding skills to the next level.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Link
                href={isSignedIn ? "/ask-question" : "/sign-up"}
                className="w-full sm:w-auto"
              >
                <Button className="primary-gradient text-white px-6 sm:px-8 py-5 sm:py-6 rounded-xl hover:shadow-lg transition-all w-full sm:w-auto">
                  {isSignedIn ? "Ask a Question" : "Join the Community"}
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link href="/questions" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="light-border-2 text-dark400_light700 px-6 sm:px-8 py-5 sm:py-6 rounded-xl w-full sm:w-auto"
                >
                  Explore Questions
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="mt-8 relative max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  className="w-full bg-light-800 dark:bg-dark-300 text-dark400_light700 rounded-full py-3 pl-12 pr-4 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-3 justify-center lg:justify-start">
                <span className="text-xs text-dark400_light700">Popular:</span>
                {["React", "Next.js", "TypeScript", "MongoDB"].map((tag) => (
                  <button
                    key={tag}
                    className="text-xs text-primary-500 hover:text-primary-600 transition-colors"
                    onClick={() => setSearchQuery(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Hero image - hide on small screens */}
          <motion.div
            className="flex-1 relative hidden md:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div
              className="relative z-10 w-full max-w-lg mx-auto"
              animate={
                animationComplete
                  ? {
                      y: [0, -10, 0],
                    }
                  : {}
              }
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Image
                src="/assets/images/ensias.png"
                alt="EnsiasBdarija"
                width={600}
                height={500}
                className="w-full h-auto"
              />
            </motion.div>

            {/* Animated code snippets */}
            <motion.div
              className="absolute -top-10 -left-10 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-20 max-w-[200px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <pre className="text-xs text-dark200_light900 overflow-hidden">
                <code>
                  {`function HelloWorld() {
  return <h1>Hello!</h1>;
}`}
                </code>
              </pre>
            </motion.div>

            <motion.div
              className="absolute -bottom-5 right-10 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg z-20"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Check
                    size={16}
                    className="text-green-600 dark:text-green-400"
                  />
                </div>
                <span className="text-sm font-medium text-dark200_light900">
                  Problem Solved!
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats - responsive grid */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.6 }}
        >
          {[
            { label: "Questions", value: "15K+" },
            { label: "Answers", value: "32K+" },
            { label: "Users", value: "8K+" },
            { label: "Daily Views", value: "120K+" },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm"
            >
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold primary-text-gradient">
                {stat.value}
              </h3>
              <p className="text-dark400_light700">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
