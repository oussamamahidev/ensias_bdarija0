"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { MessageSquare, Tag, Users, HelpCircle } from "lucide-react"

interface StatsCounterProps {
  stats: {
    questions: number
    answers: number
    users: number
    tags: number
  }
}

const StatsCounter = ({ stats }: StatsCounterProps) => {
  const [counts, setCounts] = useState({
    questions: 0,
    answers: 0,
    users: 0,
    tags: 0,
  })

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (!isInView) return

    const duration = 2000 // ms
    const frameDuration = 1000 / 60 // 60fps
    const totalFrames = Math.round(duration / frameDuration)

    let frame = 0
    const timer = setInterval(() => {
      frame++
      const progress = frame / totalFrames
      const easeOutQuart = 1 - Math.pow(1 - progress, 4) // Easing function

      setCounts({
        questions: Math.floor(easeOutQuart * stats.questions),
        answers: Math.floor(easeOutQuart * stats.answers),
        users: Math.floor(easeOutQuart * stats.users),
        tags: Math.floor(easeOutQuart * stats.tags),
      })

      if (frame === totalFrames) {
        clearInterval(timer)
        setCounts(stats) // Ensure final values are exact
      }
    }, frameDuration)

    return () => clearInterval(timer)
  }, [isInView, stats])

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  return (
    <div ref={ref} className="mt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
      >
        <StatCard
          icon={<HelpCircle className="h-6 w-6 text-primary-500" />}
          label="Questions"
          value={formatNumber(counts.questions)}
          delay={0}
          isInView={isInView}
        />

        <StatCard
          icon={<MessageSquare className="h-6 w-6 text-blue-500" />}
          label="Answers"
          value={formatNumber(counts.answers)}
          delay={0.1}
          isInView={isInView}
        />

        <StatCard
          icon={<Users className="h-6 w-6 text-green-500" />}
          label="Users"
          value={formatNumber(counts.users)}
          delay={0.2}
          isInView={isInView}
        />

        <StatCard
          icon={<Tag className="h-6 w-6 text-yellow-500" />}
          label="Tags"
          value={formatNumber(counts.tags)}
          delay={0.3}
          isInView={isInView}
        />
      </motion.div>
    </div>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  delay: number
  isInView: boolean
}

const StatCard = ({ icon, label, value, delay, isInView }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="bg-white dark:bg-gray-800/80 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 transform hover:translate-y-[-4px] flex flex-col items-center justify-center text-center"
    >
      <div className="mb-3 p-3 rounded-full bg-gray-100 dark:bg-gray-700/50">{icon}</div>
      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </motion.div>
  )
}

export default StatsCounter

