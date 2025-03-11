"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MessageSquare, ThumbsUp, Award, Eye, Calendar } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { getUserQuestion, getUserAnswers } from "@/lib/actions/user.action"

interface ProfileActivityProps {
  userId: string
}

const ProfileActivity = ({ userId }: ProfileActivityProps) => {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Fetch real user questions and answers
        const [questionsData, answersData] = await Promise.all([
          getUserQuestion({ userId, page: 1, pageSize: 3 }),
          getUserAnswers({ userId, page: 1, pageSize: 3 }),
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

        // Combine and sort by date
        const allActivities = [...questionActivities, ...answerActivities].sort(
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
        return <Calendar size={18} className="text-gray-500" />
    }
  }

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
    <div className="space-y-4">
      {activities.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">No activity yet</p>
        </div>
      ) : (
        activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">{getActivityIcon(activity.type)}</div>
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
          </motion.div>
        ))
      )}
    </div>
  )
}

export default ProfileActivity

// Helper component for the icon
const HelpCircle = ({ size, className }: { size: number; className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <path d="M12 17h.01"></path>
    </svg>
  )
}

