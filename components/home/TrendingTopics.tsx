"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { TrendingUp, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const TrendingTopics = () => {
  // Mock trending topics data
  const trendingTopics = [
    { id: "1", name: "Next.js", count: 423, growth: "+12%" },
    { id: "2", name: "React", count: 389, growth: "+8%" },
    { id: "3", name: "TypeScript", count: 356, growth: "+15%" },
    { id: "4", name: "Tailwind CSS", count: 298, growth: "+24%" },
    { id: "5", name: "Node.js", count: 276, growth: "+5%" },
    { id: "6", name: "MongoDB", count: 245, growth: "+7%" },
    { id: "7", name: "GraphQL", count: 187, growth: "+19%" },
    { id: "8", name: "Docker", count: 176, growth: "+11%" },
  ]

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-12"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trending Topics</h2>
        </div>
        <Link href="/tags" className="flex items-center text-primary-500 hover:text-primary-600 text-sm font-medium">
          View all tags
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
        {trendingTopics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Link href={`/tags/${topic.id}`}>
              <div className="bg-white dark:bg-gray-800/80 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 transform hover:translate-y-[-4px] flex flex-col items-center justify-center text-center h-full">
                <span className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{topic.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">{topic.count} questions</span>
                <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20">
                  {topic.growth}
                </Badge>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default TrendingTopics

