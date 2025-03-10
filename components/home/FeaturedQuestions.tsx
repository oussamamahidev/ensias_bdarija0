"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { Sparkles, ChevronRight, MessageSquare, Eye, ThumbsUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils"

const FeaturedQuestions = () => {
  // Mock featured questions data
  const featuredQuestions = [
    {
      _id: "1",
      title: "How to implement authentication with Next.js and Clerk?",
      content:
        "I'm building a Next.js application and want to implement authentication using Clerk. What's the best approach?",
      tags: [
        { _id: "1", name: "next.js" },
        { _id: "2", name: "authentication" },
        { _id: "3", name: "clerk" },
      ],
      author: {
        _id: "101",
        name: "Sarah Johnson",
        picture: "/assets/images/user.svg",
      },
      upvotes: 42,
      views: 1250,
      answers: 8,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      _id: "2",
      title: "Best practices for state management in large React applications",
      content:
        "I'm working on a large-scale React application and need advice on state management. Should I use Redux, Context API, or something else?",
      tags: [
        { _id: "4", name: "react" },
        { _id: "5", name: "redux" },
        { _id: "6", name: "state-management" },
      ],
      author: {
        _id: "102",
        name: "Michael Chen",
        picture: "/assets/images/user.svg",
      },
      upvotes: 38,
      views: 980,
      answers: 12,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
    {
      _id: "3",
      title: "How to optimize Tailwind CSS for production?",
      content: "My Tailwind CSS bundle size is quite large. What are the best practices to optimize it for production?",
      tags: [
        { _id: "7", name: "tailwind-css" },
        { _id: "8", name: "optimization" },
        { _id: "9", name: "css" },
      ],
      author: {
        _id: "103",
        name: "Emily Rodriguez",
        picture: "/assets/images/user.svg",
      },
      upvotes: 29,
      views: 845,
      answers: 6,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
  ]

  const [mounted, setMounted] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div ref={ref} className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Questions</h2>
        </div>
        <Link
          href="/?filter=top"
          className="flex items-center text-primary-500 hover:text-primary-600 text-sm font-medium"
        >
          View more
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredQuestions.map((question, index) => (
          <motion.div
            key={question._id}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Link href={`/question/${question._id}`}>
              <div className="bg-white dark:bg-gray-800/80 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 transform hover:translate-y-[-4px] h-full flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-primary-500 transition-colors">
                  {question.title}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{question.content}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags.map((tag) => (
                    <Badge
                      key={tag._id}
                      className="bg-primary-500/10 text-primary-600 dark:text-primary-400 hover:bg-primary-500/20"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={question.author.picture} alt={question.author.name} />
                      <AvatarFallback>{question.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{getTimestamp(question.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs">
                      <ThumbsUp size={12} className="text-primary-500" />
                      <span>{formatAndDivideNumber(question.upvotes)}</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs">
                      <MessageSquare size={12} className="text-blue-500" />
                      <span>{question.answers}</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs">
                      <Eye size={12} className="text-green-500" />
                      <span>{formatAndDivideNumber(question.views)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default FeaturedQuestions

