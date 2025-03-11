"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import RenderTag from "./RenderTag"
import { getHotQuestions } from "@/lib/actions/question.action"
import { getTopPopularTags } from "@/lib/actions/tag.actions"
import { getTopContributors } from "@/lib/actions/user.action"
import { ChevronRight, ChevronDown, ChevronUp, TrendingUp, Award, Lightbulb } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"

const RightSidebar = () => {
  const [hotQuestions, setHotQuestions] = useState<any[]>([])
  const [popularTags, setPopularTags] = useState<any[]>([])
  const [contributors, setContributors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState({
    questions: true,
    tags: true,
    contributors: true,
    tips: true,
  })
  const [currentTip, setCurrentTip] = useState(0)

  // Mock data for tips
  const tips = [
    "You can use the '@' symbol to mention users in your questions or answers.",
    "Pressing 'Ctrl+K' will open the search dialog from anywhere on the site.",
    "Adding code snippets with proper formatting increases your chances of getting answers.",
    "You can earn badges by actively participating in the community.",
    "Use the 'Save' feature to bookmark questions for later reference.",
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionsData, tagsData, contributorsData] = await Promise.all([
          getHotQuestions(),
          getTopPopularTags(),
          getTopContributors(),
        ])

        // Serialize the MongoDB documents to plain JavaScript objects
        setHotQuestions(JSON.parse(JSON.stringify(questionsData)))
        setPopularTags(JSON.parse(JSON.stringify(tagsData)))
        setContributors(contributorsData)
      } catch (error) {
        console.error("Error fetching sidebar data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Rotate tips every 10 seconds
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length)
    }, 10000)

    return () => clearInterval(tipInterval)
  }, [])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

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
    <motion.section
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }} // Reduced from default duration
      className="custom-scrollbar fixed right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto overflow-x-hidden border-l border-l-light-700/50 dark:border-l-dark-300/50 bg-white dark:bg-gray-900/80 p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden z-10"
    >
      {/* Hot Questions Section */}
      <div className="mb-6">
        <button onClick={() => toggleSection("questions")} className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-primary-500" />
            <h3 className="h3-bold text-dark200_light900">Hot Questions</h3>
          </div>
          {expandedSections.questions ? (
            <ChevronUp size={16} className="text-dark200_light900" />
          ) : (
            <ChevronDown size={16} className="text-dark200_light900" />
          )}
        </button>

        <AnimatePresence>
          {expandedSections.questions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }} // Reduced duration
              className="overflow-hidden"
            >
              <div className="mt-7 flex w-full flex-col gap-[30px]">
                {loading
                  ? Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4 rounded-full" />
                          <Skeleton className="h-5 w-full" />
                        </div>
                      ))
                  : hotQuestions.map((question, index) => (
                      <motion.div
                        key={question._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.1, delay: index * 0.05 }, // Reduced duration and delay
                        }}
                      >
                        <Link
                          href={`/question/${question._id}`}
                          className="group flex cursor-pointer items-center justify-between gap-7"
                        >
                          <p className="body-medium text-dark500_light700 group-hover:text-primary-500 transition-colors duration-200 line-clamp-1">
                            {question.title}
                          </p>
                          <ChevronRight className="h-5 w-5 text-light-500 dark:text-dark-500 group-hover:text-primary-500 transition-colors duration-200" />
                        </Link>
                      </motion.div>
                    ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Popular Tags Section */}
      <div className="mb-6">
        <button onClick={() => toggleSection("tags")} className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary-500"
            >
              <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path>
              <path d="M7 7h.01"></path>
            </svg>
            <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
          </div>
          {expandedSections.tags ? (
            <ChevronUp size={16} className="text-dark200_light900" />
          ) : (
            <ChevronDown size={16} className="text-dark200_light900" />
          )}
        </button>

        <AnimatePresence>
          {expandedSections.tags && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }} // Reduced duration
              className="overflow-hidden"
            >
              <div className="mt-7 flex flex-col gap-4">
                {loading
                  ? Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <Skeleton className="h-8 w-24 rounded-md" />
                          <Skeleton className="h-5 w-10" />
                        </div>
                      ))
                  : popularTags.map((tag, index) => (
                      <motion.div
                        key={tag._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.1, delay: index * 0.05 }, // Reduced duration and delay
                        }}
                      >
                        <RenderTag
                          key={tag._id}
                          _id={tag._id}
                          name={tag.name}
                          totalQuestions={tag.numberOfQuestions}
                          showCount
                        />
                      </motion.div>
                    ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Top Contributors Section */}
      <div className="mb-6">
        <button onClick={() => toggleSection("contributors")} className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-primary-500" />
            <h3 className="h3-bold text-dark200_light900">Top Contributors</h3>
          </div>
          {expandedSections.contributors ? (
            <ChevronUp size={16} className="text-dark200_light900" />
          ) : (
            <ChevronDown size={16} className="text-dark200_light900" />
          )}
        </button>

        <AnimatePresence>
          {expandedSections.contributors && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }} // Reduced duration
              className="overflow-hidden"
            >
              <div className="mt-7 flex flex-col gap-4">
                {loading
                  ? Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div>
                              <Skeleton className="h-4 w-24 mb-1" />
                              <Skeleton className="h-3 w-16" />
                            </div>
                          </div>
                          <Skeleton className="h-8 w-16 rounded-md" />
                        </div>
                      ))
                  : contributors.slice(0, 3).map((contributor, index) => (
                      <motion.div
                        key={contributor._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.1, delay: index * 0.05 }, // Reduced duration and delay
                        }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar>
                              <AvatarImage src={contributor.picture} alt={contributor.name} />
                              <AvatarFallback>{contributor.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div
                              className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full ${getBadgeColor(contributor.badge)} border-2 border-white dark:border-gray-900`}
                            ></div>
                          </div>
                          <div>
                            <p className="body-medium text-dark500_light700">{contributor.name}</p>
                            <p className="small-regular text-dark400_light700">{contributor.reputation} points</p>
                          </div>
                        </div>
                        <Link href={`/profile/${contributor._id}`}>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="rounded-full hover:bg-primary-500/10 hover:text-primary-500"
                          >
                            View
                          </Button>
                        </Link>
                      </motion.div>
                    ))}
                {!loading && contributors.length > 3 && (
                  <Link href="/community" className="mt-2 text-center">
                    <Button variant="ghost" size="sm" className="w-full text-primary-500 hover:text-primary-600">
                      View All Contributors
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Did You Know Section */}
      <div>
        <button onClick={() => toggleSection("tips")} className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb size={18} className="text-primary-500" />
            <h3 className="h3-bold text-dark200_light900">Did You Know?</h3>
          </div>
          {expandedSections.tips ? (
            <ChevronUp size={16} className="text-dark200_light900" />
          ) : (
            <ChevronDown size={16} className="text-dark200_light900" />
          )}
        </button>

        <AnimatePresence>
          {expandedSections.tips && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }} // Reduced duration
              className="overflow-hidden"
            >
              <div className="mt-7">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTip}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }} // Reduced duration
                    className="bg-light-800 dark:bg-dark-300 rounded-xl p-4 text-dark500_light700"
                  >
                    <p className="text-sm">{tips[currentTip]}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {tips.map((_, i) => (
                          <div
                            key={i}
                            className={`h-1.5 w-1.5 rounded-full ${i === currentTip ? "bg-primary-500" : "bg-gray-300 dark:bg-gray-600"}`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => setCurrentTip((prev) => (prev + 1) % tips.length)}
                        className="text-xs text-primary-500 hover:underline"
                      >
                        Next Tip
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  )
}

export default RightSidebar

