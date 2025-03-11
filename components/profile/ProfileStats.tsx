"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Award, MessageSquare, HelpCircle, Star, TrendingUp, Users, Eye } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"

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
  const [animationComplete, setAnimationComplete] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)
  const isVisible = useIntersectionObserver(statsRef, { threshold: 0.1 })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isVisible && !animationComplete) {
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
          setAnimationComplete(true)
        }
        setAnimatedReputation(Math.floor(current))
      }, interval)

      return () => clearInterval(timer)
    }
  }, [isVisible, reputation, animationComplete])

  if (!mounted) return null

  const badgeItems = [
    { type: "GOLD", icon: <Star className="text-yellow-500" size={18} />, count: badges.GOLD },
    { type: "SILVER", icon: <Star className="text-gray-400" size={18} />, count: badges.SILVER },
    { type: "BRONZE", icon: <Star className="text-amber-700" size={18} />, count: badges.BRONZE },
  ]

  // Calculate progress percentages for visualization
  const maxValue = Math.max(reputation, totalQuestions * 100, totalAnswers * 50)
  const reputationPercentage = (reputation / maxValue) * 100
  const questionsPercentage = ((totalQuestions * 100) / maxValue) * 100
  const answersPercentage = ((totalAnswers * 50) / maxValue) * 100

  return (
    <motion.div
      ref={statsRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Reputation Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-gradient-to-br from-primary-500/10 to-primary-500/5 dark:from-primary-500/20 dark:to-primary-500/5 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-primary-500/20 dark:border-primary-500/10"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isVisible ? { scale: 1, rotate: [0, 15, 0] } : {}}
                    transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                    className="mb-2"
                  >
                    <Award className="text-primary-500" size={28} />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={isVisible ? { opacity: 1 } : {}}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold text-gray-900 dark:text-white"
                  >
                    {animatedReputation.toLocaleString()}
                  </motion.h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Reputation</p>
                  <Progress value={reputationPercentage} className="h-1.5 w-full mt-2" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Points earned from your contributions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>

        {/* Questions Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 dark:from-blue-500/20 dark:to-blue-500/5 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-blue-500/20 dark:border-blue-500/10"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isVisible ? { scale: 1, rotate: [0, 15, 0] } : {}}
                    transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                    className="mb-2"
                  >
                    <HelpCircle className="text-blue-500" size={28} />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={isVisible ? { opacity: 1 } : {}}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-bold text-gray-900 dark:text-white"
                  >
                    {totalQuestions.toLocaleString()}
                  </motion.h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Questions</p>
                  <Progress value={questionsPercentage} className="h-1.5 w-full mt-2 bg-blue-100 dark:bg-blue-950">
                    <div className="h-full bg-blue-500 rounded-full" />
                  </Progress>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Questions you have asked</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>

        {/* Answers Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-gradient-to-br from-green-500/10 to-green-500/5 dark:from-green-500/20 dark:to-green-500/5 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-green-500/20 dark:border-green-500/10"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isVisible ? { scale: 1, rotate: [0, 15, 0] } : {}}
                    transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
                    className="mb-2"
                  >
                    <MessageSquare className="text-green-500" size={28} />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={isVisible ? { opacity: 1 } : {}}
                    transition={{ delay: 0.5 }}
                    className="text-2xl font-bold text-gray-900 dark:text-white"
                  >
                    {totalAnswers.toLocaleString()}
                  </motion.h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Answers</p>
                  <Progress value={answersPercentage} className="h-1.5 w-full mt-2 bg-green-100 dark:bg-green-950">
                    <div className="h-full bg-green-500 rounded-full" />
                  </Progress>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Answers you have provided</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>

        {/* Badges Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 dark:from-yellow-500/20 dark:to-yellow-500/5 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-yellow-500/20 dark:border-yellow-500/10"
        >
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={isVisible ? { scale: 1, rotate: [0, 15, 0] } : {}}
              transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
              className="mb-2 flex items-center gap-1"
            >
              {badgeItems.map((badge) => (
                <span key={badge.type}>{badge.icon}</span>
              ))}
            </motion.div>
            <div className="flex items-center gap-3">
              {badgeItems.map((badge) => (
                <motion.div
                  key={badge.type}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.6 + (badge.type === "GOLD" ? 0 : badge.type === "SILVER" ? 0.1 : 0.2) }}
                  className="flex flex-col items-center"
                >
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{badge.count}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {badge.type.charAt(0) + badge.type.slice(1).toLowerCase()}
                  </span>
                </motion.div>
              ))}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Badges</p>
          </div>
        </motion.div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col items-center"
        >
          <TrendingUp size={20} className="text-purple-500 mb-1" />
          <p className="text-lg font-semibold text-gray-900 dark:text-white">87%</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Accept Rate</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col items-center"
        >
          <Users size={20} className="text-indigo-500 mb-1" />
          <p className="text-lg font-semibold text-gray-900 dark:text-white">1.2k</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">People Reached</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col items-center"
        >
          <Eye size={20} className="text-cyan-500 mb-1" />
          <p className="text-lg font-semibold text-gray-900 dark:text-white">5.4k</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Profile Views</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Custom hook for intersection observer
function useIntersectionObserver(
  elementRef: React.RefObject<Element | null>,
  { threshold = 0, root = null, rootMargin = "0%" }: IntersectionObserverInit = {},
): boolean {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = elementRef?.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold, root, rootMargin },
    )

    observer.observe(element)
    return () => observer.unobserve(element)
  }, [elementRef, threshold, root, rootMargin])

  return isVisible
}

export default ProfileStats

