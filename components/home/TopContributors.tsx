"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { Award, ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getTopContributors } from "@/lib/actions/user.action"
import { Skeleton } from "@/components/ui/skeleton"

const TopContributors = () => {
  const [contributors, setContributors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const data = await getTopContributors()
        setContributors(data)
      } catch (error) {
        console.error("Error fetching top contributors:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContributors()
  }, [])

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "gold":
        return "bg-yellow-500"
      case "silver":
        return "bg-gray-400"
      case "bronze":
        return "bg-amber-700"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div ref={ref} className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Award className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Top Contributors</h2>
        </div>
        <Link
          href="/community"
          className="flex items-center text-primary-500 hover:text-primary-600 text-sm font-medium"
        >
          View all members
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {loading
          ? // Loading skeletons
            Array(5)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800/80 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
                >
                  <div className="flex flex-col items-center">
                    <Skeleton className="h-16 w-16 rounded-full mb-3" />
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-24 mb-3" />
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                </div>
              ))
          : // Actual content
            contributors.map((contributor, index) => (
              <motion.div
                key={contributor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link href={`/profile/${contributor._id}`}>
                  <div className="bg-white dark:bg-gray-800/80 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 transform hover:translate-y-[-4px] h-full flex flex-col items-center text-center">
                    <div className="relative mb-3">
                      <Avatar className="h-16 w-16 border-2 border-primary-500/20">
                        <AvatarImage src={contributor.picture} alt={contributor.name} />
                        <AvatarFallback>{contributor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full ${getBadgeColor(contributor.badge)} border-2 border-white dark:border-gray-800`}
                      ></div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{contributor.name}</h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">@{contributor.username}</p>

                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Badge className="bg-primary-500/10 text-primary-600 dark:text-primary-400">
                        {contributor.reputation.toLocaleString()} rep
                      </Badge>
                      <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        {contributor.answers} answers
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center">
                      {contributor.topTags &&
                        contributor.topTags.map((tag: any) => (
                          <span
                            key={tag._id}
                            className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                          >
                            {tag.name}
                          </span>
                        ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
      </div>
    </div>
  )
}

export default TopContributors

