"use client"

import { Users, Award, MessageSquare, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState, useRef } from "react"

interface CommunityStatsProps {
  stats: {
    totalUsers: number
    newThisWeek: number
    topContributors: number
    questionsAnswered: number
  }
}

export default function CommunityStats({ stats }: CommunityStatsProps) {
  const [counts, setCounts] = useState({
    totalUsers: 0,
    newThisWeek: 0,
    topContributors: 0,
    questionsAnswered: 0,
  })

  const ref = useRef(null)
  const isInView = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView.current) {
          isInView.current = true
          animateNumbers()
        }
      },
      { threshold: 0.1 },
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  const animateNumbers = () => {
    const duration = 2000 // ms
    const frameDuration = 1000 / 60 // 60fps
    const totalFrames = Math.round(duration / frameDuration)

    let frame = 0
    const timer = setInterval(() => {
      frame++
      const progress = frame / totalFrames
      const easeOutQuart = 1 - Math.pow(1 - progress, 4) // Easing function

      setCounts({
        totalUsers: Math.floor(easeOutQuart * stats.totalUsers),
        newThisWeek: Math.floor(easeOutQuart * stats.newThisWeek),
        topContributors: Math.floor(easeOutQuart * stats.topContributors),
        questionsAnswered: Math.floor(easeOutQuart * stats.questionsAnswered),
      })

      if (frame === totalFrames) {
        clearInterval(timer)
        setCounts(stats) // Ensure final values are exact
      }
    }, frameDuration)

    return () => clearInterval(timer)
  }

  const statItems = [
    {
      icon: <Users className="h-6 w-6 text-blue-500" />,
      value: counts.totalUsers.toLocaleString(),
      label: "Community Members",
      color: "bg-blue-500/10",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-green-500" />,
      value: `+${counts.newThisWeek.toLocaleString()}`,
      label: "New This Week",
      color: "bg-green-500/10",
    },
    {
      icon: <Award className="h-6 w-6 text-yellow-500" />,
      value: counts.topContributors.toLocaleString(),
      label: "Top Contributors",
      color: "bg-yellow-500/10",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-purple-500" />,
      value: counts.questionsAnswered.toLocaleString(),
      label: "Questions Answered",
      color: "bg-purple-500/10",
    },
  ]

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
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

