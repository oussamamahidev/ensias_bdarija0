"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Award, MessageSquare, HelpCircle, Star } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ProfileStatsProps {
  reputation: number
  totalQuestions: number
  totalAnswers: number
  badges: {
    GOLD: number
    SILVER: number
    BRONZE: number
  }
}

const ProfileStats = ({ reputation, totalQuestions, totalAnswers, badges }: ProfileStatsProps) => {
  const [mounted, setMounted] = useState(false)
  const [animatedReputation, setAnimatedReputation] = useState(0)

  useEffect(() => {
    setMounted(true)

    // Animate reputation counter
    const duration = 1500 // ms
    const interval = 20 // ms
    const steps = duration / interval
    const increment = reputation / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= reputation) {
        current = reputation
        clearInterval(timer)
      }
      setAnimatedReputation(Math.floor(current))
    }, interval)

    return () => clearInterval(timer)
  }, [reputation])

  if (!mounted) return null

  const badgeItems = [
    { type: "GOLD", icon: <Star className="text-yellow-500" size={18} />, count: badges.GOLD },
    { type: "SILVER", icon: <Star className="text-gray-400" size={18} />, count: badges.SILVER },
    { type: "BRONZE", icon: <Star className="text-amber-700" size={18} />, count: badges.BRONZE },
  ]

  const statItems = [
    {
      title: "Reputation",
      value: animatedReputation,
      icon: <Award className="text-primary-500" size={20} />,
      description: "Points earned from your contributions",
    },
    {
      title: "Questions",
      value: totalQuestions,
      icon: <HelpCircle className="text-blue-500" size={20} />,
      description: "Questions you have asked",
    },
    {
      title: "Answers",
      value: totalAnswers,
      icon: <MessageSquare className="text-green-500" size={20} />,
      description: "Answers you have provided",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Reputation and Stats Cards */}
        {statItems.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center">
                    <div className="mb-2">{stat.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{stat.value.toLocaleString()}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.title}</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{stat.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        ))}

        {/* Badges Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex flex-col items-center">
            <div className="mb-2 flex items-center gap-1">
              {badgeItems.map((badge) => (
                <span key={badge.type}>{badge.icon}</span>
              ))}
            </div>
            <div className="flex items-center gap-3">
              {badgeItems.map((badge) => (
                <div key={badge.type} className="flex flex-col items-center">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{badge.count}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {badge.type.charAt(0) + badge.type.slice(1).toLowerCase()}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Badges</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ProfileStats

