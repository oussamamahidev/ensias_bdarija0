"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Flame, MessageSquare, ThumbsUp, Eye, ChevronRight, ChevronLeft } from "lucide-react"

// Mock data
const featuredQuestions = [
  {
    id: "q1",
    title: "How to handle authentication in Next.js 13 with App Router?",
    author: {
      name: "Alex Johnson",
      avatar: "/assets/images/user.svg",
    },
    tags: ["nextjs", "auth"],
    votes: 48,
    answers: 12,
    views: 1245,
    hot: true,
  },
  {
    id: "q2",
    title: "Best practices for using TypeScript with React in 2023",
    author: {
      name: "Maria Garcia",
      avatar: "/assets/images/user.svg",
    },
    tags: ["typescript", "react"],
    votes: 36,
    answers: 8,
    views: 982,
    hot: true,
  },
  {
    id: "q3",
    title: "How to optimize performance in large React applications?",
    author: {
      name: "John Smith",
      avatar: "/assets/images/user.svg",
    },
    tags: ["react", "performance"],
    votes: 29,
    answers: 6,
    views: 876,
    hot: false,
  },
  {
    id: "q4",
    title: "Understanding the new features in ES2023",
    author: {
      name: "Sarah Lee",
      avatar: "/assets/images/user.svg",
    },
    tags: ["javascript", "es2023"],
    votes: 24,
    answers: 5,
    views: 742,
    hot: false,
  },
  {
    id: "q5",
    title: "How to implement server-side rendering with React and Express?",
    author: {
      name: "David Kim",
      avatar: "/assets/images/user.svg",
    },
    tags: ["react", "express", "ssr"],
    votes: 19,
    answers: 4,
    views: 631,
    hot: false,
  },
]

export default function FeaturedQuestions() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [hoveredQuestion, setHoveredQuestion] = useState<string | null>(null)

  // Adjust slides per view based on screen size
  const getSlidesPerView = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 1
      if (window.innerWidth < 1024) return 2
      return 3
    }
    return 3 // Default for SSR
  }

  const slidesPerView = getSlidesPerView()
  const totalSlides = Math.ceil(featuredQuestions.length / slidesPerView)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const visibleQuestions = featuredQuestions.slice(currentSlide * slidesPerView, (currentSlide + 1) * slidesPerView)

  return (
    <section className="container mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Flame size={20} className="text-orange-500" />
            <h2 className="text-2xl font-bold text-dark100_light900">Featured Questions</h2>
          </div>
          <p className="text-dark400_light700">Check out the most engaging questions from our community</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="rounded-full bg-white dark:bg-gray-800"
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            className="rounded-full bg-white dark:bg-gray-800"
          >
            <ChevronRight size={16} />
          </Button>
          <Link href="/questions">
            <Button variant="ghost" className="text-primary-500 hover:text-primary-600">
              View All Questions
              <ChevronRight size={16} className="ml-1" />
            </Button>
          </Link>
        </div>
      </motion.div>

      <div className="relative">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {visibleQuestions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <Link
                href={`/question/${question.id}`}
                onMouseEnter={() => setHoveredQuestion(question.id)}
                onMouseLeave={() => setHoveredQuestion(null)}
              >
                <Card
                  className={`card-wrapper border transition-all duration-300 ${
                    hoveredQuestion === question.id ? "border-primary-500/50 shadow-lg" : ""
                  } bg-white dark:bg-gray-800`}
                >
                  <CardContent className="p-6">
                    <div className="relative">
                      {question.hot && (
                        <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white animate-pulse-glow">
                          <Flame size={12} />
                        </div>
                      )}

                      <h3
                        className={`font-medium text-lg text-dark200_light900 line-clamp-2 mb-3 ${
                          hoveredQuestion === question.id ? "text-primary-500" : ""
                        }`}
                      >
                        {question.title}
                      </h3>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {question.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-light-800 dark:bg-dark-300 text-dark400_light700"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Image
                            src={question.author.avatar || "/placeholder.svg"}
                            alt={question.author.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <span className="text-sm text-dark400_light700">{question.author.name}</span>
                        </div>

                        <div className="flex items-center gap-3 text-dark400_light700">
                          <div className="flex items-center gap-1 text-xs">
                            <ThumbsUp size={12} />
                            <span>{question.votes}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <MessageSquare size={12} />
                            <span>{question.answers}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Eye size={12} />
                            <span>{question.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination dots */}
        {totalSlides > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentSlide === index ? "bg-primary-500 w-6" : "bg-gray-300 dark:bg-gray-700"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
