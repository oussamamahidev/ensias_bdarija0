"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"

interface TagCardProps {
  tag: {
    _id: string
    name: string
    questions: any[]
  }
  isPopular?: boolean
  trendPercentage?: number
}

export default function TagCard({ tag, isPopular = false, trendPercentage }: TagCardProps) {
  const questionCount = tag.questions.length

  // Determine trend color and icon
  const isTrendingUp = trendPercentage && trendPercentage > 0
  const trendColor = isTrendingUp ? "text-green-500" : "text-red-500"
  const TrendIcon = isTrendingUp ? TrendingUp : TrendingDown

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className="group">
      <Link href={`/tags/${tag._id}`}>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
          <div className="flex justify-between items-start mb-3">
            <Badge
              className={`${
                isPopular
                  ? "bg-primary-500 text-white hover:bg-primary-600"
                  : "bg-primary-500/10 text-primary-500 dark:text-primary-400 hover:bg-primary-500/20"
              } transition-colors px-3 py-1 rounded-full text-xs font-medium uppercase`}
            >
              {tag.name}
            </Badge>

            {isPopular && (
              <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
                <TrendIcon className="h-3 w-3" />
                <span>{Math.abs(trendPercentage || 0)}%</span>
              </div>
            )}
          </div>

          <div className="mt-auto">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="primary-text-gradient font-semibold">{questionCount}</span>
              <span className="ml-1">{questionCount === 1 ? "question" : "questions"}</span>
            </p>

            {isPopular && (
              <div className="mt-2 h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full primary-gradient rounded-full"
                  style={{ width: `${Math.min(100, Math.max(5, questionCount * 2))}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

