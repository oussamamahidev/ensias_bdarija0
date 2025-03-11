"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Award, MessageSquare, HelpCircle, Star, Zap, Trophy, Gift } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface StatsProps {
  reputation: number
  totalQuestions: number
  totalAnswers: number
  badges: {
    GOLD: number
    SILVER: number
    BRONZE: number
  }
}

const Stats = ({ reputation, totalQuestions, totalAnswers, badges }: StatsProps) => {
  const [mounted, setMounted] = useState(false)
  const [animatedReputation, setAnimatedReputation] = useState(0)
  const [animatedQuestions, setAnimatedQuestions] = useState(0)
  const [animatedAnswers, setAnimatedAnswers] = useState(0)
  const [animationComplete, setAnimationComplete] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(statsRef, { once: true })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isInView && !animationComplete) {
      // Animate counters
      const duration = 1500 // ms
      const interval = 20 // ms
      const steps = duration / interval

      const repIncrement = reputation / steps
      const questionsIncrement = totalQuestions / steps
      const answersIncrement = totalAnswers / steps

      let currentRep = 0
      let currentQuestions = 0
      let currentAnswers = 0

      const timer = setInterval(() => {
        currentRep += repIncrement
        currentQuestions += questionsIncrement
        currentAnswers += answersIncrement

        if (currentRep >= reputation) currentRep = reputation
        if (currentQuestions >= totalQuestions) currentQuestions = totalQuestions
        if (currentAnswers >= totalAnswers) currentAnswers = totalAnswers

        setAnimatedReputation(Math.floor(currentRep))
        setAnimatedQuestions(Math.floor(currentQuestions))
        setAnimatedAnswers(Math.floor(currentAnswers))

        if (currentRep >= reputation && currentQuestions >= totalQuestions && currentAnswers >= totalAnswers) {
          clearInterval(timer)
          setAnimationComplete(true)
        }
      }, interval)

      return () => clearInterval(timer)
    }
  }, [isInView, reputation, totalQuestions, totalAnswers, animationComplete])

  if (!mounted) return null

  const badgeItems = [
    {
      type: "GOLD",
      icon: <Star className="text-yellow-500" size={18} />,
      count: badges.GOLD,
      color: "from-yellow-500/20 to-yellow-500/5 border-yellow-500/20",
    },
    {
      type: "SILVER",
      icon: <Star className="text-gray-400" size={18} />,
      count: badges.SILVER,
      color: "from-gray-400/20 to-gray-400/5 border-gray-400/20",
    },
    {
      type: "BRONZE",
      icon: <Star className="text-amber-700" size={18} />,
      count: badges.BRONZE,
      color: "from-amber-700/20 to-amber-700/5 border-amber-700/20",
    },
  ]

  // Calculate progress percentages for visualization
  const maxValue = Math.max(reputation, totalQuestions * 100, totalAnswers * 50)
  const reputationPercentage = (reputation / maxValue) * 100
  const questionsPercentage = ((totalQuestions * 100) / maxValue) * 100
  const answersPercentage = ((totalAnswers * 50) / maxValue) * 100

  // Calculate level based on reputation
  const level = Math.floor(Math.log(reputation + 1) / Math.log(1.5))
  const nextLevelRep = Math.floor(Math.pow(1.5, level + 1))
  const levelProgress =
    ((reputation - Math.floor(Math.pow(1.5, level))) / (nextLevelRep - Math.floor(Math.pow(1.5, level)))) * 100

  return (
    <motion.div
      ref={statsRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* Level indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.3 }}
        className="mb-6 bg-gradient-to-br from-primary-500/10 to-primary-500/5 dark:from-primary-500/20 dark:to-primary-500/5 rounded-xl p-4 shadow-sm border border-primary-500/20 dark:border-primary-500/10"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy className="text-primary-500" size={20} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Level {level}</h3>
          </div>
          <Badge className="bg-primary-500/20 text-primary-500 hover:bg-primary-500/30">
            <Zap className="h-3.5 w-3.5 mr-1" />
            {reputation < 1000 ? "Beginner" : reputation < 5000 ? "Intermediate" : "Expert"}
          </Badge>
        </div>
        <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${levelProgress}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-orange-300 rounded-full"
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
          <span>Level {level}</span>
          <span>
            {reputation.toLocaleString()} / {nextLevelRep.toLocaleString()} XP
          </span>
          <span>Level {level + 1}</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Reputation Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-gradient-to-br from-primary-500/10 to-primary-500/5 dark:from-primary-500/20 dark:to-primary-500/5 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-primary-500/20 dark:border-primary-500/10 group"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1, rotate: [0, 15, 0] } : {}}
                    transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                    className="mb-2 relative"
                  >
                    <div className="absolute inset-0 bg-primary-500/20 blur-md rounded-full opacity-0 group-hover:opacity-70 transition-opacity" />
                    <Award
                      className="text-primary-500 relative z-10 transition-transform group-hover:scale-110"
                      size={28}
                    />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
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
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 dark:from-blue-500/20 dark:to-blue-500/5 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-blue-500/20 dark:border-blue-500/10 group"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1, rotate: [0, 15, 0] } : {}}
                    transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                    className="mb-2 relative"
                  >
                    <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-full opacity-0 group-hover:opacity-70 transition-opacity" />
                    <HelpCircle
                      className="text-blue-500 relative z-10 transition-transform group-hover:scale-110"
                      size={28}
                    />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-bold text-gray-900 dark:text-white"
                  >
                    {animatedQuestions.toLocaleString()}
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
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-gradient-to-br from-green-500/10 to-green-500/5 dark:from-green-500/20 dark:to-green-500/5 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-green-500/20 dark:border-green-500/10 group"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1, rotate: [0, 15, 0] } : {}}
                    transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
                    className="mb-2 relative"
                  >
                    <div className="absolute inset-0 bg-green-500/20 blur-md rounded-full opacity-0 group-hover:opacity-70 transition-opacity" />
                    <MessageSquare
                      className="text-green-500 relative z-10 transition-transform group-hover:scale-110"
                      size={28}
                    />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.5 }}
                    className="text-2xl font-bold text-gray-900 dark:text-white"
                  >
                    {animatedAnswers.toLocaleString()}
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
      </div>

      {/* Badges Section */}
      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-center gap-6">
          {badgeItems.map((badge) => (
            <motion.div
              key={badge.type}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                delay: 0.6 + (badge.type === "GOLD" ? 0 : badge.type === "SILVER" ? 0.1 : 0.2),
                type: "spring",
              }}
              className={`flex flex-col items-center bg-gradient-to-br ${badge.color} rounded-lg p-3 hover:shadow-md transition-all duration-300`}
            >
              <div className="flex items-center gap-1.5">
                {badge.icon}
                <span className="text-lg font-bold text-gray-900 dark:text-white">{badge.count}</span>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {badge.type.charAt(0) + badge.type.slice(1).toLowerCase()}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Achievement Teaser */}
        {reputation > 500 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="mt-6 text-center"
          >
            <Badge className="bg-gradient-to-r from-primary-500/20 to-orange-300/20 text-primary-500 hover:from-primary-500/30 hover:to-orange-300/30 px-3 py-1.5">
              <Gift className="h-3.5 w-3.5 mr-1.5" />
              <span>Unlock more achievements by contributing!</span>
            </Badge>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default Stats
