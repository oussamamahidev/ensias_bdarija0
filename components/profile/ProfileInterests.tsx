"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Sparkles, Code, Database, Cloud, Palette, Brain, Globe, Server, Cpu } from "lucide-react"

interface ProfileInterestsProps {
  interests: string[]
}

const ProfileInterests = ({ interests }: ProfileInterestsProps) => {
  // Map of interest categories to icons and colors
  const interestIcons: Record<string, { icon: React.ReactNode; color: string }> = {
    "Web Development": {
      icon: <Code className="h-3.5 w-3.5" />,
      color: "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30",
    },
    "UI/UX Design": {
      icon: <Palette className="h-3.5 w-3.5" />,
      color: "bg-purple-500/20 text-purple-500 hover:bg-purple-500/30",
    },
    "Machine Learning": {
      icon: <Brain className="h-3.5 w-3.5" />,
      color: "bg-green-500/20 text-green-500 hover:bg-green-500/30",
    },
    "Open Source": {
      icon: <Globe className="h-3.5 w-3.5" />,
      color: "bg-orange-500/20 text-orange-500 hover:bg-orange-500/30",
    },
    "Cloud Computing": {
      icon: <Cloud className="h-3.5 w-3.5" />,
      color: "bg-sky-500/20 text-sky-500 hover:bg-sky-500/30",
    },
    Databases: {
      icon: <Database className="h-3.5 w-3.5" />,
      color: "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30",
    },
    Backend: {
      icon: <Server className="h-3.5 w-3.5" />,
      color: "bg-indigo-500/20 text-indigo-500 hover:bg-indigo-500/30",
    },
    Hardware: {
      icon: <Cpu className="h-3.5 w-3.5" />,
      color: "bg-red-500/20 text-red-500 hover:bg-red-500/30",
    },
  }

  // Default for interests without a specific icon
  const defaultInterest = {
    icon: <Sparkles className="h-3.5 w-3.5" />,
    color: "bg-gray-500/20 text-gray-500 hover:bg-gray-500/30",
  }

  return (
    <div className="flex flex-wrap gap-2">
      {interests.map((interest, index) => {
        const interestConfig = interestIcons[interest] || defaultInterest

        return (
          <Badge key={index} className={`${interestConfig.color} transition-all duration-300 hover:scale-105`}>
            {interestConfig.icon}
            <span className="ml-1">{interest}</span>
          </Badge>
        )
      })}
    </div>
  )
}

export default ProfileInterests

