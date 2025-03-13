"use client";

import { useState, useEffect, useCallback } from "react";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuestionCard from "../cards/QuestionCard";

// Mock data for featured questions
const MOCK_FEATURED_QUESTIONS = [
  {
    _id: "q1",
    title: "How to implement authentication in Next.js with Clerk?",
    tags: [
      { _id: "t1", name: "nextjs" },
      { _id: "t2", name: "authentication" },
      { _id: "t3", name: "clerk" },
    ],
    author: {
      _id: "u1",
      name: "John Doe",
      clerkId: "clerk_123",
      picture: "/placeholder.svg?height=40&width=40",
    },
    upvotes: Array(24).fill("user_id"),
    downvotes: Array(3).fill("user_id"),
    views: 1250,
    answers: Array(8).fill({}),
    createdAt: new Date("2023-12-15"),
  },
  {
    _id: "q2",
    title: "Best practices for state management in React applications",
    tags: [
      { _id: "t4", name: "react" },
      { _id: "t5", name: "redux" },
      { _id: "t6", name: "state-management" },
    ],
    author: {
      _id: "u2",
      name: "Jane Smith",
      clerkId: "clerk_456",
      picture: "/placeholder.svg?height=40&width=40",
    },
    upvotes: Array(36).fill("user_id"),
    downvotes: Array(5).fill("user_id"),
    views: 2100,
    answers: Array(12).fill({}),
    createdAt: new Date("2023-12-10"),
  },
  {
    _id: "q3",
    title: "How to optimize MongoDB queries for better performance?",
    tags: [
      { _id: "t7", name: "mongodb" },
      { _id: "t8", name: "database" },
      { _id: "t9", name: "performance" },
    ],
    author: {
      _id: "u3",
      name: "Alex Johnson",
      clerkId: "clerk_789",
      picture: "/placeholder.svg?height=40&width=40",
    },
    upvotes: Array(18).fill("user_id"),
    downvotes: Array(2).fill("user_id"),
    views: 980,
    answers: Array(5).fill({}),
    createdAt: new Date("2023-12-05"),
  },
  {
    _id: "q4",
    title: "Implementing responsive design with Tailwind CSS",
    tags: [
      { _id: "t10", name: "tailwindcss" },
      { _id: "t11", name: "css" },
      { _id: "t12", name: "responsive-design" },
    ],
    author: {
      _id: "u4",
      name: "Sarah Williams",
      clerkId: "clerk_101",
      picture: "/placeholder.svg?height=40&width=40",
    },
    upvotes: Array(42).fill("user_id"),
    downvotes: Array(4).fill("user_id"),
    views: 1800,
    answers: Array(9).fill({}),
    createdAt: new Date("2023-12-01"),
  },
  {
    _id: "q5",
    title: "Handling form validation in React with Zod",
    tags: [
      { _id: "t13", name: "react" },
      { _id: "t14", name: "zod" },
      { _id: "t15", name: "form-validation" },
    ],
    author: {
      _id: "u5",
      name: "Michael Brown",
      clerkId: "clerk_202",
      picture: "/placeholder.svg?height=40&width=40",
    },
    upvotes: Array(31).fill("user_id"),
    downvotes: Array(3).fill("user_id"),
    views: 1450,
    answers: Array(7).fill({}),
    createdAt: new Date("2023-11-25"),
  },
];

const FeaturedQuestionsCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Navigate to the next slide
  const nextSlide = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setActiveIndex(
      (prevIndex) => (prevIndex + 1) % MOCK_FEATURED_QUESTIONS.length
    );

    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, [isTransitioning]);

  // Navigate to the previous slide
  const prevSlide = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? MOCK_FEATURED_QUESTIONS.length - 1 : prevIndex - 1
    );

    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, [isTransitioning]);

  // Auto-advance slides every 2 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 2000);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  return (
    <div className="relative w-full">
      {/* Navigation buttons */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between px-4 z-20 pointer-events-none">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white/90 dark:hover:bg-gray-800/90 shadow-lg pointer-events-auto transition-all"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white/90 dark:hover:bg-gray-800/90 shadow-lg pointer-events-auto transition-all"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <ChevronRight className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </Button>
      </div>

      {/* Carousel container */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {MOCK_FEATURED_QUESTIONS.map((question, index) => (
            <div key={question._id} className="w-full flex-shrink-0 px-2">
              <div className="relative">
                {/* Featured badge - Now positioned outside the QuestionCard */}
                <div className="absolute -top-5 left-6 z-10 mt-3">
                  <div className="flex items-center gap-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                    <Sparkles className="w-3.5 h-3.5" />
                    Featured
                  </div>
                </div>

                {/* Question card with extra padding for the badge */}
                <div className="pt-4">
                  <QuestionCard
                    _id={question._id}
                    title={question.title}
                    tags={question.tags}
                    author={question.author}
                    upvotes={question.upvotes}
                    downvotes={question.downvotes}
                    views={question.views}
                    answers={question.answers}
                    createdAt={question.createdAt}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-10">
          {MOCK_FEATURED_QUESTIONS.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true);
                setActiveIndex(index);
                setTimeout(() => setIsTransitioning(false), 500);
              }}
              className={`transition-all duration-300 ${
                index === activeIndex
                  ? "w-6 h-2 bg-orange-500"
                  : "w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-orange-400"
              } rounded-full`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedQuestionsCarousel;
