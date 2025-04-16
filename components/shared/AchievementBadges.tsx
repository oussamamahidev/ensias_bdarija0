"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Award, Trophy, Star, Zap, MessageSquare, ThumbsUp, Gift, Sparkles, BookOpen } from "lucide-react"

interface AchievementBadgesProps {
  userId: string
}

const AchievementBadges = ({ userId }: AchievementBadgesProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Mock achievements - in a real app, these would come from your database
  const achievements = [
    {
      id: "first-question",
      name: "First Question",
      description: "Asked your first question",
      icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
      earned: true,
      date: "2023-09-15",
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    {
      id: "helpful-answer",
      name: "Helpful Answer",
      description: "Provided an answer that received 10+ upvotes",
      icon: <ThumbsUp className="h-4 w-4 text-green-500" />,
      earned: true,
      date: "2023-10-22",
      color: "bg-green-500/10 text-green-500 border-green-500/20",
    },
    {
      id: "rising-star",
      name: "Rising Star",
      description: "Earned 500+ reputation points",
      icon: <Star className="h-4 w-4 text-amber-500" />,
      earned: true,
      date: "2023-11-05",
      color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    },
    {
      id: "knowledge-seeker",
      name: "Knowledge Seeker",
      description: "Read 50+ articles or questions",
      icon: <BookOpen className="h-4 w-4 text-purple-500" />,
      earned: true,
      date: "2023-12-10",
      color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    },
    {
      id: "top-contributor",
      name: "Top Contributor",
      description: "Ranked in the top 10% of contributors for a month",
      icon: <Trophy className="h-4 w-4 text-primary-500" />,
      earned: false,
      color: "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-600",
    },
    {
      id: "expert",
      name: "Subject Expert",
      description: "Provided 20+ answers in a specific category",
      icon: <Zap className="h-4 w-4 text-gray-400 dark:text-gray-500" />,
      earned: false,
      color: "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-600",
    },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {achievements.map((achievement, index) => (
        <TooltipProvider key={achievement.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Badge
                  className={`${achievement.color} border px-3 py-1.5 flex items-center gap-1.5 cursor-help transition-all duration-300 ${achievement.earned ? "hover:scale-110" : "opacity-60"}`}
                >
                  {achievement.icon}
                  <span>{achievement.name}</span>
                  {!achievement.earned && <Sparkles className="h-3 w-3 ml-1 text-gray-400 dark:text-gray-500" />}
                </Badge>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent className="p-3 max-w-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {achievement.icon}
                  <span className="font-semibold">{achievement.name}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{achievement.description}</p>
                {achievement.earned ? (
                  <div className="flex items-center gap-1.5 text-xs text-green-500">
                    <Award className="h-3.5 w-3.5" />
                    <span>
                      Earned {achievement.date ? `on ${new Date(achievement.date).toLocaleDateString()}` : "recently"}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Gift className="h-3.5 w-3.5" />
                    <span>Keep contributing to unlock this achievement!</span>
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  )
}

export default AchievementBadges

