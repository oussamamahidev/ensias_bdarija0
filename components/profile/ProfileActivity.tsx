"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { MessageSquare, ThumbsUp, Award, Eye, HelpCircle, Clock } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { getUserQuestion, getUserAnswers } from "@/lib/actions/user.action"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProfileActivityProps {
  userId: string
}

const ProfileActivity = ({ userId }: ProfileActivityProps) => {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const activityRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Fetch real user questions and answers
        const [questionsData, answersData] = await Promise.all([
          getUserQuestion({ userId, page: 1, pageSize: 5 }),
          getUserAnswers({ userId, page: 1, pageSize: 5 }),
        ])

        // Transform questions into activity items
        const questionActivities = questionsData.questions.map((question: any) => ({
          id: `question-${question._id}`,
          type: "question",
          title: question.title,
          date: new Date(question.createdAt),
          link: `/question/${question._id}`,
          stats: {
            views: question.views,
            answers: question.answers?.length || 0,
            upvotes: question.upvotes?.length || 0,
          },
        }))

        // Transform answers into activity items
        const answerActivities = answersData.answers.map((answer: any) => ({
          id: `answer-${answer._id}`,
          type: "answer",
          title: `Answered: ${answer.question.title}`,
          date: new Date(answer.createdAt),
          link: `/question/${answer.question._id}#answer-${answer._id}`,
          stats: { upvotes: answer.upvotes?.length || 0 },
        }))

        // Add some mock activities for a more complete timeline
        const mockActivities = [
          {
            id: "badge-1",
            type: "badge",
            title: 'Earned "Helpful" badge',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            link: "/profile/badges",
          },
          {
            id: "upvote-1",
            type: "upvote",
            title: "Your answer was upvoted 5 times",
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            link: "/question/some-id#answer-some-id",
          },
        ]

        // Combine and sort by date
        const allActivities = [...questionActivities, ...answerActivities, ...mockActivities].sort(
          (a, b) => b.date.getTime() - a.date.getTime(),
        )

        setActivities(allActivities)
      } catch (error) {
        console.error("Error fetching activities:", error)
        // Fallback to empty array
        setActivities([])
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [userId])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "question":
        return <HelpCircle size={18} className="text-blue-500" />
      case "answer":
        return <MessageSquare size={18} className="text-green-500" />
      case "upvote":
        return <ThumbsUp size={18} className="text-primary-500" />
      case "badge":
        return <Award size={18} className="text-yellow-500" />
      default:
        return <Clock size={18} className="text-gray-500" />
    }
  }

  const filteredActivities = activities.filter((activity) => {
    if (activeTab === "all") return true
    return activity.type === activeTab
  })

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-800 animate-pulse h-20 rounded-lg"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6" ref={activityRef}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="all" className="text-sm">
            All Activity
          </TabsTrigger>
          <TabsTrigger value="question" className="text-sm">
            Questions
          </TabsTrigger>
          <TabsTrigger value="answer" className="text-sm">
            Answers
          </TabsTrigger>
          <TabsTrigger value="badge" className="text-sm">
            Badges
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <p className="text-gray-500 dark:text-gray-400">No activity found</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

              {filteredActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="relative pl-10 pb-6"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-0 bg-white dark:bg-gray-800 p-1 rounded-full z-10">
                    {getActivityIcon(activity.type)}
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        {activity.link ? (
                          <Link
                            href={activity.link}
                            className="text-gray-900 dark:text-white font-medium hover:text-primary-500 transition-colors"
                          >
                            {activity.title}
                          </Link>
                        ) : (
                          <p className="text-gray-900 dark:text-white font-medium">{activity.title}</p>
                        )}
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {formatDistanceToNow(activity.date, { addSuffix: true })}
                        </p>
                      </div>

                      {activity.stats && (
                        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                          {activity.stats.views && (
                            <div className="flex items-center gap-1">
                              <Eye size={14} />
                              <span>{activity.stats.views}</span>
                            </div>
                          )}
                          {activity.stats.answers && (
                            <div className="flex items-center gap-1">
                              <MessageSquare size={14} />
                              <span>{activity.stats.answers}</span>
                            </div>
                          )}
                          {activity.stats.upvotes && (
                            <div className="flex items-center gap-1">
                              <ThumbsUp size={14} />
                              <span>{activity.stats.upvotes}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProfileActivity

