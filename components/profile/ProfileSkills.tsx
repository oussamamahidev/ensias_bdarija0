"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Code, Zap } from "lucide-react"

interface Skill {
  name: string
  level: number
}

interface ProfileSkillsProps {
  skills: Skill[]
}

const ProfileSkills = ({ skills }: ProfileSkillsProps) => {
  const skillsRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(skillsRef, { once: true })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Get color based on skill level
  const getColorClass = (level: number) => {
    if (level >= 90) return "bg-green-500"
    if (level >= 70) return "bg-blue-500"
    if (level >= 50) return "bg-primary-500"
    if (level >= 30) return "bg-amber-500"
    return "bg-gray-500"
  }

  // Get level text based on skill level
  const getLevelText = (level: number) => {
    if (level >= 90) return "Expert"
    if (level >= 70) return "Advanced"
    if (level >= 50) return "Intermediate"
    if (level >= 30) return "Basic"
    return "Beginner"
  }

  return (
    <div ref={skillsRef} className="space-y-4">
      {skills.map((skill, index) => (
        <div key={skill.name} className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-primary-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Zap className="h-3 w-3 text-primary-500" />
                    <span>{getLevelText(skill.level)}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{skill.level}% proficiency</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
              transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
              className={`h-full ${getColorClass(skill.level)} rounded-full`}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProfileSkills

