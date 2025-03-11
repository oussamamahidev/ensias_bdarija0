"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Award, Zap, MessageSquare, ThumbsUp } from "lucide-react"
import { getTopInterectedTags } from "@/lib/actions/tag.actions"

interface Props {
  user: {
    _id: string
    clerkId: string
    picture: string
    name: string
    username: string
    reputation?: number
    badge?: string
  }
}

const UserCard = ({ user }: Props) => {
  const [interactedTags, setInteractedTags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getTopInterectedTags({
          userId: user._id,
        })
        setInteractedTags(tags)
      } catch (error) {
        console.error("Error fetching tags:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTags()
  }, [user._id])

  // Get badge color based on badge type
  const getBadgeColor = (badge?: string) => {
    if (!badge) return ""

    switch (badge.toLowerCase()) {
      case "gold":
        return "bg-yellow-500"
      case "silver":
        return "bg-gray-400"
      case "bronze":
        return "bg-amber-700"
      default:
        return "bg-primary-500"
    }
  }

  // Mock stats - in a real app, these would come from the user object
  const stats = {
    posts: user.reputation ? Math.floor(user.reputation / 100) : 12,
    answers: user.reputation ? Math.floor(user.reputation / 50) : 48,
    reputation: user.reputation || 1200,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="w-full h-full"
    >
      <Link href={`/profile/${user.clerkId}`} className="block w-full h-full">
        <div className="bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col overflow-hidden relative">
          {/* Animated gradient border on hover */}
          <motion.div
            className="absolute inset-0 opacity-0 pointer-events-none"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-primary-500/30 to-orange-300/30 bg-clip-border" />
          </motion.div>

          {/* Card content */}
          <div className="flex flex-col items-center z-10">
            <div className="relative">
              <div className="relative group/avatar">
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500/30 to-orange-300/30 blur-sm opacity-0"
                  animate={{ opacity: isHovered ? 0.7 : 0, scale: isHovered ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }}
                />
                <Image
                  src={user.picture || "/assets/images/user.svg"}
                  alt="user profile picture"
                  width={80}
                  height={80}
                  className="rounded-full border-2 border-primary-500/20 object-cover z-10 relative"
                />
              </div>

              {user.badge && (
                <div
                  className={`absolute -bottom-1 -right-1 ${getBadgeColor(user.badge)} w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 z-20`}
                ></div>
              )}
            </div>

            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">{user.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">@{user.username}</p>
            </div>
          </div>

          <div className="mt-6 flex-grow flex flex-col justify-end">
            {loading ? (
              <div className="flex flex-wrap justify-center gap-2">
                {[1, 2].map((i) => (
                  <div key={i} className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                ))}
              </div>
            ) : interactedTags && interactedTags.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-2">
                {interactedTags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag._id}
                    className="bg-primary-500/10 text-primary-600 dark:text-primary-400 hover:bg-primary-500/20 transition-colors"
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full border-none px-3 py-1 mx-auto">
                No tags yet
              </Badge>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-center gap-3 text-sm">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
                          <span className="font-semibold text-gray-900 dark:text-white">{stats.posts}</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Posts</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Questions posted</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3.5 w-3.5 text-green-500" />
                          <span className="font-semibold text-gray-900 dark:text-white">{stats.answers}</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Answers</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Answers provided</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1">
                          <Award className="h-3.5 w-3.5 text-primary-500" />
                          <span className="font-semibold text-gray-900 dark:text-white">{stats.reputation}</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Rep</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reputation points</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          {/* Pro badge for some users */}
          {user.reputation && user.reputation > 1000 && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-primary-500/10 text-primary-500 hover:bg-primary-500/20 px-2 py-1 flex items-center gap-1">
                <Zap className="h-3 w-3" />
                <span className="text-xs">Pro</span>
              </Badge>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

export default UserCard

