"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Building2, Clock, TrendingUp, Users } from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const JobsStats = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const stats = [
    {
      icon: <TrendingUp className="h-5 w-5 text-emerald-500" />,
      value: "14.3k",
      label: "Active Jobs",
      trend: "+12% this month",
    },
    {
      icon: <Building2 className="h-5 w-5 text-blue-500" />,
      value: "2.8k",
      label: "Companies",
      trend: "Actively hiring",
    },
    {
      icon: <Users className="h-5 w-5 text-purple-500" />,
      value: "320k",
      label: "Job Seekers",
      trend: "In our network",
    },
    {
      icon: <Clock className="h-5 w-5 text-amber-500" />,
      value: "48h",
      label: "Avg. Time to Hire",
      trend: "For top candidates",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="border-none shadow-sm hover:shadow transition-all duration-300 bg-light-900 dark:bg-dark-300">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <h3 className="text-2xl font-bold mt-1 text-dark100_light900">{stat.value}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
                </div>
                <div className="rounded-full p-2 bg-background">{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export default JobsStats

