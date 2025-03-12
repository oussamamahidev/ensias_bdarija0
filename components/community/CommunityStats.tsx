"use client"

import { Users, Award, MessageSquare, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

interface CommunityStatsProps {
  stats: {
    totalUsers: number
    newThisWeek: number
    topContributors: number
    questionsAnswered: number
  }
}

export default function CommunityStats({ stats }: CommunityStatsProps) {
  const statItems = [
    {
      icon: <Users className="h-6 w-6 text-blue-500" />,
      value: stats.totalUsers.toLocaleString(),
      label: "Community Members",
      color: "bg-blue-500/10",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-green-500" />,
      value: `+${stats.newThisWeek.toLocaleString()}`,
      label: "New This Week",
      color: "bg-green-500/10",
    },
    {
      icon: <Award className="h-6 w-6 text-yellow-500" />,
      value: stats.topContributors.toLocaleString(),
      label: "Top Contributors",
      color: "bg-yellow-500/10",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-purple-500" />,
      value: stats.questionsAnswered.toLocaleString(),
      label: "Questions Answered",
      color: "bg-purple-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
      {statItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="card-wrapper rounded-xl p-6 border border-gray-100 dark:border-gray-700 animate-slide-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div className={`mb-3 p-3 rounded-full ${item.color}`}>{item.icon}</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{item.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{item.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

